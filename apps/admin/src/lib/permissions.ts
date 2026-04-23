import type { GlobalRole } from '@/stores/authStore'

/**
 * Matriz de permisos por rol global.
 *
 * Convención:
 *  - SUPER_ADMIN: acceso total. Único que puede borrar usuarios y modificar
 *    configuración crítica.
 *  - ADMIN: gestión operativa día a día (granjas, suscripciones, soporte).
 *  - SUPPORT: lectura de granjas/usuarios + tickets de soporte. No toca facturación.
 *  - ANALYST: solo lectura de analytics y datos de negocio.
 *
 * Las rutas no listadas explícitamente usan `ALL_ADMINS` (todos los roles).
 */

export const ALL_ADMINS: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT', 'ANALYST']
export const SUPER_ADMIN_ONLY: GlobalRole[] = ['SUPER_ADMIN']
export const ADMINS_ONLY: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN']
export const ADMINS_AND_SUPPORT: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN', 'SUPPORT']
export const ADMINS_AND_ANALYSTS: GlobalRole[] = ['ADMIN', 'SUPER_ADMIN', 'ANALYST']

/**
 * Permisos por ruta. Usado tanto por el RoleGuard como por el Sidebar
 * para ocultar items que el rol no puede ver.
 */
export const ROUTE_PERMISSIONS: Record<string, GlobalRole[]> = {
  '/dashboard': ALL_ADMINS,
  '/business': ADMINS_AND_ANALYSTS, // Métricas financieras: admins + analyst (lectura)
  '/users': ADMINS_AND_SUPPORT,     // Soporte ve usuarios para ayudarlos
  '/farms': ALL_ADMINS,
  '/farms/blocked': ADMINS_ONLY,
  '/lotes': ALL_ADMINS,
  '/subscriptions': ADMINS_ONLY,    // Cambiar planes solo admins
  '/analytics': ADMINS_AND_ANALYSTS,
  '/notifications': ADMINS_AND_SUPPORT,
  '/notifications/push': ADMINS_ONLY, // Mandar push masivo es delicado
  '/support': ADMINS_AND_SUPPORT,
  '/audit': SUPER_ADMIN_ONLY,        // Audit log: solo super admin
}

/**
 * Permisos por acción. Útil para hooks/UI que muestran u ocultan botones
 * (ej: "Eliminar usuario" solo para SUPER_ADMIN).
 */
export type ActionPermission =
  | 'user:create'
  | 'user:delete'
  | 'user:update_role'
  | 'subscription:update'
  | 'farm:delete'
  | 'farm:transfer_owner'
  | 'audit:read'
  | 'push:send'
  | 'admin:create'
  | 'settings:update'

export const ACTION_PERMISSIONS: Record<ActionPermission, GlobalRole[]> = {
  'user:create': ADMINS_ONLY,
  'user:delete': SUPER_ADMIN_ONLY,
  'user:update_role': SUPER_ADMIN_ONLY,
  'subscription:update': ADMINS_ONLY,
  'farm:delete': SUPER_ADMIN_ONLY,
  'farm:transfer_owner': SUPER_ADMIN_ONLY,
  'audit:read': SUPER_ADMIN_ONLY,
  'push:send': ADMINS_ONLY,
  'admin:create': SUPER_ADMIN_ONLY,
  'settings:update': SUPER_ADMIN_ONLY,
}

export function canAccessRoute(role: GlobalRole | undefined, path: string): boolean {
  if (!role) return false
  const allowed = ROUTE_PERMISSIONS[path] ?? ALL_ADMINS
  return allowed.includes(role)
}

export function canPerformAction(
  role: GlobalRole | undefined,
  action: ActionPermission
): boolean {
  if (!role) return false
  return ACTION_PERMISSIONS[action].includes(role)
}
