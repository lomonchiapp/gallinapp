import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Search, UserPlus, Building2, CreditCard, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores"
import { 
  subscribeToNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  type AdminNotification 
} from "@/services/admin.service"

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Administrador',
  SUPPORT: 'Soporte',
  ANALYST: 'Analista',
}

const notificationIcons: Record<string, typeof UserPlus> = {
  user_created: UserPlus,
  farm_created: Building2,
  subscription_changed: CreditCard,
  user_deleted: UserPlus,
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays === 1) return "Ayer"
  return `${diffDays}d`
}

export function Header() {
  const { admin } = useAuthStore()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(setNotifications)
    return () => unsubscribe()
  }, [])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar granjas, usuarios..."
          className="pl-9"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Notificaciones</DropdownMenuLabel>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto py-1 px-2 text-xs"
                  onClick={handleMarkAllAsRead}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Marcar todas
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No hay notificaciones
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => {
                  const Icon = notificationIcons[notification.type] || Bell
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        notification.type === 'user_created' ? 'bg-blue-100' :
                        notification.type === 'farm_created' ? 'bg-green-100' :
                        notification.type === 'subscription_changed' ? 'bg-purple-100' :
                        'bg-slate-100'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          notification.type === 'user_created' ? 'text-blue-600' :
                          notification.type === 'farm_created' ? 'text-green-600' :
                          notification.type === 'subscription_changed' ? 'text-purple-600' :
                          'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                      )}
                    </DropdownMenuItem>
                  )
                })}
              </div>
            )}
            
            <DropdownMenuSeparator />
            <Link to="/notifications" onClick={() => setIsOpen(false)}>
              <DropdownMenuItem className="justify-center text-primary-600 cursor-pointer">
                Ver todas las notificaciones
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={admin?.photoURL || undefined} />
            <AvatarFallback>{admin?.displayName?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{admin?.displayName || "Admin"}</p>
            <p className="text-xs text-slate-500">
              {roleLabels[admin?.globalRole || 'ADMIN']}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
