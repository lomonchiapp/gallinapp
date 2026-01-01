#!/bin/bash

# Script para limpiar metadatos de proyectos en disco duro externo
# Elimina archivos y carpetas de metadatos del sistema, editores, cachés y builds

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧹 Limpiando metadatos del proyecto...${NC}\n"

# Contador de archivos eliminados
COUNT=0

# Función para eliminar archivos/carpetas y contar
remove_item() {
    if [ -e "$1" ] || [ -d "$1" ] 2>/dev/null; then
        rm -rf "$1" 2>/dev/null && {
            echo -e "${GREEN}✓${NC} Eliminado: $1"
            COUNT=$((COUNT + 1))
        } || echo -e "${RED}✗${NC} Error al eliminar: $1"
    fi
}

# Archivos de metadatos del sistema operativo
echo -e "${YELLOW}📁 Limpiando archivos del sistema...${NC}"
find . -name ".DS_Store" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .DS_Store eliminados"
find . -name "Thumbs.db" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos Thumbs.db eliminados"
find . -name "desktop.ini" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos desktop.ini eliminados"
find . -name "._*" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos ._* eliminados"
find . -name ".Spotlight-V100" -type d -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓${NC} Carpetas .Spotlight-V100 eliminadas"
find . -name ".Trashes" -type d -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓${NC} Carpetas .Trashes eliminadas"
find . -name ".fseventsd" -type d -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓${NC} Carpetas .fseventsd eliminadas"

# Carpetas de editores e IDEs
echo -e "\n${YELLOW}💻 Limpiando carpetas de editores...${NC}"
remove_item ".vscode"
remove_item ".idea"
remove_item "*.swp"
remove_item "*.swo"
remove_item "*~"

# Carpetas de caché y build
echo -e "\n${YELLOW}📦 Limpiando carpetas de build y caché...${NC}"
remove_item "node_modules"
remove_item "dist"
remove_item "dist-ssr"
remove_item ".next"
remove_item ".turbo"
remove_item ".parcel-cache"
remove_item ".cache"
remove_item "build"
remove_item ".output"
remove_item ".nuxt"
remove_item ".vuepress/dist"

# Archivos de caché específicos
echo -e "\n${YELLOW}🗑️  Limpiando archivos de caché...${NC}"
find . -name ".eslintcache" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .eslintcache eliminados"
find . -name "*.log" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .log eliminados"
find . -name ".pnpm-debug.log*" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos pnpm-debug.log eliminados"
# Nota: pnpm-lock.yaml NO se elimina porque es necesario para el proyecto

# Carpetas de dependencias y módulos
echo -e "\n${YELLOW}📚 Limpiando carpetas de dependencias...${NC}"
find . -name ".pnpm-store" -type d -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓${NC} Carpetas .pnpm-store eliminadas"
find . -name ".yarn" -type d -exec rm -rf {} + 2>/dev/null && echo -e "${GREEN}✓${NC} Carpetas .yarn eliminadas"
find . -name ".pnp.*" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .pnp.* eliminados"

# Archivos temporales y de sistema
echo -e "\n${YELLOW}🗂️  Limpiando archivos temporales...${NC}"
find . -name "*.tmp" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .tmp eliminados"
find . -name "*.temp" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .temp eliminados"
find . -name ".DS_Store" -type f -delete 2>/dev/null

# Carpetas de cobertura y testing
echo -e "\n${YELLOW}🧪 Limpiando carpetas de testing...${NC}"
remove_item "coverage"
remove_item ".nyc_output"
remove_item ".jest-cache"

# Carpetas de TypeScript
echo -e "\n${YELLOW}📘 Limpiando archivos de TypeScript...${NC}"
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null && echo -e "${GREEN}✓${NC} Archivos .tsbuildinfo eliminados"

# Resumen
echo -e "\n${GREEN}✨ Limpieza completada!${NC}"
echo -e "${GREEN}Total de elementos eliminados: ${COUNT}${NC}\n"

