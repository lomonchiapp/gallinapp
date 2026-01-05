import { create } from 'zustand'
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

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

interface AuthState {
  admin: SaaSAdmin | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  
  // Acciones
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  initialize: () => () => void
  
  // Helpers
  isSuperAdmin: () => boolean
}

// Roles que tienen acceso al admin dashboard
const ADMIN_ROLES: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'ANALYST']

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Buscar la cuenta del usuario
      const accountDoc = await getDoc(doc(db, 'users', result.user.uid))
      
      if (!accountDoc.exists()) {
        await firebaseSignOut(auth)
        throw new Error('Cuenta no encontrada')
      }

      const accountData = accountDoc.data()
      const globalRole = accountData.globalRole as GlobalRole | undefined
      
      // Verificar si tiene un rol de admin
      if (!globalRole || !ADMIN_ROLES.includes(globalRole)) {
        await firebaseSignOut(auth)
        throw new Error('No tienes permisos de administrador. Solo personal autorizado de Gallinapp puede acceder.')
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
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      set({ error: message, isLoading: false })
      throw error
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
}))
