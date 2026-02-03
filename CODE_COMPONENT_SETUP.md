# Webflow Code Component Setup - Correct Approach

Based on the official Webflow Code Components documentation.

## Step 1: Initialize a Webflow App

Run in your terminal:

```bash
webflow extension init
```

When prompted:
- **Extension name**: `IT Maturity Quiz`
- **Site**: Select "Atomicwork Main Website"
- **Template**: Choose the React template

This creates the app structure.

## Step 2: Define Your Code Component

After initialization, the CLI will create a structure. You'll need to:

### A. Create/Update Your Component File

In the generated `src/` folder, create or update your component:

**File: `src/ITMaturityQuiz.tsx`**

```tsx
import React from 'react';
import Quiz from './components/Quiz';

// Import component styles
import './index.css';

// This is the component that will be available in Webflow
export default function ITMaturityQuiz() {
  return (
    <div className="it-maturity-quiz-wrapper">
      <Quiz />
    </div>
  );
}
```

### B. Copy Your Quiz Files

Copy these files to the extension's `src/` directory:
- `src/components/Quiz.tsx`
- `src/index.css`
- `tailwind.config.js`
- `postcss.config.js`

### C. Install Dependencies

In the extension directory:

```bash
npm install react react-dom
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom typescript
```

### D. Update Package.json

Make sure your package.json includes these dependencies.

## Step 3: Register the Code Component

In your extension's configuration (usually `extension.config.ts` or similar), register your code component:

```typescript
import { defineConfig } from '@webflow/designer-extension-typings';

export default defineConfig({
  // App metadata
  name: 'IT Maturity Quiz',
  description: 'Interactive questionnaire to assess IT maturity level',

  // Define your code components
  components: [
    {
      // Component identifier
      name: 'ITMaturityQuiz',
      // Display name in Webflow
      label: 'IT Maturity Quiz',
      // Component file
      component: './src/ITMaturityQuiz.tsx',
      // Optional: Component icon
      // icon: './assets/icon.svg',
    }
  ]
});
```

## Step 4: Build and Test

Build your extension:

```bash
npm run build
# or
webflow extension build
```

Start dev mode to test in Webflow:

```bash
webflow extension dev
```

This will let you test the component in your Webflow Designer.

## Step 5: Use in Webflow

1. Open Webflow Designer
2. Go to the Apps panel
3. Find your "IT Maturity Quiz" app
4. Drag the "IT Maturity Quiz" component onto your page
5. It will render with full functionality

## Communication with Webflow

Your Quiz component already dispatches the `showReport` event. In Webflow, add this custom code:

**Webflow Page Settings → Custom Code → Before </body>:**

```html
<script>
window.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('showReport', function(event) {
    const data = event.detail;
    console.log('Quiz data:', data);

    // Show report block
    const reportBlock = document.querySelector('.report-block');
    if (reportBlock) {
      reportBlock.style.display = 'block';
      reportBlock.scrollIntoView({ behavior: 'smooth' });
    }

    // Customize based on maturity level
    if (data.maturityLevel === 'Reactive IT') {
      document.querySelector('.report-reactive')?.style.setProperty('display', 'block');
    } else if (data.maturityLevel === 'Structured IT') {
      document.querySelector('.report-structured')?.style.setProperty('display', 'block');
    } else if (data.maturityLevel === 'Optimized IT') {
      document.querySelector('.report-optimized')?.style.setProperty('display', 'block');
    }
  });
});
</script>
```

## File Structure After Setup

```
it-maturity-quiz-extension/
├── src/
│   ├── components/
│   │   └── Quiz.tsx          # Your quiz component
│   ├── ITMaturityQuiz.tsx    # Code component wrapper
│   ├── index.css             # Tailwind styles
│   └── index.tsx             # Extension entry (if needed)
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── extension.config.ts       # Extension configuration
└── tsconfig.json
```

## Commands Summary

```bash
# 1. Authenticate (if not done)
webflow auth login

# 2. Initialize extension
webflow extension init

# 3. Install dependencies
npm install

# 4. Build
npm run build

# 5. Test in Designer
webflow extension dev

# 6. Register/publish
webflow extension register
```

## Troubleshooting

**Component not showing:**
- Make sure extension is registered correctly
- Check that build completed without errors
- Refresh Webflow Designer

**Styles not working:**
- Verify Tailwind is configured
- Check that index.css is imported
- Make sure PostCSS is set up

**TypeScript errors:**
- Install all @types packages
- Check tsconfig.json configuration

## Next Steps

1. Run `webflow extension init` in your terminal
2. Let me know what the CLI generates
3. We'll copy your Quiz component into the proper structure
4. Build and test in Webflow Designer

---

**Ready to proceed?** Run `webflow extension init` in your terminal now!
