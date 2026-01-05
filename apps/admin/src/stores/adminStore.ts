import { create } from 'zustand'
import {
  getUsers,
  getFarms,
  getDashboardStats,
  getRecentActivity,
  getSubscriptionStats,
  type AdminUser,
  type AdminFarm,
  type DashboardStats,
  type RecentActivity,
  type SubscriptionStats,
} from '@/services/admin.service'

interface AdminState {
  // Data
  users: AdminUser[]
  farms: AdminFarm[]
  dashboardStats: DashboardStats | null
  recentActivity: RecentActivity[]
  subscriptionStats: SubscriptionStats | null
  
  // Loading states
  isLoadingUsers: boolean
  isLoadingFarms: boolean
  isLoadingStats: boolean
  
  // Error
  error: string | null
  
  // Actions
  loadUsers: () => Promise<void>
  loadFarms: () => Promise<void>
  loadDashboardStats: () => Promise<void>
  loadRecentActivity: () => Promise<void>
  loadSubscriptionStats: () => Promise<void>
  loadAllDashboardData: () => Promise<void>
  clearError: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  users: [],
  farms: [],
  dashboardStats: null,
  recentActivity: [],
  subscriptionStats: null,
  isLoadingUsers: false,
  isLoadingFarms: false,
  isLoadingStats: false,
  error: null,

  loadUsers: async () => {
    set({ isLoadingUsers: true, error: null })
    try {
      const users = await getUsers(100)
      set({ users, isLoadingUsers: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar usuarios'
      set({ error: message, isLoadingUsers: false })
    }
  },

  loadFarms: async () => {
    set({ isLoadingFarms: true, error: null })
    try {
      const farms = await getFarms(100)
      set({ farms, isLoadingFarms: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar granjas'
      set({ error: message, isLoadingFarms: false })
    }
  },

  loadDashboardStats: async () => {
    set({ isLoadingStats: true, error: null })
    try {
      const dashboardStats = await getDashboardStats()
      set({ dashboardStats, isLoadingStats: false })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar estadísticas'
      set({ error: message, isLoadingStats: false })
    }
  },

  loadRecentActivity: async () => {
    try {
      const recentActivity = await getRecentActivity()
      set({ recentActivity })
    } catch (error) {
      console.error('Error loading recent activity:', error)
    }
  },

  loadSubscriptionStats: async () => {
    try {
      const subscriptionStats = await getSubscriptionStats()
      set({ subscriptionStats })
    } catch (error) {
      console.error('Error loading subscription stats:', error)
    }
  },

  loadAllDashboardData: async () => {
    set({ isLoadingStats: true, error: null })
    try {
      const [dashboardStats, recentActivity, subscriptionStats] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getSubscriptionStats(),
      ])
      set({ 
        dashboardStats, 
        recentActivity, 
        subscriptionStats,
        isLoadingStats: false 
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al cargar datos'
      set({ error: message, isLoadingStats: false })
    }
  },

  clearError: () => set({ error: null }),
}))
