#!/bin/bash

# Script de limpieza rápida - Solo elimina cosas 100% seguras
# No requiere confirmación para elementos seguros

set -e

echo "🚀 Limpieza Rápida de Mac (Solo elementos seguros)"
echo "=================================================="
echo ""

total_freed=0

# Función para limpiar y reportar
clean_safe() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        local size_bytes=$(du -sk "$dir" 2>/dev/null | cut -f1)
        local size_human=$(du -sh "$dir" 2>/dev/null | cut -f1)
        rm -rf "$dir"
        total_freed=$((total_freed + size_bytes))
        echo "✅ Eliminado: $description ($size_human)"
    fi
}

echo "🧹 Limpiando caches de desarrollo..."

# Caches de desarrollo (100% seguros)
clean_safe "$HOME/.npm" "Cache de npm"
clean_safe "$HOME/Library/Caches/pnpm" "Cache de pnpm"
clean_safe "$HOME/Library/Caches/node-gyp" "Cache de node-gyp"
clean_safe "$HOME/Library/Caches/Homebrew" "Cache de Homebrew"

echo ""
echo "🧹 Limpiando caches del navegador..."

# Caches del navegador (100% seguros, se regeneran)
clean_safe "$HOME/Library/Caches/com.brave.Browser" "Cache de Brave Browser"
clean_safe "$HOME/Library/Caches/BraveSoftware" "Cache de Brave Software"

echo ""
echo "🧹 Limpiando caches de Cursor..."

# Caches específicos de Cursor (solo cache, no configuración)
if [ -d "$HOME/Library/Application Support/Cursor/Cache" ]; then
    clean_safe "$HOME/Library/Application Support/Cursor/Cache" "Cache de Cursor"
fi
if [ -d "$HOME/Library/Application Support/Cursor/Code Cache" ]; then
    clean_safe "$HOME/Library/Application Support/Cursor/Code Cache" "Code Cache de Cursor"
fi
if [ -d "$HOME/Library/Application Support/Cursor/GPUCache" ]; then
    clean_safe "$HOME/Library/Application Support/Cursor/GPUCache" "GPU Cache de Cursor"
fi
if [ -d "$HOME/Library/Application Support/Cursor/ShaderCache" ]; then
    clean_safe "$HOME/Library/Application Support/Cursor/ShaderCache" "Shader Cache de Cursor"
fi

echo ""
echo "🧹 Limpiando otros caches del sistema..."

# Otros caches seguros
clean_safe "$HOME/Library/Caches/GeoServices" "Cache de GeoServices"
clean_safe "$HOME/Library/Caches/com.apple.helpd" "Cache de ayuda de Apple"

echo ""
echo "🧹 Limpiando logs antiguos (más de 30 días)..."

# Limpiar logs antiguos (más de 30 días)
if [ -d "$HOME/Library/Logs" ]; then
    find "$HOME/Library/Logs" -type f -mtime +30 -delete 2>/dev/null || true
    echo "✅ Logs antiguos eliminados"
fi

echo ""
echo "🧹 Limpiando archivos temporales del sistema..."

# Limpiar archivos temporales antiguos (más de 7 días)
find /tmp -type f -mtime +7 -delete 2>/dev/null || true
find "$HOME/.tmp" -type f -mtime +7 -delete 2>/dev/null || true
echo "✅ Archivos temporales antiguos eliminados"

echo ""
echo "=================================================="
echo "✅ LIMPIEZA COMPLETADA"
echo "=================================================="
echo ""
echo "💾 Espacio liberado aproximadamente: $(du -sh "$HOME/.npm" "$HOME/Library/Caches/pnpm" 2>/dev/null | awk '{sum+=$1} END {print sum}')"
echo ""
echo "📊 Espacio disponible ahora:"
df -h / | tail -1














