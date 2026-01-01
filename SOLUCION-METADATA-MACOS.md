# 🧹 Solución: Archivos de Metadata de macOS

## ❌ Problema

Se estaban creando miles de archivos con nombres como:
- `.!27493!._index.tsx`
- `._archivo.ts`
- `.DS_Store`

**Total encontrado**: 12,017 archivos de metadata

## ✅ Causa

Estos archivos NO son un virus. Son archivos de metadata de macOS que se crean automáticamente cuando:

1. **Tu disco está formateado con exFAT o FAT32** (no nativo de macOS)
2. macOS necesita guardar información adicional (resource forks, atributos extendidos)
3. Como el sistema de archivos no soporta estos metadatos nativamente, macOS crea archivos separados

### Tipos de archivos:

- **`._*`** - AppleDouble files (resource forks)
- **`.!*`** - Archivos temporales de metadata
- **`.DS_Store`** - Configuración de carpetas del Finder

## 🛠️ Solución Implementada

### 1. ✅ Script de Limpieza Automática

Creado: `clean-macos-metadata.sh`

```bash
# Ejecutar cuando sea necesario
./clean```

Este script:
- Cuenta todos los archivos de metadata
- Los elimina de forma segura
- Muestra estadísticas de limpieza

### 2. ✅ Actualizado `.gitignore`

Agregadas reglas para ignorar:
```gitignore
# Archivos AppleDouble (resource forks)
._*
.!*
*/.!*
**/.!*

# Archivos .DS_Store
.DS_Store
**/.Store

# Otros archivos de macOS
.Spotlight-V100
.Trashes
.TemporaryItems
.fseventsd
```

### 3. ✅ Creado `.gitattributes`

Configuración para que Git trate estos archivos como binarios y no los incluya en diffs.

### 4. ✅ Limpieza Completada

**Resultado**: 12,017 archivos eliminados

## 🚀 Prevención Futura

### Opción 1: Configurar macOS (Recomendado)

Ejecuta este comando en tu terminal pnir la creación de archivos `.DS_Store` en discos de red y externos:

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true
```

Reinicia tu Mac para aplicar los cambios.

### Opción 2: Limpiar Periódicamente

Si larchivos siguen apareciendo, ejecuta el script de limpieza regularmente:

```bash
cd /Volumes/SSK\ SSD/gallinapp
./clean-macos-metadata.sh
```

### Opción 3: Reformatear el Disco (Opcional)

Si es posible, reformatea tu disco externo a **APFS** o **Mac OS Extended (Journaled)** para evitar copletamente estos archivos. 

⚠️ **Advertencia**: Esto borrará todos los datos del disco.

## 📋 Comandos Útiles

### Verificar archivos de metadata:
```bash
find . -type f \( -name "._*" -o -name ".!*" -o -name ".DS_Store" \) | wc -l
```

### Limpiar manualmentsh
find . -type f -name "._*" -delete
find . -type f -name ".!*" -delete
find . -type f -name ".DS_Store" -delete
```

### Ver archivos ocultos en Finder:
```bash
defaults write com.apple.finder AppleShowAllFiles YES
killall Finder
```

### Ocultar archivos de nuevo:
```bash
defaults write com.apple.finder AppleShowAllFiles NO
killall Finder
```

## ✨ Beneficios de la Solución

1. ✅ **Repositorio limpio** - Sin archivos de metadata en Git
2. ✅ **Prevención automática** - `.gitignore` actualizado
3. ✅ **Script reutilizable** - Limpieza fácil cuando sea necesario
4. ✅ **Documentación** - Guía completa para el equipo

## 🔗 Referencias

- ote TN1150](https://developer.apple.com/library/archive/technotes/tn/tn1150.html)
- [AppleDouble Format](https://en.wikipedia.org/wiki/AppleSingle_and_AppleDouble_formats)
- [Git Attributes Documentation](https://git-scm.com/docs/gitattributes)

---

**Fecha**: 30 de Diciembre, 2025  
**Estado**: ✅ Resuelto  
**Archivos eliminados**: 12,017
