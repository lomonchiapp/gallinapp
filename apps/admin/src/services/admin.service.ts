import { 
  collection, 
  getDocs, 
  getDoc,
  doc,
  query, 
  orderBy, 
  limit,
  where,
  getCountFromServer,
  Timestamp,
  collectionGroup,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

// ============================================================================
// TIPOS LOCALES PARA EL ADMIN
// ============================================================================

export interface UserSubscription {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  startDate?: Date
  endDate?: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string | null
  globalRole?: string
  createdAt: Date
  lastLogin?: Date
  farms: Record<string, { role: string; isActive: boolean }>
  subscription?: UserSubscription
}

export interface AdminFarm {
  id: string
  name: string
  displayName?: string
  farmCode?: string
  ownerId: string
  ownerEmail?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  subscription?: {
    plan: string
    status: string
  }
  memberCount?: number
}

export interface DashboardStats {
  totalUsers: number
  totalFarms: number
  activeSubscriptions: number
  newUsersThisMonth: number
  newFarmsThisMonth: number
}

export interface RecentActivity {
  id: string
  type: 'user_created' | 'farm_created' | 'subscription_changed'
  description: string
  timestamp: Date
  userId?: string
  farmId?: string
}

// ============================================================================
// USUARIOS
// ============================================================================

export async function getUsers(limitCount = 50): Promise<AdminUser[]> {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, orderBy('createdAt', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      uid: docSnap.id,
      email: data.email || '',
      displayName: data.displayName || '',
      photoURL: data.photoURL,
      globalRole: data.globalRole,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate(),
      farms: data.farms || data.organizations || {},
      subscription: data.subscription ? {
        plan: data.subscription.plan || 'FREE',
        status: data.subscription.status || 'active',
        startDate: data.subscription.startDate?.toDate(),
        endDate: data.subscription.endDate?.toDate(),
        stripeCustomerId: data.subscription.stripeCustomerId,
        stripeSubscriptionId: data.subscription.stripeSubscriptionId,
      } : undefined,
    }
  })
}

export async function getUsersCount(): Promise<number> {
  const usersRef = collection(db, 'users')
  const snapshot = await getCountFromServer(usersRef)
  return snapshot.data().count
}

export async function getNewUsersThisMonth(): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('createdAt', '>=', Timestamp.fromDate(startOfMonth)))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

// ============================================================================
// GRANJAS (FARMS)
// ============================================================================

export async function getFarms(limitCount = 50): Promise<AdminFarm[]> {
  const farmsRef = collection(db, 'farms')
  const q = query(farmsRef, orderBy('createdAt', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: data.name || '',
      displayName: data.displayName,
      farmCode: data.farmCode,
      ownerId: data.createdBy || data.ownerId || '',
      ownerEmail: data.ownerEmail,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      isActive: data.isActive ?? true,
      subscription: data.subscription ? {
        plan: data.subscription.plan || 'FREE',
        status: data.subscription.status || 'active',
      } : undefined,
    }
  })
}

export async function getFarmsCount(): Promise<number> {
  const farmsRef = collection(db, 'farms')
  const snapshot = await getCountFromServer(farmsRef)
  return snapshot.data().count
}

export async function getNewFarmsThisMonth(): Promise<number> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const farmsRef = collection(db, 'farms')
  const q = query(farmsRef, where('createdAt', '>=', Timestamp.fromDate(startOfMonth)))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

// ============================================================================
// ESTADÍSTICAS DEL DASHBOARD
// ============================================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    totalFarms,
    newUsersThisMonth,
    newFarmsThisMonth,
  ] = await Promise.all([
    getUsersCount(),
    getFarmsCount(),
    getNewUsersThisMonth(),
    getNewFarmsThisMonth(),
  ])

  return {
    totalUsers,
    totalFarms,
    activeSubscriptions: totalFarms,
    newUsersThisMonth,
    newFarmsThisMonth,
  }
}

// ============================================================================
// ACTIVIDAD RECIENTE
// ============================================================================

export async function getRecentActivity(): Promise<RecentActivity[]> {
  const [recentUsers, recentFarms] = await Promise.all([
    getUsers(5),
    getFarms(5),
  ])

  const activities: RecentActivity[] = []

  recentUsers.forEach(user => {
    activities.push({
      id: `user-${user.uid}`,
      type: 'user_created',
      description: `Nuevo usuario: ${user.displayName || user.email}`,
      timestamp: user.createdAt,
      userId: user.uid,
    })
  })

  recentFarms.forEach(farm => {
    activities.push({
      id: `farm-${farm.id}`,
      type: 'farm_created',
      description: `Nueva granja: ${farm.displayName || farm.name}`,
      timestamp: farm.createdAt,
      farmId: farm.id,
    })
  })

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
}

