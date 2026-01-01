const fs = require('fs');

// 1. Corregir engorde.service.ts
let engorde = fs.readFileSync('./apps/mobile/src/services/engorde.service.ts', 'utf8');
// Agregar CategoriaGasto al primer import
engorde = engorde.replace(
  'import { Gasto, LoteEngorde, TipoAve } from \'@gallinapp/types\';',
  'import { CategoriaGasto, Gasto, LoteEngorde, TipoAve } from \'@gallinapp/types\';'
);
// Eliminar línea con import dinámico
engorde = engorde.replace(/\s*const\s+{\s*CategoriaGasto\s*}\s+=\s+await\s+import\('\.\.\/types\/enums'\);\s*\n/g, '\n');
fs.writeFileSync('./apps/mobile/src/services/engorde.service.ts', engorde, 'utf8');
console.log('✅ engorde.service.ts corregido');

// 2. Corregir levantes.service.ts  
let levantes = fs.readFileSync('./apps/mobile/src/services/levantes.service.ts', 'utf8');
// Agregar CategoriaGasto al import (buscar el bloque completo)
levantes = levantes.replace(
  /(import\s*{\s*[^}]*)(RegistroMortalidad,\s*TipoAve\s*}\om\s+'@gallinapp\/types';)/,
  '$1CategoriaGasto,\n    $2'
);
// Eliminar línea con import dinámico
levantes = levantes.replace(/\s*conss+{\s*CategoriaGasto\s*}\s+=\s+await\s+import\('\.\.\/types\/enums'\);\s*\n/g, '\n');
fs.writeFileSync('./apps/mobile/src/services/levantes.service.ts', levantes, 'utf8');
console.log('✅ levantes.service.ts corregido');
