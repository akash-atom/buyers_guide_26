# Webflow Code Component Setup Guide

This guide will help you register your Quiz component as a Webflow Code Component.

## Prerequisites

- Webflow account with Code Components access (Workspace plan)
- Node.js and npm installed
- Webflow CLI installed globally: `npm install -g @webflow/webflow-cli`

## Step 1: Authenticate with Webflow

Open your terminal and run:

```bash
webflow auth login
```

This will open your browser to authenticate with Webflow.

## Step 2: Create a New Designer Extension

In your project directory, run:

```bash
webflow extension init
```

When prompted:
- **Extension name**: `IT Maturity Quiz` (or your preferred name)
- **Template**: Choose "React" or "Blank"
- **Location**: Use current directory or create new folder

## Step 3: Register Your Quiz Component

After initialization, you'll need to integrate your Quiz component:

### Option A: Copy Your Quiz Component

1. Copy your `src/components/Quiz.tsx` to the extension's src folder
2. Copy your `src/index.css` for Tailwind styles
3. Update the main component file to use your Quiz component

### Option B: Use This Repository

If Webflow CLI created a new folder:

1. Copy these files from this repo to the extension folder:
   - `src/components/Quiz.tsx`
   - `src/index.css`
   - `tailwind.config.js`
   - `postcss.config.js`
   - Package dependencies from `package.json`

2. Install dependencies:
   ```bash
   npm install react react-dom
   npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
   ```

3. Update the main component file to export Quiz:
   ```tsx
   import Quiz from './components/Quiz';
   export default Quiz;
   ```

## Step 4: Configure the Component

Edit the generated `webflow.json` or extension config file:

```json
{
  "name": "IT Maturity Quiz",
  "description": "Interactive quiz to assess IT maturity level",
  "version": "1.0.0",
  "components": [
    {
      "name": "Quiz",
      "displayName": "IT Maturity Quiz",
      "description": "An interactive questionnaire to determine IT maturity level",
      "properties": []
    }
  ]
}
```

## Step 5: Build the Component

Build your component for Webflow:

```bash
webflow extension build
```

Or use the dev mode for testing:

```bash
webflow extension dev
```

## Step 6: Register with Webflow

Register the extension with your Webflow site:

```bash
webflow extension register
```

Follow the prompts to select your Webflow site.

## Step 7: Use in Webflow Designer

1. Open your Webflow Designer
2. Go to the **Apps** panel
3. Find your "IT Maturity Quiz" component
4. Drag it onto your page
5. The Quiz will appear and function just like any other Webflow element

## Communication with Webflow

The Quiz component already dispatches the `showReport` event when users click "Read the report".

**Add this to your Webflow Page Settings → Custom Code (Before </body>):**

```html
<script>
  window.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('showReport', function(event) {
      const data = event.detail;
      console.log('Quiz completed:', data);

      // Show your report block
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

## Event Data Structure

When "Read the report" is clicked, the component sends:

```javascript
{
  maturityLevel: "Reactive IT" | "Structured IT" | "Optimized IT",
  score: 3-9,
  email: "user@company.com",
  answers: { 0: "option_1", 1: "option_2", 2: "option_3", 3: "option_1" },
  selectedGoal: "option_1" | "option_2" | "option_3" | "option_4",
  timestamp: "2026-01-30T12:00:00.000Z"
}
```

## Troubleshooting

**CLI authentication issues:**
- Make sure you're logged into Webflow
- Try `webflow auth logout` then `webflow auth login` again

**Component not showing in Designer:**
- Check that registration completed successfully
- Refresh the Webflow Designer
- Check the Apps panel

**Styles not working:**
- Ensure Tailwind is configured properly
- Make sure `index.css` is imported
- Check that build process includes CSS

**Event not firing:**
- Open browser console to see the dispatched event
- Verify custom code is in the correct location
- Check for JavaScript errors

## Additional Resources

- [Webflow Code Components Docs](https://developers.webflow.com/code-components)
- [Webflow CLI Reference](https://developers.webflow.com/code-components/cli)
- [Designer Extension API](https://developers.webflow.com/code-components/api)

## Alternative: Manual Integration (If Code Components Not Available)

If you don't have access to Code Components yet:

1. Deploy the app to Vercel/Netlify (see DEPLOYMENT_GUIDE.md)
2. Embed via iframe in Webflow
3. Use postMessage for communication (see WEBFLOW_INTEGRATION.md)

---

## Quick Start Summary

```bash
# 1. Authenticate
webflow auth login

# 2. Initialize extension
webflow extension init

# 3. Copy your Quiz component to the extension

# 4. Install dependencies
npm install

# 5. Build
webflow extension build

# 6. Register
webflow extension register

# 7. Use in Webflow Designer!
```
