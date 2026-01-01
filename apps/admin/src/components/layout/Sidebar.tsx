import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  CreditCard, 
  BarChart3,
  LogOut 
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Organizaciones', href: '/organizations', icon: Building2 },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Suscripciones', href: '/subscriptions', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-neutral-200 px-6">
        <Logo variant="line" height={32} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

