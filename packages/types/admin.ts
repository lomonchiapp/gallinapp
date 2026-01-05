/**
 * Tipos para Roles Globales de Administración del SaaS
 * 
 * El campo `globalRole` en la colección `accounts` determina si un usuario
 * puede acceder al dashboard de administración (apps/admin/).
 * 
 * IMPORTANTE: Esto es DIFERENTE a los FarmRole (OWNER, ADMIN, MANAGER, VIEWER)
 * que son roles DENTRO de una granja específica.
 * 
 * globalRole:
 * - Define acceso a nivel de PLATAFORMA (SaaS)
 * - Solo usuarios con globalRole pueden acceder a apps/admin/
 * - La mayoría de usuarios NO tienen globalRole (son clientes normales)
 * 
 * FarmRole (en account.ts):
 * - Define acceso a nivel de GRANJA
 * - Todos los usuarios tienen FarmRole en cada granja a la que pertenecen
 * - Se usa en apps/mobile/ y apps/web/
 */

/**
 * Rol global del usuario en la plataforma
 * Este campo es OPCIONAL en el documento de cuenta.
 * Si no existe, el usuario es un cliente normal sin acceso al admin.
 */
export type GlobalRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT' | 'ANALYST'

/**
 * Descripción de cada rol global
 */
export const GLOBAL_ROLE_DESCRIPTIONS: Record<GlobalRole, string> = {
  /**
   * Super Admin - Control total de la plataforma Gallinapp
   * - Puede crear/eliminar otros admins
   * - Acceso a todas las configuraciones críticas
   * - Puede modificar suscripciones manualmente
   * - Puede ver y gestionar TODAS las granjas
   */
  SUPER_ADMIN: 'Control total de la plataforma',
  
  /**
   * Admin - Gestión operativa del SaaS
   * - Ver y gestionar granjas
   * - Ver y gestionar usuarios
   * - Ver métricas y analytics
   * - NO puede crear otros admins
   */
  ADMIN: 'Gestión operativa del SaaS',
  
  /**
   * Support - Soporte técnico
   * - Ver granjas y usuarios (solo lectura)
   * - Responder tickets de soporte
   * - NO puede modificar suscripciones
   */
  SUPPORT: 'Soporte técnico a usuarios',
  
  /**
   * Analyst - Analista de datos
   * - Ver métricas y analytics
   * - Generar reportes
   * - Solo lectura en todo lo demás
   */
  ANALYST: 'Análisis de datos y reportes',
}

/**
 * Recursos que puede gestionar un admin del SaaS
 */
export type SaaSResource = 
  | 'admins'         // Gestión de otros administradores
  | 'users'          // Cuentas de clientes
  | 'farms'          // Granjas
  | 'subscriptions'  // Suscripciones
  | 'analytics'      // Métricas y reportes
  | 'support'        // Tickets de soporte
  | 'settings'       // Configuración global
  | 'billing'        // Facturación

/**
 * Acciones sobre recursos
 */
export type SaaSAction = 'create' | 'read' | 'update' | 'delete' | 'manage'

/**
 * Permisos por defecto para cada rol global
 */
export const DEFAULT_GLOBAL_ROLE_PERMISSIONS: Record<GlobalRole, Array<{ resource: SaaSResource; actions: SaaSAction[] }>> = {
  SUPER_ADMIN: [
    { resource: 'admins', actions: ['manage'] },
    { resource: 'users', actions: ['manage'] },
    { resource: 'farms', actions: ['manage'] },
    { resource: 'subscriptions', actions: ['manage'] },
    { resource: 'analytics', actions: ['manage'] },
    { resource: 'support', actions: ['manage'] },
    { resource: 'settings', actions: ['manage'] },
    { resource: 'billing', actions: ['manage'] },
  ],
  
  ADMIN: [
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'farms', actions: ['read', 'update'] },
    { resource: 'subscriptions', actions: ['read', 'update'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'support', actions: ['read', 'update'] },
  ],
  
  SUPPORT: [
    { resource: 'users', actions: ['read'] },
    { resource: 'farms', actions: ['read'] },
    { resource: 'subscriptions', actions: ['read'] },
    { resource: 'support', actions: ['read', 'update', 'create'] },
  ],
  
  ANALYST: [
    { resource: 'users', actions: ['read'] },
    { resource: 'farms', actions: ['read'] },
    { resource: 'subscriptions', actions: ['read'] },
    { resource: 'analytics', actions: ['read', 'create'] },
  ],
}

/**
 * Verifica si un globalRole tiene permiso para una acción específica
 */
export function hasGlobalPermission(
  globalRole: GlobalRole,
  resource: SaaSResource,
  action: SaaSAction
): boolean {
  if (globalRole === 'SUPER_ADMIN') return true
  
  const permissions = DEFAULT_GLOBAL_ROLE_PERMISSIONS[globalRole]
  const permission = permissions.find(p => p.resource === resource)
  
  if (!permission) return false
  return permission.actions.includes(action) || permission.actions.includes('manage')
}
