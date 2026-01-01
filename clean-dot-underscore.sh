#!/bin/bash

# Script rápido para eliminar archivos de metadatos ._* que interrumpen el Fast Refresh
# Excluye node_modules para mayor eficiencia
# Uso: ./clean-dot-underscore.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧹 Limpiando archivos ._* (metadatos de macOS)...${NC}\n"

COUNT=0

# Buscar y eliminar archivos ._* excluyendo node_modules y .git
while IFS= read -r -d '' file; do
    rm -f "$file" && {
        COUNT=$((COUNT + 1))
        # Solo mostrar los primeros 20 para no saturar la salida
        if [ $COUNT -le 20 ]; then
            echo -e "${GREEN}✓${NC} Eliminado: $file"
        fi
    }
done < <(find . -name "._*" -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -print0 2>/dev/null)

if [ $COUNT -eq 0 ]; then
    echo -e "${GREEN}✨ No se encontraron archivos ._* para eliminar${NC}\n"
else
    if [ $COUNT -gt 20 ]; then
        echo -e "${GREEN}... y ${COUNT} archivos más${NC}"
    fi
    echo -e "\n${GREEN}✨ Limpieza completada! Se eliminaron ${COUNT} archivo(s)${NC}\n"
fi

