# Prevenir archivos de metadatos ._* en macOS

Los archivos `._*` son metadatos que macOS crea automáticamente, especialmente en discos externos. Estos archivos pueden interrumpir el Fast Refresh de Expo/React Native.

## Solución Rápida

Ejecuta el script de limpieza:
```bash
pnpm clean:dotfiles
# o
./clean-dot-underscore.sh
```

## Prevenir que se creen (Solución Permanente)

### Opción 1: Desactivar para el disco externo completo

```bash
# Reemplaza "/Volumes/SSK SSD" con la ruta de tu disco externo
sudo dot_clean -m "/Volumes/SSK SSD"
```

### Opción 2: Configurar macOS para no crear metadatos en discos externos

1. Abre Terminal
2. Ejecuta:
```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
```

3. Reinicia tu Mac o cierra sesión y vuelve a entrar

### Opción 3: Usar un watcher automático (Recomendado para desarrollo)

Puedes usar `watchman` o `nodemon` para limpiar automáticamente:

```bash
# Instalar watchman (si no lo tienes)
brew install watchman

# Crear un script que se ejecute automáticamente
watchman watch-del-all
watchman watch-project .
watchman -- trigger . clean-dotfiles '**/._*' -- bash ./clean-dot-underscore.sh
```

## Nota

Los archivos `._*` ya están en `.gitignore`, por lo que no se subirán al repositorio. El problema es que interrumpen el Fast Refresh durante el desarrollo.












