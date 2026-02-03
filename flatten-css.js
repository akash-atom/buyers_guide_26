const fs = require('fs');

// Read the compiled CSS
const css = fs.readFileSync('./src/globals.css', 'utf8');

// Extract critical CSS variable initializations from @layer properties
const criticalVars = `
*, ::before, ::after, ::backdrop {
  --tw-border-style: solid;
  --tw-space-y-reverse: 0;
}
`;

// Remove @layer wrappers by flattening the structure
let flattened = css
  .replace(/@layer\s+[^{]+\s*\{/g, '') // Remove @layer openings
  .replace(/^@property\s+--[\s\S]+?\}/gm, '') // Remove @property declarations
  .replace(/@layer\s+properties\s*\{[\s\S]*?\n\}/gm, ''); // Remove @layer properties block

// Count and balance braces
let braceCount = 0;
let result = '';
for (let char of flattened) {
  if (char === '{') braceCount++;
  if (char === '}') {
    braceCount--;
    if (braceCount < 0) {
      // Skip extra closing braces from removed @layer statements
      braceCount = 0;
      continue;
    }
  }
  result += char;
}

// Prepend critical variable initializations
result = criticalVars + '\n' + result;

fs.writeFileSync('./src/index.css', result);
console.log('✓ Flattened CSS for local dev with critical variables');
