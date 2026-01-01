const fs = require('fs');

// Corregir engorde.service.ts
let content1 = fs.readFileSync('./apps/mobile/src/services/engorde.service.ts', 'utf8');
// Agregar CategoriaGasto al primer import
content1 = content1.replace(
  /import { Gasto, LoteEngorde, TipoAve } from '@gallinapp\/types';/,
  'import { CategoriaGasto, Gasto, LoteEngorde, TipoAve } from \'@gallinapp/types\';'
);
// Eliminar import dinámico
content1 = content1.replace(/const\s+{\s*CategoriaGasto\s*}\s+=\s+await\s+import\('\.\.\/types\/enums'\);/g, '');
fs.writeFileSync('./apps/mobile/src/services/engorde.service.ts', content1, 'utf8');
console.log('✅ Corregido: engorde.service.ts');

// Corregir levantes.service.ts
let content2 = fs.readFileSync('./apps/mobile/src/services/levantes.service.ts', 'utf8');
// Ver el import actual
const importMatch = content2.match(/import\s*{([^}]+)}\s*from\s+'@gallinapp\/types';/);
if (importMatch) {
  const imports = importMatch[1plit(',').map(i => i.trim()).filter(i => i);
  if (!imports.includes('CategoriaGasto')) {
    imports.unshift('CategoriaGasto');
    content2 = content2.replace(
      /import\s*{[^}]+}\s*from\s+'@gallinapp\/types';/,
      `import {\n    ${imports.join(',\n    ')}\n} from '@gallinapp/types';`
    );
  }
}
// Eliminar import dinámico
content2 = content2.replace(/const\s+{\s*CategoriaGasto\s*}\s+=\s+await\s+import\('\.\.\/types\/enums'\);/g, '');
fs.writeFileSync('./apps/mobile/src/services/levantes.service.ts', content2, 'utf8');
console.log('✅ Corregido: levantes.service.ts');
