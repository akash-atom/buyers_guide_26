# Webflow Code Component Integration Guide

Based on Webflow's Code Component documentation, here are the steps to integrate your Quiz component.

## Current Status of Webflow Code Components

As of now, Webflow Code Components are:
- In **limited availability/beta**
- Require a **Workspace plan**
- Are created through the **Webflow Apps platform**

## Option 1: Using Webflow Apps (Recommended)

### Step 1: Create a Webflow App

1. Go to [Webflow Apps](https://webflow.com/apps)
2. Click **"Create App"** or **"Build an App"**
3. Choose **"Code Component"** as the app type
4. Follow the prompts to set up your app

### Step 2: Deploy Your React Component

Your Quiz component needs to be hosted and accessible:

**Deploy to Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

You'll get a URL like: `https://buyers-guide-quiz.vercel.app`

### Step 3: Register the Component

In the Webflow App setup:
- **Component URL**: Your Vercel deployment URL
- **Component Name**: IT Maturity Quiz
- **Description**: Interactive questionnaire to assess IT maturity level
- **Properties**: None (self-contained)

### Step 4: Install in Your Site

1. Go to your Webflow Designer
2. Open the **Apps** panel
3. Find your registered app
4. Install it to your site
5. Drag the component onto your page

## Option 2: Direct Embed (Alternative - Available Now)

Since Code Components are in beta, here's a working alternative:

### Step 1: Deploy Your Quiz

```bash
# Deploy to Vercel
vercel

# Or deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod
```

### Step 2: Embed in Webflow

In Webflow Designer:
1. Add an **Embed** element where you want the quiz
2. Paste this code:

```html
<div id="quiz-container"></div>
<script src="YOUR_DEPLOYED_URL/assets/index-*.js"></script>
<link rel="stylesheet" href="YOUR_DEPLOYED_URL/assets/index-*.css">
```

Or use an iframe:
```html
<iframe
  src="YOUR_DEPLOYED_URL"
  width="100%"
  height="900px"
  frameborder="0"
  style="border: none; overflow: hidden;"
></iframe>
```

### Step 3: Add Event Listener

In Webflow Page Settings → Custom Code → Before </body>:

```html
<script>
window.addEventListener('DOMContentLoaded', function() {
  // Listen for the quiz completion event
  window.addEventListener('showReport', function(event) {
    const data = event.detail;
    console.log('Quiz completed:', data);

    // Show your Webflow report block
    const reportBlock = document.querySelector('.report-block');
    if (reportBlock) {
      reportBlock.style.display = 'block';
      reportBlock.scrollIntoView({ behavior: 'smooth' });
    }

    // Hide quiz container
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
      quizContainer.style.display = 'none';
    }

    // Show specific content based on maturity level
    const level = data.maturityLevel;
    if (level === 'Reactive IT') {
      document.querySelector('.report-reactive')?.style.setProperty('display', 'block');
    } else if (level === 'Structured IT') {
      document.querySelector('.report-structured')?.style.setProperty('display', 'block');
    } else if (level === 'Optimized IT') {
      document.querySelector('.report-optimized')?.style.setProperty('display', 'block');
    }
  });
});
</script>
```

## Quick Deployment Steps

### Deploy to Vercel:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# Follow prompts:
# - Setup: Yes
# - Project name: buyers-guide-quiz
# - Directory: .
# - Build command: npm run build
# - Output directory: dist

# 3. You'll get a URL
```

### Deploy to Netlify:

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Drag the dist folder when prompted
```

## Files Ready for Deployment

Your production build is ready in the `dist/` folder:
- `dist/index.html` - Entry point
- `dist/assets/index-*.css` - Styles (11.75 KB)
- `dist/assets/index-*.js` - Quiz logic (212.35 KB)

## Testing the Integration

1. Deploy your quiz
2. Embed it in Webflow (using iframe or custom code)
3. Add the event listener code
4. Create a `.report-block` element in Webflow (set to display: none)
5. Publish and test
6. Complete the quiz
7. Click "Read the report"
8. Your Webflow report block should appear

## Event Data Available

When the quiz is completed, you receive:

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

Use this data to personalize the report content in Webflow.

## Next Steps

**For immediate use:**
1. Run `vercel` to deploy
2. Use the iframe embed method
3. Add event listener code
4. Create your report blocks in Webflow

**For Code Components (when available):**
1. Wait for Webflow Code Components to be generally available
2. Or request beta access from Webflow
3. Create app through Webflow Apps platform
4. Register your deployed component

## Resources

- [Webflow Apps](https://webflow.com/apps)
- [Webflow Code Components Docs](https://developers.webflow.com/code-components)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Ready to deploy?** Run `vercel` in your terminal to get started!
