#!/bin/bash

# Script para analizar qué está ocupando espacio en el Mac

echo "📊 ANÁLISIS DE ESPACIO EN DISCO"
echo "================================"
echo ""

echo "💾 Espacio total del disco:"
df -h / | tail -1
echo ""

echo "🔍 TOP 20 DIRECTORIOS MÁS GRANDES EN HOME:"
echo "-------------------------------------------"
du -sh ~/* 2>/dev/null | sort -hr | head -20
echo ""

echo "📦 CACHES DE DESARROLLO:"
echo "------------------------"
du -sh ~/.npm ~/.pnpm-store ~/.yarn ~/.pnpm 2>/dev/null | grep -v "cannot access" || echo "No encontrados"
du -sh ~/Library/Caches/pnpm ~/Library/Caches/node-gyp ~/Library/Caches/Homebrew 2>/dev/null | grep -v "cannot access" || echo "No encontrados"
echo ""

echo "🌐 CACHES DE NAVEGADORES:"
echo "-------------------------"
du -sh ~/Library/Caches/*Browser* ~/Library/Caches/*Brave* ~/Library/Caches/*Chrome* ~/Library/Caches/*Safari* 2>/dev/null | sort -hr | head -10
echo ""

echo "💻 CACHES DE APLICACIONES:"
echo "--------------------------"
du -sh ~/Library/Caches/* 2>/dev/null | sort -hr | head -15
echo ""

echo "📁 APPLICATION SUPPORT (puede contener datos importantes):"
echo "-----------------------------------------------------------"
du -sh ~/Library/Application\ Support/* 2>/dev/null | sort -hr | head -15
echo ""

echo "📥 DESCARGAS:"
echo "-------------"
du -sh ~/Downloads 2>/dev/null || echo "No accesible"
echo ""

echo "🗑️  PAPELERA:"
echo "-------------"
du -sh ~/.Trash 2>/dev/null || echo "Vacía"
echo ""

echo "📝 LOGS:"
echo "--------"
du -sh ~/Library/Logs 2>/dev/null || echo "No accesible"
echo ""

echo "🔍 NODE_MODULES EN HOME (pueden ser grandes):"
echo "-----------------------------------------------"
find ~ -name "node_modules" -type d -maxdepth 3 -exec du -sh {} \; 2>/dev/null | sort -hr | head -10
echo ""

echo "📊 RESUMEN DE ESPACIO POR CATEGORÍA:"
echo "====================================="
echo ""
echo "Caches de desarrollo:"
du -sh ~/.npm ~/Library/Caches/pnpm ~/Library/Caches/node-gyp ~/Library/Caches/Homebrew 2>/dev/null | awk '{sum+=$1} END {print "Total:", sum}'
echo ""
echo "Caches del sistema:"
du -sh ~/Library/Caches 2>/dev/null | head -1
echo ""
echo "Application Support:"
du -sh ~/Library/Application\ Support 2>/dev/null | head -1
echo ""
echo "Descargas:"
du -sh ~/Downloads 2>/dev/null | head -1 || echo "0B"
echo ""












