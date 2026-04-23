import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { auth, db, functions } from '@/lib/firebase'

/**
 * Roles globales que permiten acceso al admin dashboard
 * Estos roles se definen en el campo `globalRole` del documento de cuenta
 */
export type GlobalRole = 'ADMIN' | 'SUPER_ADMIN' | 'SUPPORT' | 'ANALYST'

/**
 * Admin del SaaS (basado en globalRole de la cuenta)
 */
export interface SaaSAdmin {
  uid: string
  email: string
  displayName: string
  photoURL?: string | null
  globalRole: GlobalRole
  currentFarmId?: string
  createdAt: Date
  lastLogin?: Date
}

/**
 * Códigos de error tipados que el UI puede mapear a mensajes amigables.
 * Mantenemos código + mensaje técnico para debugging y un canal limpio para
 * que el formulario de login decida qué tono/icono mostrar.
 */
export type AuthErrorCode =
  | 'invalid-credentials'
  | 'invalid-email'
  | 'user-disabled'
  | 'too-many-requests'
  | 'network-error'
  | 'not-authorized'
  | 'account-not-found'
  | 'unknown'

export interface AuthError {
  code: AuthErrorCode
  message: string
  /** Información adicional para debug, no mostrar al usuario. */
  raw?: string
}

interface AuthState {
  admin: SaaSAdmin | null
  isLoading: boolean
  isInitialized: boolean
  error: AuthError | null

  /**
   * Indica si el sistema ya tiene al menos un admin.
   * `null` mientras se está consultando.
   */
  hasAnyAdmin: boolean | null
  isCheckingBootstrap: boolean

  // Acciones
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  initialize: () => () => void
  checkBootstrapStatus: () => Promise<boolean>
  bootstrapFirstAdmin: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>

  // Helpers
  isSuperAdmin: () => boolean
  hasRole: (...roles: GlobalRole[]) => boolean
}

// Roles que tienen acceso al admin dashboard
const ADMIN_ROLES: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'ANALYST']

/**
 * Mapea errores nativos de Firebase Auth a nuestro AuthError tipado.
 */
