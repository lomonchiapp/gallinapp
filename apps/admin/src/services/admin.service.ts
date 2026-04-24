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

import type { 
  SubscriptionPlan, 
  SubscriptionStatus, 
  SubscriptionPeriod,
  SubscriptionStats 
} from '@/types/subscription'
import { PLAN_MRR } from '@/types/subscription'

// ============================================================================
// TIPOS LOCALES PARA EL ADMIN
// ============================================================================

export interface UserSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  period?: SubscriptionPeriod
  startDate?: Date
  endDate?: Date
  trialEndsAt?: Date
  cancelAtPeriodEnd?: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  revenueCatId?: string
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

export { type SubscriptionStats } from '@/types/subscription'

export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const users = await getUsers(1000)
  
  const stats: SubscriptionStats = {
    free: 0,
    basic: 0,
    pro: 0,
    hacienda: 0,
    total: users.length,
    active: 0,
    trialing: 0,
    cancelled: 0,
    pastDue: 0,
  }

  users.forEach(user => {
    const plan = user.subscription?.plan?.toUpperCase() || 'FREE'
    const status = user.subscription?.status || 'active'
    
    // Count by plan
    if (plan === 'BASIC') stats.basic++
    else if (plan === 'PRO') stats.pro++
    else if (plan === 'HACIENDA') stats.hacienda++
    else stats.free++
    
    // Count by status
    if (status === 'active') stats.active++
    else if (status === 'trialing') stats.trialing++
    else if (status === 'cancelled') stats.cancelled++
    else if (status === 'past_due') stats.pastDue++
  })

  return stats
}

// ============================================================================
// BUSINESS METRICS
// ============================================================================

export interface BusinessMetrics {
  mrr: number // Monthly Recurring Revenue
  arr: number // Annual Recurring Revenue
  churnRate: number // % of users who cancelled this month
  activeUsers: number
  trialingUsers: number
  conversionRate: number // Trial to paid conversion
  averageRevenuePerUser: number
  revenueByPlan: Record<SubscriptionPlan, number>
  growthRate: number // MRR growth % from last month
}

export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const users = await getUsers(1000)
  
  let mrr = 0
  let activeUsers = 0
  let trialingUsers = 0
  let convertedFromTrial = 0
  let totalTrials = 0
  const revenueByPlan: Record<SubscriptionPlan, number> = {
    FREE: 0,
    BASIC: 0,
    PRO: 0,
    HACIENDA: 0,
  }

  users.forEach(user => {
    const plan = (user.subscription?.plan?.toUpperCase() || 'FREE') as SubscriptionPlan
    const status = user.subscription?.status || 'inactive'
    
    if (status === 'active' && plan !== 'FREE') {
      const planMrr = PLAN_MRR[plan] || 0
      mrr += planMrr
      revenueByPlan[plan] += planMrr
      activeUsers++
    }
    
    if (status === 'trialing') {
      trialingUsers++
      totalTrials++
    }
    
    // Simple conversion tracking - users who were trialing and now active
    if (status === 'active' && user.subscription?.trialEndsAt) {
      convertedFromTrial++
      totalTrials++
    }
  })

  const arr = mrr * 12
  const churnRate = users.length > 0 
    ? (users.filter(u => u.subscription?.status === 'cancelled').length / users.length) * 100 
    : 0
  const conversionRate = totalTrials > 0 ? (convertedFromTrial / totalTrials) * 100 : 0
  const averageRevenuePerUser = activeUsers > 0 ? mrr / activeUsers : 0

  return {
    mrr,
    arr,
    churnRate,
    activeUsers,
    trialingUsers,
    conversionRate,
    averageRevenuePerUser,
    revenueByPlan,
    growthRate: 0, // Would need historical data to calculate
  }
}

// ============================================================================
// BLOCKED FARMS (Farms with expired subscriptions)
// ============================================================================

