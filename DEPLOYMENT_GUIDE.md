# Deployment & Webflow Integration Guide

Your Quiz component is now built and ready to deploy!

## Build Output

Your production files are in the `dist/` folder:
- `dist/index.html` - Entry HTML
- `dist/assets/index-*.css` - Compiled CSS (11.75 KB)
- `dist/assets/index-*.js` - Compiled JavaScript (212.35 KB)

## Step 1: Deploy Your React App

Choose one of these deployment options:

### Option A: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project? **No**
   - Project name? **buyers-guide-quiz** (or your choice)
   - Which directory? **.**
   - Build command? **npm run build**
   - Output directory? **dist**

4. You'll get a URL like: `https://buyers-guide-quiz-xxx.vercel.app`

### Option B: Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Drag the `dist` folder when prompted

4. You'll get a URL like: `https://buyers-guide-quiz.netlify.app`

### Option C: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Step 2: Integrate with Webflow

Once deployed, you have two integration options:

### Option A: Embed as iframe (Simpler)

1. In Webflow Designer, add an **Embed** element
2. Paste this code:
   ```html
   <iframe
     src="https://your-deployed-url.vercel.app"
     width="100%"
     height="800px"
     frameborder="0"
     style="border: none; overflow: hidden;"
   ></iframe>
   ```

3. Add event listener in Webflow Page Settings → Custom Code:
   ```html
   <script>
   window.addEventListener('message', function(event) {
     // Check origin for security
     if (event.origin !== 'https://your-deployed-url.vercel.app') return;

     const data = event.data;
     if (data.type === 'showReport') {
       console.log('Report data:', data.detail);
       // Show your Webflow text block
       document.querySelector('.report-block').style.display = 'block';
     }
   });
   </script>
   ```

4. Update Quiz.tsx to use postMessage instead:
   ```javascript
   // Replace the window.dispatchEvent with:
   window.parent.postMessage({
     type: 'showReport',
     detail: {
       maturityLevel: maturityLevel,
       score: totalScore,
       email: email,
       answers: answers,
       selectedGoal: answers[3],
       timestamp: new Date().toISOString()
     }
   }, '*');
   ```

### Option B: Webflow Code Component (Advanced)

**Note:** Webflow Code Components are currently in beta and require:
- A Webflow Workspace plan
- Access to the Code Components beta

1. In Webflow Designer, go to **Apps**
2. Click **Build App** or **Code Component**
3. Follow Webflow's setup to create a new component
4. Point it to your deployed React app
5. Configure the component settings

**For detailed Code Component setup, refer to:**
https://developers.webflow.com/code-components/introduction/quick-start

## Step 3: Add Event Listener in Webflow

Regardless of which integration method you choose, add this to Webflow's Custom Code (Page Settings → Before </body> tag):

```html
<script>
  window.addEventListener('DOMContentLoaded', function() {

    // Listen for the showReport event
    window.addEventListener('showReport', function(event) {
      const data = event.detail;
      console.log('Report data:', data);

      // Show the report block (replace '.report-block' with your actual selector)
      const reportBlock = document.querySelector('.report-block');
      if (reportBlock) {
        reportBlock.style.display = 'block';
        reportBlock.scrollIntoView({ behavior: 'smooth' });
      }

      // Optional: Hide the quiz
      const quizContainer = document.querySelector('.quiz-iframe-container');
      if (quizContainer) {
        quizContainer.style.display = 'none';
      }

      // Optional: Update content based on maturity level
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

## Step 4: Create Report Blocks in Webflow

1. Create a text block or section with class `report-block`
2. Set initial display to `display: none` in Webflow
3. Design your report content
4. (Optional) Create separate blocks for each maturity level:
   - `.report-reactive`
   - `.report-structured`
   - `.report-optimized`

## Testing

1. Publish your Webflow site
2. Complete the quiz
3. Click "Read the report"
4. Check browser console for the event
5. Verify your report block appears

## Troubleshooting

**Quiz doesn't load:**
- Check the iframe src URL is correct
- Check for CORS errors in console
- Verify the deployed app is accessible

**Event not firing:**
- Open browser console (F12)
- Look for the dispatched event log
- Check if custom code is in the right place

**Report doesn't show:**
- Verify the selector matches your Webflow element
- Check the element's initial display is set to none
- Console.log the element to verify it exists

## Need Help?

Refer to:
- WEBFLOW_INTEGRATION.md for event structure
- Webflow Code Components docs: https://developers.webflow.com/code-components
- This project's README.md