// ============================================================================
// SUSCRIPCIONES (basadas en usuarios)
// ============================================================================

export interface SubscriptionStats {
  free: number
  pro: number
  enterprise: number
  total: number
}

export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const users = await getUsers(1000)
  
  const stats: SubscriptionStats = {
    free: 0,
    pro: 0,
    enterprise: 0,
    total: users.length,
  }

  users.forEach(user => {
    const plan = user.subscription?.plan?.toUpperCase() || 'FREE'
    if (plan === 'PRO') stats.pro++
    else if (plan === 'ENTERPRISE') stats.enterprise++
    else stats.free++
  })

  return stats
}

export interface UserWithSubscription extends AdminUser {
  farmCount: number
}

export async function getUsersWithSubscriptions(): Promise<UserWithSubscription[]> {
  const users = await getUsers(1000)
  
  return users.map(user => ({
    ...user,
    farmCount: Object.keys(user.farms || {}).length,
  }))
}

// ============================================================================
// LOTES
// ============================================================================

export type TipoLote = 'ponedoras' | 'engorde' | 'levantes'

export interface AdminLote {
  id: string
  nombre: string
  tipo: TipoLote
  tipoAve: string
  farmId: string
  farmName?: string
  galponId: string
  cantidadInicial: number
  cantidadActual: number
  raza: string
  estado: string
  fechaInicio: Date
  fechaNacimiento: Date
  createdAt: Date
  updatedAt: Date
  costo?: number
  costoUnitario?: number
  observaciones?: string
}

export async function getAllLotes(): Promise<AdminLote[]> {
  const lotes: AdminLote[] = []
  
  // Obtener todas las granjas primero para mapear nombres
  const farms = await getFarms(1000)
  const farmMap = new Map(farms.map(f => [f.id, f.displayName || f.name]))
  
  // Cargar lotes de cada tipo usando collectionGroup
  const tiposLote: { collection: string; tipo: TipoLote }[] = [
    { collection: 'ponedoras', tipo: 'ponedoras' },
    { collection: 'engorde', tipo: 'engorde' },
    { collection: 'levantes', tipo: 'levantes' },
  ]
  
  for (const { collection: colName, tipo } of tiposLote) {
    try {
      const lotesRef = collectionGroup(db, colName)
      const snapshot = await getDocs(lotesRef)
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data()
        // El path es farms/{farmId}/ponedoras/{loteId}
        const pathParts = docSnap.ref.path.split('/')
        const farmId = pathParts[1] || ''
        
        lotes.push({
          id: docSnap.id,
          nombre: data.nombre || 'Sin nombre',
          tipo,
          tipoAve: data.tipo || tipo,
          farmId,
          farmName: farmMap.get(farmId),
          galponId: data.galponId || '',
          cantidadInicial: data.cantidadInicial || 0,
          cantidadActual: data.cantidadActual || 0,
          raza: data.raza || '',
          estado: data.estado || 'ACTIVO',
          fechaInicio: data.fechaInicio?.toDate() || new Date(),
          fechaNacimiento: data.fechaNacimiento?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          costo: data.costo,
          costoUnitario: data.costoUnitario,
          observaciones: data.observaciones,
        })
      })
    } catch (error) {
      console.error(`Error loading ${colName} lotes:`, error)
    }
  }
  
  return lotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getLotesCount(): Promise<{ ponedoras: number; engorde: number; levantes: number; total: number }> {
  let ponedoras = 0, engorde = 0, levantes = 0
  
  try {
    const ponedorasSnap = await getDocs(collectionGroup(db, 'ponedoras'))
    ponedoras = ponedorasSnap.size
  } catch { /* ignore */ }
  
  try {
    const engordeSnap = await getDocs(collectionGroup(db, 'engorde'))
    engorde = engordeSnap.size
  } catch { /* ignore */ }
  
  try {
    const levantesSnap = await getDocs(collectionGroup(db, 'levantes'))
    levantes = levantesSnap.size
  } catch { /* ignore */ }
  
  return { ponedoras, engorde, levantes, total: ponedoras + engorde + levantes }
}

// ============================================================================
// DETALLE DE GRANJA
// ============================================================================

