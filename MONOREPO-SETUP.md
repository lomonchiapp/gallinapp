# Configuración de Monorepo con pnpm

## Problema Resuelto

La aplicación mobile estaba intentando importar tipos desde una carpeta local `src/types/` que estaba desactualizada y faltaban archivos (como `subscription.ts`), en lugar de usar el paquete compartido `@gallinapp/types` del workspace.

## Principios de Monorepo con pnpm

### 1. **Workspace Protocol**
- Usar `workspace:^` en las dependencias para referenciar paquetes del workspace
- Ejemplo en `apps/mobile/package.json`:
```json
{
  "dependencies": {
    "@gallinapp/types": "workspace:^"
  }
}
```

### 2. **Package Exports**
- Definir exports explícitos en `package.json` de cada paquete compartido
- Permite importar submódulos específicos
- Ejemplo en `packages/types/package.json`:
```json
{
  "name": "@gallinapp/types",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
    "./subscription": "./subscription.ts",
    "./account": "./account.ts
}
```

### 3. **TypeScript Paths**
- Configurar paths en `tsconfig.base.json` en la raíz del monorepo
- Los proyectos individuales heredan estos paths
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@gallinapp/types": ["packages/types/index.ts"],
      "@gallinapp/types/*": ["packages/types/*"]
    }
  }
}
```

### 4. **Metro Bundler Configuration**
- Para React Native, configurar Metro para resolver paquetes del workspace
- Habilitar soporte para symlinks (usado por pnpm)
- Configurar `extraNodeModules` para resolver aliases

```javascript
// apps/mobile/metro.config.js
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPath = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.extraNodeModules = {
  '@gallinapp/types': path.resolve(workspaceRoot, 'packages/types'),
};
```

## Cambios Aplicados

### 1. ✅ Actualizado `packages/types/package.json`
- Agregado campo `exports` con todos los módulos disponibles
- Cogurado `main` y `types` correctamente

### 2. ✅ Actualizado `tsconfig.base.json`
- Corregido path de `@gallinapp/types` (eliminado `/src/` inexistente)
- Agregado wildcard path para submódulos

### 3. ✅ Actualizado `apps/mobile/tsconfig.json`
- Heredado paths del `tsconfig.base.json`
- Agregado paths relativos para resolver correctamente

### 4. ✅ Actualizado `apps/mobile/metro.config.js`
- Agregado `extraNodeModules` para resolver `@gallinapp/types`
- Mantenido soporte para symlinksage exports

### 5. ✅ Reemplazados imports relativos
- Cambiado `from '../../types/subscription'` → `from '@gallinapp/types'`
- Cambiado `from '../../types'` → `from '@gallinapp/types'`
- Actualizado ~45 archivos en `apps/mobile/src/` y `apps/mobile/app/`

### 6. ✅ Eliminada carpeta duplicada
- Eliminado `apps/mobile/src/types/` (copia desactualizada)
- Ahora solo existe una fuente de verdad: `packages/types/`

### 7. ✅ Limpieza y reinstalación
- Limpiado cache de Metro y Expo
- Reinstalado dependencias con `pnpm install`

## Ventajas de esta Configuración

1. **Single Source of Truth**: Los tipos están en un solo lugar (`packages/types/`)
2. **Type Safetpt valida los tipos en todo el monorepo
3. **Reutilización**: Múltiples apps pueden usar los mismos tipos
4. **Mantenibilidad**: Cambios en tipos se reflejan automáticamente en todas las apps
5. **No Duplicación**: Elimina copias desactualizadas de código

## Cómo Usar

### Importar tipos en cualquier app del monorepo:

```typescript
// Importar todo desde el índice principal
import { SubscriptionPlan, Account, Farm } from '@gallinapp/types';

// O importar desde submódulos específicos (si están en exports)
import { SubscriptionPlan } from '@gallinapp/types/subscription';
```

### Agregar nuevos tipos:

1. Crear archivo en `packages/types/`
2. Exportar desde `packages/types/index.ts`
3. (Ogregar export específico en `package.json`

### Agregar nueva app al monorepo:

1. Crear carpeta en `apps/`
2. Agregar `"@gallinapp/types": "workspace:^"` en dependencies
3. Extender `tsconfig.base.json`
4. Configurar bundler específico (Vite, Metro, etc.)

## Verificación

Para verificar que todo funciona correctamente:

```bash
# Desde la raíz del monorepo
cd /Volumes/SSK\ SSD/gallinapp

# Verificar TypeScript
pnpm --filter mobile typecheck

# Iniciar la app mobile
pnpm --filter mobile start
```

## Referencias

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/book/project-references.html)
- [Metro Bundler Configuration](https://metrobundler.dev/docs/configuration)
- [Package.json exports](https://nodejs.org/api/packages.html#exports)
