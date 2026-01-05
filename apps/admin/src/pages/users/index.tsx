import { useEffect, useState } from "react"
import { Loader2, Search, Shield, User, MoreHorizontal, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminStore } from "@/stores"
import { CreateUserModal } from "@/components/users/CreateUserModal"

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  SUPPORT: 'bg-blue-100 text-blue-700',
  ANALYST: 'bg-green-100 text-green-700',
}

export function UsersPage() {
  const { users, isLoadingUsers, loadUsers } = useAdminStore()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const farmCount = (farms: Record<string, unknown>) => Object.keys(farms || {}).length

  const filteredUsers = users.filter(user => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.displayName.toLowerCase().includes(searchLower)
    )
  })

  const handleUserCreated = () => {
    loadUsers() // Reload users after creation
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500">Administra los usuarios de la plataforma</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Buscar usuario..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Crear Usuario
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuarios registrados en Gallinapp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-slate-500">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Usuario
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Rol Global
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Granjas
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Registrado
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                      Último acceso
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900">
                            {user.displayName || 'Sin nombre'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="py-4 px-4">
                        {user.globalRole ? (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${roleColors[user.globalRole] || 'bg-slate-100 text-slate-700'}`}>
                            <Shield className="h-3 w-3" />
                            {user.globalRole}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {farmCount(user.farms)}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {user.lastLogin ? formatDate(user.lastLogin) : '—'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateUserModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleUserCreated}
      />
    </div>
  )
}
