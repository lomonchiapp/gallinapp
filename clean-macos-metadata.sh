#!/bin/bash

echo "🧹 Limpiando archivos de metadata de macOS..."
echo ""

# Contar archivos antes de eliminar
echo "📊 Contando archivos de metadata..."
DOTUNDERSCORE=$(find . -type f -name "._*" 2>/dev/null | wc -l | tr -d ' ')
DOTBANG=$(find . -type f -name ".!*" 2>/dev/null | wc -l | tr -d ' ')
DSSTORE=$(find . -type f -name ".DS_Store" 2>/dev/null | wc -l | tr -d ' ')
TOTAL=$((DOTUNDERSCORE + DOTBANG + DSSTORE))

echo "  - Archivos ._* : $DOTUNDERSCORE"
echo "  - Archivos .!* : $DOTBANG"
echo "  - Archivos .DS_Store : $DSSTORE"
echo "  - Total: $TOTAL archivos"
echo ""

if [ $TOTAL -eq 0 ]; then
    echo "✅ No hay archivos de metadata para limpiar"
    exit 0
fi

echo "🗑️  Eliminando archivos..."

# Eliminar archivos ._*
find . -type f -name "._*" -delete 2>/dev/null

# Eliminar archivos .!*
find . -type f -name ".!*" -delete 2>/dev/null

# Eliminar .DS_Store
find . -type f -name ".DS_Store" -delete 2>/dev/null

echo "�ompletada: $TOTAL archivos eliminados"
echo ""
echo "💡 Tip: Estos archivos se crean porque tu disco está formateado con exFAT/FAT32"
echo "   Para prevenir su creación, usa el comando:"
echo "   defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true"
