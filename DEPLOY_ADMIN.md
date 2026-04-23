# Guía de Deploy — Admin SaaS

Esta guía cubre el despliegue completo del proyecto admin a producción:

1. Firebase Functions (bootstrap, claims-sync, etc.)
2. Firestore Rules (incluye `admin_audit_log`)
3. Vercel para `admin.gallinapp.com`

---

## Prerrequisitos

- Estar logueado en Firebase CLI: `firebase login` (interactivo, abre browser)
- Estar logueado en Vercel: `vercel login` (opcional, si usas la CLI; si no usas Vercel UI no hace falta)
- Estar parado en la raíz del repo: `cd /Users/user/Desktop/projects/gallinapp`

---

## Parte 1 — Firebase deploy

### 1.1 Verificar que las cosas compilan

```bash
cd functions
npm run build      # Compila TypeScript a lib/
cd ..
```

Salida esperada: sin errores.

### 1.2 Deploy de Firestore Rules (rápido, sin downtime)

```bash
firebase deploy --only firestore:rules --project gallinapp-ac9d8
```

Esto despliega `apps/mobile/firestore.rules` (path corregido en `firebase.json`).
Incluye la nueva regla para `admin_audit_log` (lectura solo SUPER_ADMIN).

### 1.3 Deploy de las Cloud Functions

```bash
firebase deploy --only functions --project gallinapp-ac9d8
```

Funciones nuevas que se van a desplegar:

- `hasAnyAdmin` (callable) — para que el admin app sepa si necesita mostrar setup.
- `bootstrapFirstAdmin` (callable) — crea el primer SUPER_ADMIN.
- `syncGlobalRoleToClaims` (Firestore trigger onWrite users/{uid}) — sync globalRole → custom claims.

Funciones existentes que también se redeployean (porque modifiqué `users.ts`):

- `createUser`, `updateUserSubscription`, `deleteUser`, `deleteMyAccount` — ahora también escriben al `admin_audit_log`.

> Si el deploy de functions tarda demasiado o falla por timeout, deploya solo
> las nuevas con: `firebase deploy --only functions:hasAnyAdmin,functions:bootstrapFirstAdmin,functions:syncGlobalRoleToClaims --project gallinapp-ac9d8`

### 1.4 Verificar el deploy

```bash
firebase functions:list --project gallinapp-ac9d8 | grep -E "hasAnyAdmin|bootstrapFirstAdmin|syncGlobalRoleToClaims"
```

Debería mostrar las 3 funciones listadas.

---

## Parte 2 — Crear el primer admin

Una vez desplegadas las functions, abre el admin app (en local o en producción
una vez configurado Vercel). Debería redirigir automáticamente a `/setup`.

Llena:
- Nombre completo
- Email (el que usarás como SUPER_ADMIN)
- Contraseña (mínimo 8 caracteres) + confirmación

Click en "Crear primer administrador". Te logueará automáticamente al dashboard.

A partir de ahí, `/setup` queda inaccesible (la function rechaza nuevos bootstraps).
Los siguientes admins se crean desde **Usuarios → Nuevo usuario** dentro del panel.

---

## Parte 3 — Vercel para `admin.gallinapp.com`

Como ya tienes `gallinapp.com` en Vercel para la web app, vamos a crear un
**proyecto separado** en Vercel para el admin. Esto es lo más limpio: build
independiente, env vars separadas, deploys independientes.

### 3.1 Importar el repo a Vercel como proyecto nuevo

1. Ve a https://vercel.com/new
2. Selecciona el mismo Git repo que ya tiene la web app (Gallinapp).
3. **Importante** — antes de hacer click en "Deploy", configura:

   - **Project Name**: `gallinapp-admin` (o lo que prefieras)
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/admin` ← click en "Edit" y selecciona esta carpeta
   - **Build Command**: déjalo en blanco (ya está en `apps/admin/vercel.json`)
   - **Output Directory**: déjalo en blanco (ya está en `vercel.json`)
   - **Install Command**: déjalo en blanco

### 3.2 Configurar Environment Variables

En la pantalla de "Configure Project" (antes del primer deploy), agrega estas
6 variables (exactamente las mismas que tienes en `apps/admin/.env` local):

| Name | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | (de tu .env local) |
| `VITE_FIREBASE_AUTH_DOMAIN` | `gallinapp-ac9d8.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `gallinapp-ac9d8` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `gallinapp-ac9d8.appspot.com` (o lo que tengas) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | (de tu .env local) |
| `VITE_FIREBASE_APP_ID` | (de tu .env local) |