function mapFirebaseAuthError(error: unknown): AuthError {
  if (typeof error !== 'object' || error === null) {
    return { code: 'unknown', message: 'Ocurrió un error inesperado.' }
  }

  const err = error as { code?: string; message?: string }
  const raw = err.message

  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return {
        code: 'invalid-credentials',
        message: 'El correo o la contraseña son incorrectos.',
        raw,
      }
    case 'auth/invalid-email':
      return {
        code: 'invalid-email',
        message: 'El correo electrónico no tiene un formato válido.',
        raw,
      }
    case 'auth/user-disabled':
      return {
        code: 'user-disabled',
        message: 'Esta cuenta ha sido deshabilitada. Contacta al equipo de Gallinapp.',
        raw,
      }
    case 'auth/too-many-requests':
      return {
        code: 'too-many-requests',
        message: 'Demasiados intentos fallidos. Espera unos minutos antes de volver a intentarlo.',
        raw,
      }
    case 'auth/network-request-failed':
      return {
        code: 'network-error',
        message: 'No pudimos conectar con el servidor. Verifica tu conexión a internet.',
        raw,
      }
    default:
      return {
        code: 'unknown',
        message: err.message || 'Ocurrió un error inesperado al iniciar sesión.',
        raw,
      }
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  hasAnyAdmin: null,
  isCheckingBootstrap: false,

  checkBootstrapStatus: async () => {
    set({ isCheckingBootstrap: true })
    try {
      const callable = httpsCallable<unknown, { hasAdmin: boolean }>(functions, 'hasAnyAdmin')
      const result = await callable({})
      const hasAdmin = !!result.data?.hasAdmin
      set({ hasAnyAdmin: hasAdmin, isCheckingBootstrap: false })
      return hasAdmin
    } catch (err) {
      // Si la function falla (red, no desplegada, etc.) asumimos que sí hay admin
      // para no exponer la pantalla de bootstrap por error.
      console.error('checkBootstrapStatus failed', err)
      set({ hasAnyAdmin: true, isCheckingBootstrap: false })
      return true
    }
  },

  bootstrapFirstAdmin: async (email, password, displayName) => {
    set({ isLoading: true, error: null })
    try {
      const callable = httpsCallable<
        { email: string; password: string; displayName: string },
        { success: boolean; uid: string; message: string }
      >(functions, 'bootstrapFirstAdmin')
      await callable({ email, password, displayName })
      // Inmediatamente intentamos el login con esas credenciales
      await get().signIn(email, password)
      set({ hasAnyAdmin: true, isLoading: false })
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      const message =
        (err as { message?: string }).message ||
        'No se pudo crear el primer administrador'

      let authError: AuthError
      if (code === 'functions/failed-precondition') {
        authError = {
          code: 'not-authorized',
          message:
            'Ya existe un administrador. Recarga la página e inicia sesión con tu cuenta.',
        }
      } else if (code === 'functions/invalid-argument') {
        authError = { code: 'invalid-email', message }
      } else {
        authError = { code: 'unknown', message }
      }
      set({ error: authError, isLoading: false })
      throw authError
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Buscar la cuenta del usuario
      const accountDoc = await getDoc(doc(db, 'users', result.user.uid))

      if (!accountDoc.exists()) {
        await firebaseSignOut(auth)
        const authError: AuthError = {
          code: 'account-not-found',
          message: 'No encontramos una cuenta asociada. Pide a un administrador que la cree.',
        }
        set({ error: authError, isLoading: false })
        throw authError
      }

      const accountData = accountDoc.data()
      const globalRole = accountData.globalRole as GlobalRole | undefined

      // Verificar si tiene un rol de admin
      if (!globalRole || !ADMIN_ROLES.includes(globalRole)) {
        await firebaseSignOut(auth)
        const authError: AuthError = {
          code: 'not-authorized',
          message:
            'Tu cuenta no tiene permisos de administrador. Este panel es exclusivo para personal autorizado de Gallinapp.',
        }
        set({ error: authError, isLoading: false })
        throw authError
      }

      // Refrescar el ID token para que cualquier custom claim recién asignado
      // (super_admin, admin) esté disponible para Firestore rules.
      try {
        await result.user.getIdToken(true)
      } catch (refreshErr) {
        console.warn('Token refresh failed (non-fatal):', refreshErr)
      }

      const admin: SaaSAdmin = {
        uid: result.user.uid,
        email: result.user.email || accountData.email || email,
        displayName: result.user.displayName || accountData.displayName || 'Admin',
        photoURL: result.user.photoURL || accountData.photoURL,
        globalRole: globalRole,
        currentFarmId: accountData.currentFarmId,
        createdAt: accountData.createdAt?.toDate() || new Date(),
        lastLogin: new Date(),
      }

      set({ admin, isLoading: false })
    } catch (error) {
      // Si ya es nuestro AuthError tipado, lo dejamos pasar
      if (error && typeof error === 'object' && 'code' in error && typeof (error as AuthError).message === 'string') {
        // Ya seteado arriba en los casos tipados; nos aseguramos de no sobrescribir
        if (!get().error) {
          set({ error: error as AuthError, isLoading: false })
        }
        throw error
      }

      const mapped = mapFirebaseAuthError(error)
      set({ error: mapped, isLoading: false })
      throw mapped
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth)
      set({ admin: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },

  clearError: () => set({ error: null }),

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          // Buscar la cuenta del usuario
          const accountDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

          if (accountDoc.exists()) {
            const accountData = accountDoc.data()
            const globalRole = accountData.globalRole as GlobalRole | undefined

            // Solo permitir si tiene rol de admin
            if (globalRole && ADMIN_ROLES.includes(globalRole)) {
              const admin: SaaSAdmin = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || accountData.email || '',
                displayName: firebaseUser.displayName || accountData.displayName || 'Admin',
                photoURL: firebaseUser.photoURL || accountData.photoURL,
                globalRole: globalRole,
                currentFarmId: accountData.currentFarmId,
                createdAt: accountData.createdAt?.toDate() || new Date(),
                lastLogin: accountData.lastLogin?.toDate(),
              }

              set({ admin, isInitialized: true })
              return
            }
          }

          // Si no tiene permisos de admin
          set({ admin: null, isInitialized: true })
        } catch {
          set({ admin: null, isInitialized: true })
        }
      } else {
        set({ admin: null, isInitialized: true })
      }
    })

    return unsubscribe
  },

  isSuperAdmin: () => {
    const { admin } = get()
    return admin?.globalRole === 'SUPER_ADMIN'
  },

  hasRole: (...roles: GlobalRole[]) => {
    const { admin } = get()
    return admin ? roles.includes(admin.globalRole) : false
  },
}))
