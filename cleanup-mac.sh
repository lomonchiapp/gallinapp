#!/bin/bash

# Script de limpieza segura para Mac
# Muestra primero qué se va a eliminar y luego pregunta confirmación

set -e

echo "🧹 Script de Limpieza de Mac"
echo "=============================="
echo ""

# Función para mostrar tamaño y eliminar
cleanup_dir() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        local size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo "📁 $description: $size"
        echo "   Ubicación: $dir"
        return 0
    else
        echo "❌ $description: No existe"
        return 1
    fi
}

# Función para limpiar con confirmación
clean_with_confirmation() {
    local dir=$1
    local description=$2
    
    if [ -d "$dir" ]; then
        local size=$(du -sh "$dir" 2>/dev/null | cut -f1)
        echo ""
        echo "¿Eliminar $description ($size)? (s/n)"
        read -r response
        if [[ "$response" =~ ^[Ss]$ ]]; then
            rm -rf "$dir"
            echo "✅ Eliminado: $description"
        else
            echo "⏭️  Omitido: $description"
        fi
    fi
}

echo "📊 ANÁLISIS DE ESPACIO:"
echo "======================="
echo ""

# Caches de desarrollo
cleanup_dir "$HOME/.npm" "Cache de npm"
cleanup_dir "$HOME/Library/Caches/pnpm" "Cache de pnpm"
cleanup_dir "$HOME/Library/Caches/node-gyp" "Cache de node-gyp"
cleanup_dir "$HOME/Library/Caches/Homebrew" "Cache de Homebrew"

# Caches del sistema
cleanup_dir "$HOME/Library/Caches/com.brave.Browser" "Cache de Brave Browser"
cleanup_dir "$HOME/Library/Caches/BraveSoftware" "Cache de Brave Software"
cleanup_dir "$HOME/Library/Caches/GeoServices" "Cache de GeoServices"

# Logs
cleanup_dir "$HOME/Library/Logs" "Logs del sistema"

# Application Support (solo caches, no datos importantes)
cleanup_dir "$HOME/Library/Application Support/Cursor/Cache" "Cache de Cursor"
cleanup_dir "$HOME/Library/Application Support/Cursor/Code Cache" "Code Cache de Cursor"
cleanup_dir "$HOME/Library/Application Support/Cursor/GPUCache" "GPU Cache de Cursor"
cleanup_dir "$HOME/Library/Application Support/BraveSoftware/Brave-Browser/Default/Code Cache" "Code Cache de Brave"

# Descargas y temporales
cleanup_dir "$HOME/Downloads/node_modules" "node_modules en Downloads"
cleanup_dir "$HOME/Downloads/orientalmobile-main" "Proyecto oriental mobile (si no lo necesitas)"

# Otros temporales
cleanup_dir "/tmp" "Archivos temporales del sistema"

echo ""
echo "=============================="
echo "🚀 INICIANDO LIMPIEZA..."
echo "=============================="
echo ""
echo "⚠️  ATENCIÓN: Se eliminarán caches y archivos temporales."
echo "   Los datos importantes NO se eliminarán."
echo ""
echo "¿Continuar? (s/n)"
read -r confirm

if [[ ! "$confirm" =~ ^[Ss]$ ]]; then
    echo "❌ Limpieza cancelada"
    exit 0
fi

echo ""
echo "🧹 Limpiando..."

# Limpiar caches de desarrollo (seguros)
clean_with_confirmation "$HOME/.npm" "Cache de npm"
clean_with_confirmation "$HOME/Library/Caches/pnpm" "Cache de pnpm"
clean_with_confirmation "$HOME/Library/Caches/node-gyp" "Cache de node-gyp"
clean_with_confirmation "$HOME/Library/Caches/Homebrew" "Cache de Homebrew"

# Limpiar caches del navegador (seguros)
clean_with_confirmation "$HOME/Library/Caches/com.brave.Browser" "Cache de Brave Browser"
clean_with_confirmation "$HOME/Library/Caches/BraveSoftware" "Cache de Brave Software"

# Limpiar caches específicos de Cursor (seguros, solo cache)
if [ -d "$HOME/Library/Application Support/Cursor/Cache" ]; then
    clean_with_confirmation "$HOME/Library/Application Support/Cursor/Cache" "Cache de Cursor"
fi
if [ -d "$HOME/Library/Application Support/Cursor/Code Cache" ]; then
    clean_with_confirmation "$HOME/Library/Application Support/Cursor/Code Cache" "Code Cache de Cursor"
fi
if [ -d "$HOME/Library/Application Support/Cursor/GPUCache" ]; then
    clean_with_confirmation "$HOME/Library/Application Support/Cursor/GPUCache" "GPU Cache de Cursor"
fi

# Limpiar logs antiguos (mantener los últimos 7 días)
if [ -d "$HOME/Library/Logs" ]; then
    echo ""
    echo "¿Limpiar logs antiguos (más de 7 días)? (s/n)"
    read -r log_confirm
    if [[ "$log_confirm" =~ ^[Ss]$ ]]; then
        find "$HOME/Library/Logs" -type f -mtime +7 -delete 2>/dev/null || true
        echo "✅ Logs antiguos eliminados"
    fi
fi

# Limpiar archivos temporales del sistema
echo ""
echo "¿Limpiar archivos temporales del sistema (/tmp)? (s/n)"
read -r tmp_confirm
if [[ "$tmp_confirm" =~ ^[Ss]$ ]]; then
    # Solo eliminar archivos de más de 1 día en /tmp
    find /tmp -type f -mtime +1 -delete 2>/dev/null || true
    echo "✅ Archivos temporales eliminados"
fi

# Limpiar node_modules en Downloads si existe
if [ -d "$HOME/Downloads/orientalmobile-main/node_modules" ]; then
    clean_with_confirmation "$HOME/Downloads/orientalmobile-main/node_modules" "node_modules en Downloads"
fi

echo ""
echo "=============================="
echo "✅ LIMPIEZA COMPLETADA"
echo "=============================="
echo ""
echo "💾 Espacio liberado. Verifica el espacio disponible:"
df -h / | tail -1














