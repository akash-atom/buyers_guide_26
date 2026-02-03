const postcss = require('postcss');
const fs = require('fs');

const css = fs.readFileSync('./src/globals.source.css', 'utf8');

postcss([require('@tailwindcss/postcss')])
  .process(css, {
    from: './src/globals.source.css',
    to: './src/globals.css'
  })
  .then(result => {
    // Add critical variables at the very top
    const criticalVars = `*, ::before, ::after, ::backdrop {
  --tw-border-style: solid;
  --tw-space-y-reverse: 0;
}

`;
    const finalCss = criticalVars + result.css;

    fs.writeFileSync('./src/globals.css', finalCss);
    console.log('✓ Compiled globals.css with critical variables');
  })
  .catch(error => {
    console.error('Error compiling CSS:', error);
    process.exit(1);
  });