> Los valores reales están en `apps/admin/.env`. Cópialos uno por uno.
> Aplican a Production, Preview y Development (deja los 3 checkboxes activos).

### 3.3 Hacer el primer deploy

Click en **"Deploy"**. Vercel va a:
1. Clonar el repo
2. Detectar `apps/admin/vercel.json`
3. Correr el `buildCommand` que sube hasta la raíz del monorepo, instala con pnpm, y builda admin con `--filter`
4. Servir el contenido de `apps/admin/dist`

Si todo va bien, te da una URL temporal tipo `gallinapp-admin-xxx.vercel.app`.
Pruébala — deberías ver la pantalla de Setup (si aún no creaste el primer admin)
o la pantalla de Login.

### 3.4 Conectar el dominio `admin.gallinapp.com`

1. En el proyecto Vercel `gallinapp-admin`, ve a **Settings → Domains**.
2. Click en **Add** y escribe `admin.gallinapp.com`.
3. Vercel te dirá qué registro DNS agregar. Tienes dos opciones:

   **Opción A — Si gallinapp.com está en los nameservers de Vercel** (típico cuando importaste el dominio a Vercel):
   - Vercel auto-configura todo. Espera 1-2 min y listo.

   **Opción B — Si gestionas DNS fuera de Vercel** (Cloudflare, GoDaddy, etc.):
   - Crea un registro **CNAME**:
     - Name: `admin`
     - Value: `cname.vercel-dns.com.`
     - TTL: 3600 (o auto)
   - Espera 5-30 min para propagación.

4. Una vez verificado, Vercel emite un certificado SSL automáticamente.
5. `admin.gallinapp.com` ya carga el panel.

### 3.5 Configurar Firebase Auth para el dominio nuevo

Para que Firebase Auth permita sign-in desde `admin.gallinapp.com`:

1. Ve a https://console.firebase.google.com/project/gallinapp-ac9d8/authentication/settings
2. En **Authorized domains**, click **Add domain**
3. Escribe `admin.gallinapp.com`
4. Save.

Sin esto, el login va a fallar con `auth/unauthorized-domain`.

---

## Parte 4 — Workflow continuo

A partir de aquí:

- **Cambios al admin app**: push a la rama configurada en Vercel (típicamente `main`)
  → auto-deploy en `admin.gallinapp.com`.
- **Cambios a Cloud Functions**: `cd functions && npm run build && cd .. && firebase deploy --only functions`.
- **Cambios a Firestore Rules**: `firebase deploy --only firestore:rules`.

---

## Troubleshooting

**`hasAnyAdmin` devuelve siempre `true`** → revisa que la function esté
desplegada y la región sea la default (us-central1). Si no, el cliente no la
encuentra. En `apps/admin/src/lib/firebase.ts` puedes pasar región a
`getFunctions(app, 'us-central1')`.

**Login funciona pero ves "permission-denied" al leer Firestore** → el trigger
`syncGlobalRoleToClaims` puede haber tardado. Cierra sesión y vuelve a entrar
para forzar el refresh del JWT. O ejecuta manualmente:
```js
await firebase.auth().currentUser.getIdToken(true)
```

**Build de Vercel falla con "pnpm: command not found"** → en Settings → General
→ Build & Development, verifica que el "Node.js Version" sea 20.x. Vercel
detecta `pnpm` automáticamente desde `packageManager` en el package.json del
monorepo (que está pinneado a `pnpm@10.4.1`).

**`admin.gallinapp.com` da 404 en rutas tipo `/dashboard`** → falta el rewrite
SPA. Ya está en `apps/admin/vercel.json` (`{ source: "/(.*)", destination: "/index.html" }`).
Si Vercel no lo aplica, ve a Settings → Rewrites y agrégalo manualmente.
