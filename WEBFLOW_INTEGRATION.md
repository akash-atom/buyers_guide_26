# Webflow Integration Guide

This guide shows you how to integrate the Quiz component with your Webflow project using Code Components.

## How It Works

When the user clicks "Read the report" button, the React component dispatches a custom event called `showReport` with all the quiz data.

## Event Data Structure

The event includes the following data:

```javascript
{
  maturityLevel: "Reactive IT" | "Structured IT" | "Optimized IT",
  score: 3-9, // Total score from questions 1-3
  email: "user@company.com",
  answers: {
    0: "option_1", // Question 1 answer
    1: "option_2", // Question 2 answer
    2: "option_3", // Question 3 answer
    3: "option_1"  // Question 4 answer
  },
  selectedGoal: "option_1" | "option_2" | "option_3" | "option_4", // Question 4 answer
  timestamp: "2026-01-30T12:00:00.000Z"
}
```

## Webflow Setup

### Step 1: Add the Quiz Component
1. In Webflow Designer, add the Quiz Code Component to your page
2. Place it where you want the quiz to appear

### Step 2: Add Your Report Text Block
1. Create a text block or div with your report content
2. Give it a class name or ID, e.g., `report-block`
3. Set its initial display to `display: none` in Webflow

### Step 3: Add Custom Code to Listen for the Event

In Webflow, add this JavaScript code to your page (Page Settings → Custom Code → Before </body> tag):

```html
<script>
  // Wait for the page to load
  window.addEventListener('DOMContentLoaded', function() {

    // Listen for the showReport event from the React quiz
    window.addEventListener('showReport', function(event) {

      // Get the data from the event
      const data = event.detail;
      console.log('Report data received:', data);

      // Show the report block
      const reportBlock = document.querySelector('.report-block');
      if (reportBlock) {
        reportBlock.style.display = 'block';

        // Scroll to the report
        reportBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Optional: Customize content based on maturity level
      const reportTitle = document.querySelector('.report-title');
      if (reportTitle) {
        reportTitle.textContent = 'Your IT Maturity: ' + data.maturityLevel;
      }

      // Optional: Hide the quiz after showing report
      const quizComponent = document.querySelector('.quiz-container');
      if (quizComponent) {
        quizComponent.style.display = 'none';
      }

    });

  });
</script>
```

## Example: Show Different Content Based on Maturity Level

```html
<script>
  window.addEventListener('showReport', function(event) {
    const data = event.detail;

    // Hide all report blocks first
    document.querySelectorAll('[class*="report-"]').forEach(el => {
      el.style.display = 'none';
    });

    // Show the appropriate report block
    if (data.maturityLevel === 'Reactive IT') {
      document.querySelector('.report-reactive').style.display = 'block';
    } else if (data.maturityLevel === 'Structured IT') {
      document.querySelector('.report-structured').style.display = 'block';
    } else if (data.maturityLevel === 'Optimized IT') {
      document.querySelector('.report-optimized').style.display = 'block';
    }
  });
</script>
```

## Example: Personalize Based on Selected Goal (Question 4)

```html
<script>
  window.addEventListener('showReport', function(event) {
    const data = event.detail;

    // Map option values to readable goals
    const goalMap = {
      'option_1': 'Reduce ticket volume and agent workload',
      'option_2': 'Improve employee experience',
      'option_3': 'Scale service management without adding headcount',
      'option_4': 'Modernize our tech stack / demonstrate ROI'
    };

    const userGoal = goalMap[data.selectedGoal];

    // Update text element with personalized message
    const goalText = document.querySelector('.user-goal');
    if (goalText) {
      goalText.textContent = 'Your primary goal: ' + userGoal;
    }
  });
</script>
```

## Example: Send Data to Your Backend

```html
<script>
  window.addEventListener('showReport', function(event) {
    const data = event.detail;

    // Send to your API
    fetch('https://your-api.com/quiz-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Data saved:', result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
</script>
```

## Testing

1. Complete the quiz in Webflow preview/published site
2. Open browser console (F12)
3. You should see: `Report event dispatched: { maturityLevel: "...", score: ..., selectedGoal: "..." }`
4. Your report block should appear

## Troubleshooting

**Report doesn't show:**
- Check browser console for the dispatched event
- Verify your selector (`.report-block`) matches your Webflow element
- Make sure the custom code is in the correct place

**Can't access data:**
- Check `event.detail` contains the data
- Log it with `console.log(event.detail)` to inspect

**Event not firing:**
- Make sure the React component is loaded
- Check for JavaScript errors in console
