# Admin Auth & Acceso — Guía operativa

Documento de referencia para el equipo Gallinapp sobre cómo funciona la autenticación,
los roles y el bootstrap del primer admin del SaaS.

---

## 1. Bootstrap del primer admin

Cuando el sistema **no tiene ningún usuario con `globalRole` admin**, el admin app
detecta esa condición al cargar y redirige automáticamente a `/setup` en lugar
de mostrar el login.

**Flujo:**

1. El admin app llama a la Cloud Function `hasAnyAdmin` (callable, sin auth).
2. Si responde `{ hasAdmin: false }`, se muestra `/setup` (`apps/admin/src/pages/auth/Setup.tsx`).
3. El operador llena nombre, email y contraseña (mínimo 8 caracteres).
4. Se llama a `bootstrapFirstAdmin`, que:
   - Vuelve a verificar (con transacción) que no exista ningún admin.
   - Crea el usuario en Firebase Auth (o reutiliza si el email ya existe).
   - Crea el documento `users/{uid}` con `globalRole: 'SUPER_ADMIN'` y flag `bootstrappedAdmin: true`.
   - Setea custom claims (`super_admin`, `admin`, `role: 'SUPER_ADMIN'`) inmediatamente.
   - Registra entrada en `admin_audit_log` con `action: 'bootstrap_first_admin'`.
5. El admin app inicia sesión automáticamente con esas credenciales y navega a `/dashboard`.

**A partir de ahí**, `bootstrapFirstAdmin` rechaza cualquier llamada nueva con
`failed-precondition`. La pantalla `/setup` queda inaccesible y `hasAnyAdmin`
devuelve `true`.

> Si necesitas resetear (por ejemplo en staging), basta con borrar todos los
> documentos `users` con `globalRole` admin y borrar (o no) el usuario en Firebase Auth.

---

## 2. Roles globales y matriz de permisos

Los roles globales viven en `users/{uid}.globalRole`:

| Rol | Para qué |
|---|---|
| `SUPER_ADMIN` | Acceso total. Único que puede crear admins, ver auditoría, borrar usuarios o transferir granjas. |
| `ADMIN` | Gestión operativa: granjas, suscripciones, soporte, push. |
| `SUPPORT` | Lectura + tickets. Ve usuarios, granjas, notificaciones. No toca facturación. |
| `ANALYST` | Solo lectura de Business y Analytics. |

La matriz se define en `apps/admin/src/lib/permissions.ts`:

- `ROUTE_PERMISSIONS` — qué roles pueden acceder a cada ruta.
- `ACTION_PERMISSIONS` — qué roles pueden ejecutar cada acción (`user:delete`,
  `subscription:update`, etc).
- Helpers: `canAccessRoute(role, path)`, `canPerformAction(role, action)`.

**Enforcement:**

- **Rutas:** envueltas en `<RoleGuard allowed={...}>` en `App.tsx`.
- **Sidebar:** filtra items con `canAccessRoute` (un SUPPORT no ve Audit ni Push).
- **Acciones (botones, modals):** usar `canPerformAction(role, 'user:delete')` antes de mostrar el botón.

---

## 3. Sincronización `globalRole` ↔ Custom Claims

Las Firestore rules dependen de `request.auth.token.super_admin == true`. Para
mantener consistencia con el campo `globalRole` del documento, hay un trigger
en `functions/src/admin/claims-sync.ts`:

- Trigger: `onWrite` de `users/{uid}`.
- Detecta cambios en `globalRole` y llama `setCustomUserClaims`:
  - `SUPER_ADMIN` → `{ super_admin: true, admin: true, role: 'SUPER_ADMIN' }`
  - `ADMIN` → `{ admin: true, role: 'ADMIN' }`
  - `SUPPORT` / `ANALYST` → `{ role: '...' }`
  - Sin rol o rol no admin → claims vacíos.

**Importante:** después de un cambio de claims, el cliente debe llamar
`getIdToken(true)` para refrescar el JWT. El admin app lo hace automáticamente
en `signIn()`.

---

## 4. UX de errores en login

`apps/admin/src/stores/authStore.ts` mapea errores de Firebase Auth a códigos
tipados (`AuthErrorCode`). El `Login.tsx` los muestra con icono y tono adecuado:

| Código | Cuándo | Tono |
|---|---|---|
| `invalid-credentials` | Email o contraseña incorrectos | Rojo |
| `invalid-email` | Formato de email inválido | Ámbar |
| `user-disabled` | Cuenta bloqueada en Firebase Auth | Rojo |
| `too-many-requests` | Rate limit de Firebase | Ámbar |
| `network-error` | Sin conexión | Ámbar |
| `not-authorized` | Login OK pero sin `globalRole` admin | Rojo |
| `account-not-found` | No existe `users/{uid}` | Ámbar |

Cuando el código es `not-authorized`, también se muestra el contacto de soporte.

---

## 5. Crear admins después del bootstrap

Solo `SUPER_ADMIN` puede crear nuevos admins. Desde el admin app, `Usuarios →
Nuevo usuario` llama a `createUser` (callable). La función:

1. Verifica que el caller sea ADMIN/SUPER_ADMIN (server-side).
2. Crea Auth user + Firestore doc con el `globalRole` indicado.
3. Setea custom claims inmediatamente para no esperar al trigger.
4. Registra en `admin_audit_log`.

---

## 6. Audit log

Colección: `admin_audit_log`. Solo `SUPER_ADMIN` puede leer (regla en
`firestore.rules`). Las Cloud Functions escriben con server SDK (bypassan reglas).

Eventos actualmente loggeados:

- `bootstrap_first_admin` — primer setup
- `user_created` — admin crea un usuario

> **TODO** (siguientes iteraciones): loggear `user_deleted`,
> `subscription_changed`, `farm_blocked`, `push_sent`, `role_changed`. La
> página `/audit` actualmente muestra mock data — falta conectarla a esta
> colección real.

---

## 7. Despliegue

```bash
# Desde la raíz del repo
cd functions
npm run build
npm run deploy   # o firebase deploy --only functions
```

Y desplegar las reglas:

```bash
firebase deploy --only firestore:rules
```

---

## 8. Roadmap de mejoras pendientes

Detectadas en la auditoría pero no incluidas en este pase:

- **Audit log real** en `/audit` (reemplazar mock por query a `admin_audit_log`).
- **Tickets de soporte real** en `/support` (actualmente mock).
- **Impersonation** — login como un usuario para debug (Cloud Function que
  emite custom token).
- **2FA / MFA** para cuentas SUPER_ADMIN.
- **Session timeout** y revocation de sesiones.
- **Feature flags** por usuario/farm.
- **Email notifications** a admins (hoy solo se crean docs en `admin_notifications`).
- **Bulk actions** (CSV import/export de usuarios, suscripciones masivas).
- **Activity timeline por usuario** dentro de `/users/:id`.
