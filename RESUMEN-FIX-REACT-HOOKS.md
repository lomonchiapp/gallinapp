# 🔧 Solución: Invalid Hook Call Error

## ❌ Problema

Error: "Invalid hook call. Hooks can only be called inside of the body of a function component"
- `Cannot read property 'useCallback' of null`
- Múltiples copias de React en el monorepo

## ✅ Solución Aplicada

### 1. Agregados Overrides en package.json

```json
"pnpm": {
  "overrides": {
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5"
  }
}
```

Esto fuerza a pnpm a usar una sola versión de React en todo el monorepo.

### 2. Actualizado metro.config.js

- Cambiado el orden de `nodeModulesPaths` para priorizar el root del workspace
- Agregado React y React Native a `extraNodeModules` para forzar resolución desde el root

```javascript
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),  // Root primero
  path.resolve(projectRoot, 'node_modules'),     // Luego proyecto
];

config.resolver.extraNodeModules = napp/types': path.resolve(workspaceRoot, 'packages/types'),
  'react': path.resolve(workspaceRoot, 'node_modules/react'),
  'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
};
```

## 🚀 Próximos Pasos

1. **Limpiar e reinstalar dependencias:**
   ```bash
   cd /Volumes/SSK\ SSD/gallinapp
   rm -rf node_modules apps/*/node_modules packages/*/node_modules
   pnpm install
   ```

2. **Limpiar cache de Metro:**
   ```bash
   cd apps/mobile
   rm -rf .expo node_modules/.cache
   ```

3. **Reiniciar el servidor de desarrollo**

#� Notas

- Los overrides aseguran que todas las apps usen la misma versión de React
- Metro ahora resuelve React desde el root del workspace primero
- Esto previene el error de múltiples copias de React
