// @ts-check
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('src');
const PROBLEMATIC_PATTERN = /@radix-ui\/react-\*/;

/**
 * Verifica recursivamente os arquivos em um diretório
 * @param {string} dir - Diretório a ser verificado
 */
function checkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      checkDirectory(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      checkFile(filePath);
    }
  }
}

/**
 * Verifica um arquivo em busca de padrões problemáticos
 * @param {string} filePath - Caminho do arquivo a ser verificado
 */
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  if (PROBLEMATIC_PATTERN.test(content)) {
    console.log(`Encontrada importação problemática em: ${filePath}`);
    
    // Exibir as linhas com o padrão problemático
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (PROBLEMATIC_PATTERN.test(line)) {
        console.log(`  Linha ${index + 1}: ${line.trim()}`);
      }
    });
    
    console.log('');
  }
}

console.log('Verificando importações problemáticas...');
checkDirectory(SRC_DIR);
console.log('Verificação concluída.');