export interface FarmDetail extends AdminFarm {
  settings?: {
    defaultEggPrice?: number
    defaultChickenPricePerPound?: number
    defaultLevantePricePerUnit?: number
    eggsPerBox?: number
    timezone?: string
    language?: string
  }
  farmInfo?: {
    location?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    logo?: string
  }
}

export interface FarmMember {
  uid: string
  email: string
  displayName: string
  photoURL?: string | null
  role: string
  isActive: boolean
  joinedAt?: Date
}

export async function getFarmById(farmId: string): Promise<FarmDetail | null> {
  const farmDoc = await getDoc(doc(db, 'farms', farmId))
  
  if (!farmDoc.exists()) return null
  
  const data = farmDoc.data()
  return {
    id: farmDoc.id,
    name: data.name || '',
    displayName: data.displayName,
    farmCode: data.farmCode,
    ownerId: data.createdBy || data.ownerId || '',
    ownerEmail: data.ownerEmail,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    isActive: data.isActive ?? true,
    subscription: data.subscription ? {
      plan: data.subscription.plan || 'FREE',
      status: data.subscription.status || 'active',
    } : undefined,
    settings: data.settings,
    farmInfo: data.farmInfo,
  }
}

export async function getFarmMembers(farmId: string): Promise<FarmMember[]> {
  // Los miembros están en el campo farms de cada usuario
  const users = await getUsers(1000)
  
  return users
    .filter(user => user.farms && user.farms[farmId])
    .map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.farms[farmId]?.role || 'member',
      isActive: user.farms[farmId]?.isActive ?? true,
      joinedAt: undefined,
    }))
}

export async function getFarmLotes(farmId: string): Promise<AdminLote[]> {
  const lotes: AdminLote[] = []
  
  const tiposLote: { collection: string; tipo: TipoLote }[] = [
    { collection: 'ponedoras', tipo: 'ponedoras' },
    { collection: 'engorde', tipo: 'engorde' },
    { collection: 'levantes', tipo: 'levantes' },
  ]
  
  for (const { collection: colName, tipo } of tiposLote) {
    try {
      const lotesRef = collection(db, 'farms', farmId, colName)
      const snapshot = await getDocs(lotesRef)
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data()
        lotes.push({
          id: docSnap.id,
          nombre: data.nombre || 'Sin nombre',
          tipo,
          tipoAve: data.tipo || tipo,
          farmId,
          galponId: data.galponId || '',
          cantidadInicial: data.cantidadInicial || 0,
          cantidadActual: data.cantidadActual || 0,
          raza: data.raza || '',
          estado: data.estado || 'ACTIVO',
          fechaInicio: data.fechaInicio?.toDate() || new Date(),
          fechaNacimiento: data.fechaNacimiento?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          costo: data.costo,
          costoUnitario: data.costoUnitario,
          observaciones: data.observaciones,
        })
      })
    } catch (error) {
      console.error(`Error loading ${colName} for farm ${farmId}:`, error)
    }
  }
  
  return lotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

// ============================================================================
// NOTIFICACIONES ADMIN
// ============================================================================

export type NotificationType = 'user_created' | 'subscription_changed' | 'farm_created' | 'user_deleted'

export interface AdminNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, string>
  read: boolean
  createdAt: Date
}

export async function getAdminNotifications(limitCount = 20): Promise<AdminNotification[]> {
  const notifsRef = collection(db, 'admin_notifications')
  const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(limitCount))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      type: data.type || 'user_created',
      title: data.title || '',
      message: data.message || '',
      data: data.data,
      read: data.read ?? false,
      createdAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

export async function getUnreadNotificationsCount(): Promise<number> {
  const notifsRef = collection(db, 'admin_notifications')
  const q = query(notifsRef, where('read', '==', false))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notifRef = doc(db, 'admin_notifications', notificationId)
  await updateDoc(notifRef, { read: true })
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const notifsRef = collection(db, 'admin_notifications')
  const q = query(notifsRef, where('read', '==', false))
  const snapshot = await getDocs(q)
  
  const updates = snapshot.docs.map(docSnap => 
    updateDoc(doc(db, 'admin_notifications', docSnap.id), { read: true })
  )
  
  await Promise.all(updates)
}

export function subscribeToNotifications(
  callback: (notifications: AdminNotification[]) => void
): () => void {
  const notifsRef = collection(db, 'admin_notifications')
  const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(20))
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        type: data.type || 'user_created',
        title: data.title || '',
        message: data.message || '',
        data: data.data,
        read: data.read ?? false,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
    callback(notifications)
  })
}
