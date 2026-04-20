# Probar Gallinapp con TestSprite

Guía para ejecutar pruebas automatizadas con [TestSprite](https://www.testsprite.com/) (MCP en Cursor), siguiendo la documentación oficial.

---

## Fase 1: Requisitos y verificación

### 1.1 Prerrequisitos

- **Node.js >= 22** (TestSprite MCP lo requiere).  
  Comprobar: `node --version`
- **Cuenta TestSprite**: [Registro gratis](https://www.testsprite.com/auth/cognito/sign-up)
- **Cursor** (u otro IDE compatible: VS Code, Windsurf, Claude Code)

### 1.2 Instalación del MCP en Cursor

1. Obtener **API Key**:
   - Entra en [TestSprite Dashboard](https://www.testsprite.com/dashboard)
   - **Settings** → **API Keys** → **New API Key** → copia la clave.

2. Añadir el servidor MCP en Cursor:
   - **Cursor** → **Settings** (⌘⇧J) → **Tools & Integration** → **Add custom MCP**
   - Configuración:

   ```json
   {
     "mcpServers": {
       "TestSprite": {
         "command": "npx",
         "args": ["@testsprite/testsprite-mcp@latest"],
         "env": {
           "API_KEY": "TU_API_KEY_AQUI"
         }
       }
     }
   }
   ```

   Sustituye `TU_API_KEY_AQUI` por tu API key.

   **Si Cursor muestra "Error - Show Output" y en el log aparece `spawn npx ENOENT`:**  
   Cursor no encuentra `npx` porque no hereda el PATH de la terminal (p. ej. si usas nvm/fnm). Usa la **ruta absoluta** de `npx`:
   - En una terminal (donde sí tengas Node): ejecuta `which npx` y copia la ruta (ej. `/Users/tu_usuario/.nvm/versions/node/v22.11.0/bin/npx`).
   - En la config MCP, cambia `"command": "npx"` por `"command": "/ruta/completa/a/npx"` (la que te devolvió `which npx`).
   - Reinicia Cursor o desactiva/activa el servidor TestSprite en Tools.

3. **Sandbox de Cursor**: Para que TestSprite funcione bien, en **Cursor Settings** → **Chat** → **Auto-Run** → **Auto-Run Mode** pon **"Ask Everytime"** o **"Run Everything"** (evita limitaciones del sandbox).

4. Comprobar: en la lista de MCP, TestSprite debe aparecer con indicador verde y herramientas cargadas.

---

## Fase 2: Preparar el proyecto

### 2.1 Qué app probar

TestSprite está pensado para **frontend (React/Vite)** y **backend (Node/APIs)**. En este monorepo:

| App        | Tipo     | Comando dev      | Puerto típico | Uso TestSprite      |
|-----------|----------|------------------|---------------|----------------------|
| **apps/web**   | React/Vite | `pnpm dev:web`   | 5173          | Recomendado (landing, flujos) |
| **apps/admin** | React/Vite | `pnpm dev:admin` | (revisar)     | Panel admin          |
| apps/mobile | Expo     | `pnpm dev:mobile`| —             | No soportado por MCP |

Recomendación: usar **apps/web** para el primer test.

### 2.2 Tener la app en marcha

Antes de lanzar el flujo de TestSprite:

```bash
# Desde la raíz del repo
pnpm dev:web
```

La web suele quedar en **http://localhost:5173**. Comprueba que carga en el navegador.

### 2.3 PRD (Product Requirements Document)

En el **paso de configuración** del primer test, TestSprite pide un PRD (aunque sea borrador). Puedes usar:

- **docs/TESTSPRITE-PRD-draft.md** (incluido en este repo como borrador), o  
- Cualquier documento que describa funcionalidad de la web (landing, login, precios, etc.).

Sube ese archivo cuando la configuración lo pida.

---

## Fase 3: Ejecutar el primer test

1. Abre **Chat** en Cursor (en la raíz del proyecto o en la carpeta que quieras testear).
2. Escribe exactamente:

   ```
   Help me test this project with TestSprite.
   ```

   (O en español: *Ayúdame a probar este proyecto con TestSprite.*)

3. Si quieres limitar el alcance, puedes arrastrar la carpeta del subproyecto al chat (por ejemplo `apps/web`).
4. Pulsa **Shift+Enter**.
5. El asistente usará las herramientas de TestSprite MCP; se abrirá la **página de configuración** en el navegador.

### 3.1 Completar la configuración (obligatorio)

En esa página debes rellenar:

| Campo | Valor sugerido (apps/web) |
|-------|----------------------------|
| **Testing Type** | **Frontend** (UI, flujos de usuario) |
| **Scope** | **Codebase** (primera vez) o **Code Diff** (solo cambios recientes) |
| **Application URL** | `http://localhost:5173` |
| **Test Account** | Si la web tiene login: usuario/contraseña de prueba. Si no, dejar en blanco o "None". |
| **Product Requirements Document** | Subir `docs/TESTSPRITE-PRD-draft.md` (o tu PRD). |

Guarda la configuración y deja que el asistente continúe (generación de plan de pruebas, ejecución, informe).

---

## Fase 4: Resultados y arreglos

- Los resultados se generan en el proyecto (p. ej. carpeta `testsprite_tests/` con informes y casos de prueba).
- Para pedir correcciones automáticas basadas en los fallos, puedes decir en el chat:

  ```
  Please fix the codebase based on TestSprite testing results.
  ```

---

## Resolución de problemas

- **REDROID Agent (dashboard: API key / enrolamiento / dispositivos Android)**: En **Windows**, ejecuta **REDROID Agent como administrador** (clic derecho → *Ejecutar como administrador*) para evitar fallos con **ADB** (`spawn adb ENOENT`, dispositivos no listados). Detalle en [`docs/REDROID-AGENT.md`](./REDROID-AGENT.md).
- **`spawn npx ENOENT` / "Error - Show Output" en TestSprite**: Cursor no encuentra `npx` en el PATH (común si usas nvm, fnm o Node instalado solo en la shell). **Solución:** En terminal ejecuta `which npx` y usa esa ruta absoluta como `"command"` en la config MCP en lugar de `"npx"`. Ejemplo: `"command": "/Users/tu_usuario/.nvm/versions/node/v22.11.0/bin/npx"`. Reinicia el servidor MCP o Cursor.
- **"Command not found" / MCP no responde**: Comprueba Node >= 22 y que la API key esté bien en la config MCP. Reinicia Cursor.
- **La app no se detecta**: Asegúrate de que `pnpm dev:web` está corriendo y que la URL en la config es la correcta (ej. `http://localhost:5173`).
- **Fallo en configuración / tests**: Ver [Troubleshooting](https://docs.testsprite.com/mcp/troubleshooting/installation-issues) en la documentación de TestSprite.

Documentación oficial: [TestSprite Docs](https://docs.testsprite.com/).