export interface BlockedFarm extends AdminFarm {
  ownerName?: string
  ownerEmail: string
  blockedSince?: Date
  lastPaymentDate?: Date
  outstandingAmount?: number
}

export async function getBlockedFarms(): Promise<BlockedFarm[]> {
  const farms = await getFarms(1000)
  const users = await getUsers(1000)
  
  // Create user map for quick lookup
  const userMap = new Map(users.map(u => [u.uid, u]))
  
  // Filter farms where owner has FREE plan or inactive subscription
  const blockedFarms: BlockedFarm[] = []
  
  for (const farm of farms) {
    const owner = userMap.get(farm.ownerId)
    if (!owner) continue
    
    const plan = owner.subscription?.plan?.toUpperCase() || 'FREE'
    const status = owner.subscription?.status || 'inactive'
    
    // Farm is blocked if owner has FREE plan OR subscription is not active
    if (plan === 'FREE' || (status !== 'active' && status !== 'trialing')) {
      blockedFarms.push({
        ...farm,
        ownerName: owner.displayName,
        ownerEmail: owner.email,
        blockedSince: status === 'cancelled' ? owner.subscription?.endDate : undefined,
        lastPaymentDate: owner.subscription?.startDate,
      })
    }
  }
  
  return blockedFarms.sort((a, b) => 
    (b.blockedSince?.getTime() || 0) - (a.blockedSince?.getTime() || 0)
  )
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
// Nombres de colección deben coincidir con FARM_COLLECTIONS en apps/mobile (firestore-paths.service.ts):
// lotesPonedoras, lotesEngorde, lotesLevantes (ruta: farms/{farmId}/{collection})
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
  
  // Cargar lotes de cada tipo usando collectionGroup (nombres alineados con mobile: lotesPonedoras, lotesEngorde, lotesLevantes)
  const tiposLote: { collection: string; tipo: TipoLote }[] = [
    { collection: 'lotesPonedoras', tipo: 'ponedoras' },
    { collection: 'lotesEngorde', tipo: 'engorde' },
    { collection: 'lotesLevantes', tipo: 'levantes' },
  ]
  
  for (const { collection: colName, tipo } of tiposLote) {
    try {
      const lotesRef = collectionGroup(db, colName)
      const snapshot = await getDocs(lotesRef)
      
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data()
        // El path es farms/{farmId}/lotesPonedoras|lotesEngorde|lotesLevantes/{loteId}
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
    const ponedorasSnap = await getDocs(collectionGroup(db, 'lotesPonedoras'))
    ponedoras = ponedorasSnap.size
  } catch { /* ignore */ }
  
  try {
    const engordeSnap = await getDocs(collectionGroup(db, 'lotesEngorde'))
    engorde = engordeSnap.size
  } catch { /* ignore */ }
  
  try {
    const levantesSnap = await getDocs(collectionGroup(db, 'lotesLevantes'))
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
    { collection: 'lotesPonedoras', tipo: 'ponedoras' },
    { collection: 'lotesEngorde', tipo: 'engorde' },
    { collection: 'lotesLevantes', tipo: 'levantes' },
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

// ============================================================================
// GALPONES
// ============================================================================

export interface AdminGalpon {
  id: string
  nombre: string
  tipo: string
  capacidad: number
  ocupacion?: number
  estado: 'activo' | 'inactivo' | 'mantenimiento'
  createdAt: Date
  updatedAt: Date
}

export async function getFarmGalpones(farmId: string): Promise<AdminGalpon[]> {
  try {
    const galponesRef = collection(db, 'farms', farmId, 'galpones')
    const snapshot = await getDocs(galponesRef)
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        nombre: data.nombre || 'Sin nombre',
        tipo: data.tipo || 'general',
        capacidad: data.capacidad || 0,
        ocupacion: data.ocupacion,
        estado: data.estado || 'activo',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error loading galpones:', error)
    return []
  }
}

// ============================================================================
// INVENTARIO / ARTÍCULOS
// ============================================================================

export interface AdminInventoryItem {
  id: string
  nombre: string
  categoria: string
  cantidad: number
  unidad: string
  precioUnitario?: number
  stockMinimo?: number
  ubicacion?: string
  fechaVencimiento?: Date
  createdAt: Date
  updatedAt: Date
}

export async function getFarmInventory(farmId: string): Promise<AdminInventoryItem[]> {
  try {
    const inventoryRef = collection(db, 'farms', farmId, 'inventario')
    const snapshot = await getDocs(inventoryRef)
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        nombre: data.nombre || 'Sin nombre',
        categoria: data.categoria || 'general',
        cantidad: data.cantidad || 0,
        unidad: data.unidad || 'unidad',
        precioUnitario: data.precioUnitario,
        stockMinimo: data.stockMinimo,
        ubicacion: data.ubicacion,
        fechaVencimiento: data.fechaVencimiento?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error loading inventory:', error)
    return []
  }
}

// ============================================================================
// GASTOS
// ============================================================================

export interface AdminGasto {
  id: string
  concepto: string
  categoria: string
  monto: number
  moneda: string
  fecha: Date
  proveedor?: string
  formaPago?: string
  estado: string
  notas?: string
  createdAt: Date
}

export async function getFarmGastos(farmId: string): Promise<AdminGasto[]> {
  try {
    const gastosRef = collection(db, 'farms', farmId, 'gastos')
    const q = query(gastosRef, orderBy('fecha', 'desc'), limit(100))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        concepto: data.concepto || data.descripcion || 'Sin concepto',
        categoria: data.categoria || 'general',
        monto: data.monto || data.amount || 0,
        moneda: data.moneda || data.currency || 'DOP',
        fecha: data.fecha?.toDate() || data.date?.toDate() || new Date(),
        proveedor: data.proveedor,
        formaPago: data.formaPago || data.metodoPago,
        estado: data.estado || 'pagado',
        notas: data.notas || data.notes,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error loading gastos:', error)
    return []
  }
}

// ============================================================================
// VENTAS
// ============================================================================

export interface AdminVenta {
  id: string
  numero?: string
  cliente?: {
    nombre: string
    identificacion?: string
    telefono?: string
  }
  items: {
    tipo: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]
  subtotal: number
  impuestos: number
  total: number
  moneda: string
  estado: 'pendiente' | 'pagada' | 'parcial' | 'anulada'
  fecha: Date
  createdAt: Date
}

export async function getFarmVentas(farmId: string): Promise<AdminVenta[]> {
  try {
    const ventasRef = collection(db, 'farms', farmId, 'ventas')
    const q = query(ventasRef, orderBy('fecha', 'desc'), limit(100))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        numero: data.numero || data.numeroVenta,
        cliente: data.cliente,
        items: data.items || data.productos || [],
        subtotal: data.subtotal || 0,
        impuestos: data.impuestos || data.itbis || 0,
        total: data.total || 0,
        moneda: data.moneda || 'DOP',
        estado: data.estado || 'pendiente',
        fecha: data.fecha?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error loading ventas:', error)
    return []
  }
}

// ============================================================================
// FACTURAS
// ============================================================================

export interface AdminFactura {
  id: string
  numero: string
  tipo: 'credito_fiscal' | 'consumidor_final' | 'nota_credito' | 'nota_debito' | 'proforma'
  cliente: {
    nombre: string
    rnc?: string
    direccion?: string
    telefono?: string
    email?: string
  }
  items: {
    descripcion: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }[]
  subtotal: number
  impuestos: number
  total: number
  moneda: string
  estado: 'emitida' | 'pagada' | 'anulada' | 'vencida'
  fechaEmision: Date
  fechaVencimiento?: Date
  ncf?: string
  secuencia?: string
  ventaId?: string
  createdAt: Date
}

export async function getFarmFacturas(farmId: string): Promise<AdminFactura[]> {
  try {
    const facturasRef = collection(db, 'farms', farmId, 'facturas')
    const q = query(facturasRef, orderBy('fechaEmision', 'desc'), limit(100))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        numero: data.numero || data.numeroFactura || '',
        tipo: data.tipo || data.tipoComprobante || 'consumidor_final',
        cliente: data.cliente || { nombre: 'N/A' },
        items: data.items || data.lineas || [],
        subtotal: data.subtotal || 0,
        impuestos: data.impuestos || data.itbis || 0,
        total: data.total || 0,
        moneda: data.moneda || 'DOP',
        estado: data.estado || 'emitida',
        fechaEmision: data.fechaEmision?.toDate() || data.fecha?.toDate() || new Date(),
        fechaVencimiento: data.fechaVencimiento?.toDate(),
        ncf: data.ncf,
        secuencia: data.secuencia,
        ventaId: data.ventaId,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error loading facturas:', error)
    return []
  }
}

// ============================================================================
// ESTADÍSTICAS DE GRANJA
// ============================================================================

export interface FarmStats {
  totalLotes: number
  lotesPonedoras: number
  lotesEngorde: number
  lotesLevantes: number
  totalGalpones: number
  totalGastos: number
  totalVentas: number
  totalFacturas: number
  inventarioItems: number
  avesActivas: number
}

export async function getFarmStats(farmId: string): Promise<FarmStats> {
  const [lotes, galpones, gastos, ventas, facturas, inventario] = await Promise.all([
    getFarmLotes(farmId),
    getFarmGalpones(farmId),
    getFarmGastos(farmId),
    getFarmVentas(farmId),
    getFarmFacturas(farmId),
    getFarmInventory(farmId),
  ])

  const avesActivas = lotes
    .filter(l => l.estado === 'ACTIVO')
    .reduce((sum, l) => sum + l.cantidadActual, 0)

  return {
    totalLotes: lotes.length,
    lotesPonedoras: lotes.filter(l => l.tipo === 'ponedoras').length,
    lotesEngorde: lotes.filter(l => l.tipo === 'engorde').length,
    lotesLevantes: lotes.filter(l => l.tipo === 'levantes').length,
    totalGalpones: galpones.length,
    totalGastos: gastos.reduce((sum, g) => sum + g.monto, 0),
    totalVentas: ventas.reduce((sum, v) => sum + v.total, 0),
    totalFacturas: facturas.length,
    inventarioItems: inventario.length,
    avesActivas,
  }
}

// ============================================================================
// GESTIÓN DE SUSCRIPCIONES (ADMIN)
// ============================================================================

export interface UpdateSubscriptionData {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  period?: SubscriptionPeriod
  startDate?: Date
  endDate?: Date
  trialEndsAt?: Date
  notes?: string // Nota interna del admin
}

export interface SubscriptionHistory {
  id: string
  userId: string
  previousPlan: SubscriptionPlan
  newPlan: SubscriptionPlan
  previousStatus: SubscriptionStatus
  newStatus: SubscriptionStatus
  changedBy: string // Admin UID
  changedByEmail: string
  reason?: string
  notes?: string
  createdAt: Date
}

/**
 * Actualiza la suscripción de un usuario desde el panel de admin
 * Permite cambiar plan, estado, fechas de inicio/fin
 */
export async function updateUserSubscription(
  userId: string,
  data: UpdateSubscriptionData,
  adminInfo: { uid: string; email: string },
  reason?: string
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  
  // Obtener datos actuales del usuario
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado')
  }
  
  const userData = userDoc.data()
  const previousSubscription = userData.subscription || { plan: 'FREE', status: 'inactive' }

  // Helper: calcular endDate automatico segun el periodo cuando el admin no lo provee.
  // Esto es CRITICO: el cliente mobile ignora suscripciones con endDate en el pasado y
  // cae a RevenueCat (que devuelve FREE), por lo que un plan promovido sin endDate
  // valido mantiene los modulos bloqueados.
  const computeAutoEndDate = (period: string | undefined, startFrom: Date): Date => {
    const base = new Date(startFrom)
    switch (period) {
      case 'monthly':
        base.setMonth(base.getMonth() + 1)
        break
      case 'quarterly':
        base.setMonth(base.getMonth() + 3)
        break
      case 'annual':
        base.setFullYear(base.getFullYear() + 1)
        break
      default:
        // Sin periodo especificado (ej. cortesia admin): vigencia larga por defecto (1 año)
        base.setFullYear(base.getFullYear() + 1)
    }
    return base
  }

  // Preparar datos de suscripción para Firestore
  // Tipado any: Firestore espera UpdateData<T>, pero usamos dot notation con
  // campos anidados dinamicos de subscription.*
  const subscriptionUpdate: Record<string, any> = {
    'subscription.plan': data.plan,
    'subscription.status': data.status,
    'subscription.updatedAt': Timestamp.now(),
    'subscription.updatedBy': adminInfo.uid,
  }

  if (data.period) {
    subscriptionUpdate['subscription.period'] = data.period
  }

  // startDate: si el admin no lo pasa y se promueve a un plan pagado, usar ahora
  const effectiveStartDate =
    data.startDate ?? (data.plan !== 'FREE' ? new Date() : undefined)
  if (effectiveStartDate) {
    subscriptionUpdate['subscription.startDate'] = Timestamp.fromDate(effectiveStartDate)
  }

  if (data.plan === 'FREE') {
    // Si se cambia a FREE, quitar fecha de vencimiento
    subscriptionUpdate['subscription.endDate'] = null
  } else if (data.endDate) {
    subscriptionUpdate['subscription.endDate'] = Timestamp.fromDate(data.endDate)
  } else {
    // Plan pagado sin endDate explicito: calcular uno automatico
    const startFrom = effectiveStartDate ?? new Date()
    const autoEnd = computeAutoEndDate(data.period, startFrom)
    subscriptionUpdate['subscription.endDate'] = Timestamp.fromDate(autoEnd)
  }
  
  if (data.trialEndsAt) {
    subscriptionUpdate['subscription.trialEndsAt'] = Timestamp.fromDate(data.trialEndsAt)
  }
  
  if (data.notes) {
    subscriptionUpdate['subscription.adminNotes'] = data.notes
  }
  
  // Actualizar documento del usuario
  await updateDoc(userRef, subscriptionUpdate)
  
  // Registrar en historial de cambios
  const historyRef = collection(db, 'subscription_history')
  const historyData = {
    userId,
    previousPlan: previousSubscription.plan || 'FREE',
    newPlan: data.plan,
    previousStatus: previousSubscription.status || 'inactive',
    newStatus: data.status,
    changedBy: adminInfo.uid,
    changedByEmail: adminInfo.email,
    reason: reason || 'Cambio manual desde Admin Panel',
    notes: data.notes,
    startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
    endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
    createdAt: Timestamp.now(),
  }
  
  const { addDoc } = await import('firebase/firestore')
  await addDoc(historyRef, historyData)
}

/**
 * Obtener historial de cambios de suscripción de un usuario
 */
export async function getUserSubscriptionHistory(userId: string): Promise<SubscriptionHistory[]> {
  const historyRef = collection(db, 'subscription_history')
  const q = query(
    historyRef, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      userId: data.userId,
      previousPlan: data.previousPlan,
      newPlan: data.newPlan,
      previousStatus: data.previousStatus,
      newStatus: data.newStatus,
      changedBy: data.changedBy,
      changedByEmail: data.changedByEmail,
      reason: data.reason,
      notes: data.notes,
      createdAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

/**
 * Calcular fecha de vencimiento basada en el periodo
 */
export function calculateEndDate(startDate: Date, period: SubscriptionPeriod): Date {
  const endDate = new Date(startDate)
  
  switch (period) {
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + 1)
      break
    case 'quarterly':
      endDate.setMonth(endDate.getMonth() + 3)
      break
    case 'annual':
      endDate.setFullYear(endDate.getFullYear() + 1)
      break
  }
  
  return endDate
}

/**
 * Extender suscripción por X días
 */
export async function extendSubscription(
  userId: string,
  days: number,
  adminInfo: { uid: string; email: string },
  reason?: string
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado')
  }
  
  const userData = userDoc.data()
  const currentEndDate = userData.subscription?.endDate?.toDate() || new Date()
  
  // Si la fecha actual ya pasó, extender desde hoy
  const baseDate = currentEndDate > new Date() ? currentEndDate : new Date()
  const newEndDate = new Date(baseDate)
  newEndDate.setDate(newEndDate.getDate() + days)
  
  await updateDoc(userRef, {
    'subscription.endDate': Timestamp.fromDate(newEndDate),
    'subscription.status': 'active',
    'subscription.updatedAt': Timestamp.now(),
    'subscription.updatedBy': adminInfo.uid,
  })
  
  // Registrar en historial
  const historyRef = collection(db, 'subscription_history')
  const { addDoc } = await import('firebase/firestore')
  await addDoc(historyRef, {
    userId,
    previousPlan: userData.subscription?.plan || 'FREE',
    newPlan: userData.subscription?.plan || 'FREE',
    previousStatus: userData.subscription?.status || 'inactive',
    newStatus: 'active',
    changedBy: adminInfo.uid,
    changedByEmail: adminInfo.email,
    reason: reason || `Extensión de ${days} días desde Admin Panel`,
    notes: `Fecha anterior: ${currentEndDate.toLocaleDateString()}, Nueva fecha: ${newEndDate.toLocaleDateString()}`,
    createdAt: Timestamp.now(),
  })
}

/**
 * Cancelar suscripción de un usuario
 */
export async function cancelUserSubscription(
  userId: string,
  adminInfo: { uid: string; email: string },
  reason?: string,
  immediate = false
): Promise<void> {
  const userRef = doc(db, 'users', userId)
  const userDoc = await getDoc(userRef)
  
  if (!userDoc.exists()) {
    throw new Error('Usuario no encontrado')
  }
  
  const userData = userDoc.data()
  
  const updateData: Record<string, any> = {
    'subscription.updatedAt': Timestamp.now(),
    'subscription.updatedBy': adminInfo.uid,
    'subscription.cancelReason': reason,
    'subscription.cancelledAt': Timestamp.now(),
  }
  
  if (immediate) {
    // Cancelación inmediata - cambiar a FREE
    updateData['subscription.plan'] = 'FREE'
    updateData['subscription.status'] = 'cancelled'
    updateData['subscription.endDate'] = Timestamp.now()
  } else {
    // Cancelar al final del periodo
    updateData['subscription.cancelAtPeriodEnd'] = true
    updateData['subscription.status'] = 'active' // Mantiene activo hasta que expire
  }
  
  await updateDoc(userRef, updateData)
  
  // Registrar en historial
  const historyRef = collection(db, 'subscription_history')
  const { addDoc } = await import('firebase/firestore')
  await addDoc(historyRef, {
    userId,
    previousPlan: userData.subscription?.plan || 'FREE',
    newPlan: immediate ? 'FREE' : userData.subscription?.plan,
    previousStatus: userData.subscription?.status || 'inactive',
    newStatus: immediate ? 'cancelled' : 'active',
    changedBy: adminInfo.uid,
    changedByEmail: adminInfo.email,
    reason: reason || (immediate ? 'Cancelación inmediata desde Admin' : 'Cancelación al final del periodo'),
    createdAt: Timestamp.now(),
  })
}
