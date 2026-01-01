const fs = require('fs');

const files = [
  './apps/mobile/src/services/engorde.service.ts',
  './apps/mobile/src/services/levantes.service.ts'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Agregar CategoriaGasto al import estático si no está
  if (content.includes("from '@gallinapp/types'") && !content.includes('CategoriaGasto')) {
    // Buscar el import y agregar CategoriaGasto
    content = content.replace(
      /(import\s*{\s*)([^}]+)(\s*}\s*from\s+'@gallinapp\/types';)/,
      (match, start, imports, end) => {
        const importsList = imports.split(',').map(i => i.trim()).filter(i => i);
        if (!importsList.includes('CategoriaGasto')) {
          importsList.unshift('CategoriaGasto');
        }
        return start + '\n    ' + importsList.join(',\n    ') + '\n' + end;
      }
    );
  }
  
  // Eliminar el import dinámico
  content = cont.replace(
    /const\s+{\s*CategoriaGasto\s*}\s+=\s+await\s+import\('\.\.\/types\/enums'\);/g,
    ''
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corregido: ${filePath}`);
  }
});
