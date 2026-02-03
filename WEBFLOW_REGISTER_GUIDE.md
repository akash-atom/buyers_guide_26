# Register Component Library with Webflow

Now that I understand the correct approach, here's how to register your Quiz component library with Webflow.

## What We've Set Up:

1. ✅ **Component library structure** - Your Quiz component is ready
2. ✅ **Export configuration** - `src/index.ts` exports the component
3. ✅ **Library build config** - `vite.config.lib.ts` for building as a library
4. ✅ **Webflow manifest** - `webflow.json` describes the components

## Step 1: Build Your Component Library

Run this in your terminal:

```bash
npm run build:lib
```

This builds your Quiz component as a library that Webflow can consume.

## Step 2: Register with Webflow

Run this in your terminal:

```bash
webflow extension register
```

This command will:
- Read your `webflow.json` configuration
- Register your component library with Webflow
- Make it available to your Webflow site

You'll be prompted to:
- Select your site (Atomicwork Main Website)
- Confirm the registration

## Step 3: Share Library to Webflow

After registration, run:

```bash
webflow extension upload
```

Or follow the prompts from the register command to share the library to your site.

## Step 4: Use in Webflow Designer

1. Open Webflow Designer
2. Go to the **Add panel** (+ icon)
3. Look for **"Components"** or **"Custom Components"** section
4. You should see **"IT Maturity Quiz"**
5. Drag it onto your page!

## Troubleshooting

**Command not found:**
Make sure Webflow CLI is installed:
```bash
npm install -g @webflow/webflow-cli
```

**Authentication error:**
You may need to re-authenticate:
```bash
webflow auth login
```

**Component not showing:**
- Make sure registration completed successfully
- Refresh the Webflow Designer
- Check the Apps/Components panel

## What Gets Registered:

From your `webflow.json`:
- **Component Name**: ITMaturityQuiz
- **Display Name**: IT Maturity Quiz
- **Description**: An interactive questionnaire to determine IT maturity level

## Event Communication

Your Quiz component will dispatch the `showReport` event when complete. Add this to Webflow Page Settings → Custom Code:

```html
<script>
window.addEventListener('showReport', function(event) {
  const data = event.detail;
  console.log('Quiz data:', data);

  // Show your Webflow report block
  const reportBlock = document.querySelector('.report-block');
  if (reportBlock) {
    reportBlock.style.display = 'block';
  }
});
</script>
```

---

## Ready to Register?

Run these commands in your terminal:

```bash
# 1. Build the library
npm run build:lib

# 2. Register with Webflow
webflow extension register

# 3. Use in Webflow Designer!
```

Let me know if you encounter any issues during registration!
