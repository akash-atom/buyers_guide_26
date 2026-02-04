# Table of Contents Unlock Feature - Implementation Checklist

## 📋 Implementation Overview

This feature adds a visible but locked table of contents that unlocks immediately after the user completes the quiz and submits their email. The report content shows when they click "Read the report."

---

## ✅ Phase 1: React Component Changes (COMPLETED)

- [x] Modified `src/components/Quiz.tsx` line 149
- [x] Added `unlockTOC` event dispatch after `setEmailSubmitted(true)`
- [x] Event includes: email, maturityLevel, score, timestamp, quizCompleted

**Verification:**
```javascript
// After email submission, check browser console for:
// CustomEvent dispatch with detail object containing quiz data
```

---

## 📝 Phase 2: Webflow JavaScript Implementation (TODO)

**File to use:** `WEBFLOW_TOC_JAVASCRIPT.html`

### Steps:
1. [ ] Open your Webflow project
2. [ ] Go to Pages → Select your page → Page Settings
3. [ ] Navigate to Custom Code → "Before </body>" section
4. [ ] Copy entire contents from `WEBFLOW_TOC_JAVASCRIPT.html`
5. [ ] Paste into the Before </body> section
6. [ ] Save settings

### What this code does:
- Locks TOC on page load (opacity 0.5, links disabled)
- Listens for `unlockTOC` event from React quiz
- Unlocks TOC (full opacity, enables links)
- Adds smooth scroll behavior to TOC links
- Highlights active section as user scrolls
- Maintains existing `showReport` event functionality

---

## 🎨 Phase 3: Webflow CSS Styling (TODO)

**File to use:** `WEBFLOW_TOC_CSS.html`

### Steps:
1. [ ] In Webflow Designer, add an Embed element to your page
   - OR use Page Settings → Custom Code → Head Code
2. [ ] Copy entire contents from `WEBFLOW_TOC_CSS.html`
3. [ ] Paste into the Embed element or Head Code section
4. [ ] Save and preview

### What this CSS provides:
- Locked state styling (grayed out, lock message)
- Unlocked state styling (hover effects, active highlighting)
- Fixed left sidebar layout (250px wide)
- Smooth scrolling
- Mobile responsive breakpoints
- Report container layout with proper margins

---

## 🏗️ Phase 4: Webflow HTML Structure (TODO - CRITICAL)

**File to reference:** `WEBFLOW_HTML_STRUCTURE.html`

### ⚠️ IMPORTANT: You must create report content FIRST!

Recommended report sections based on quiz maturity levels:
1. Introduction/Overview
2. Your IT Maturity Assessment Results
3. Reactive IT Stage (characteristics, challenges, solutions)
4. Structured IT Stage (progression path, recommendations)
5. Optimized IT Stage (best practices, advanced strategies)
6. Next Steps / Action Items

### Required Elements:

#### 1. Table of Contents Container
```
Element: Nav or Div
ID: table-of-contents
Position: Fixed
Left: 20px
Top: 100px (adjust for your header)
Width: 250px
Styling: Add background, padding, border-radius, shadow
```

#### 2. TOC Links
```
Element: Link (a tag)
Class: toc-link
Href: Must match section IDs (e.g., #section-intro)

Example structure in Webflow:
- Create Nav element with id="table-of-contents"
- Inside, add Link elements with class="toc-link"
- Set each link's href to corresponding section ID
```

#### 3. Report Container
```
Element: Div
ID: hidden_report
Display: None (or height: 0px with overflow: hidden)
Margin-left: 300px (to accommodate fixed TOC)
Padding: 20px
```

#### 4. Report Sections
```
Element: Section or Div
ID: Must match TOC hrefs without the # (e.g., "section-intro")
Padding-top: 20px (for scroll offset)
Margin-bottom: 40px (spacing between sections)

Required section IDs:
- section-intro
- section-assessment
- section-reactive
- section-structured
- section-optimized
- section-next-steps
```

---

## 🧪 Phase 5: Testing & Verification (TODO)

### Functional Tests:

#### Initial State
- [ ] Load page → TOC visible but grayed out
- [ ] Lock message displays: "🔒 Complete quiz to unlock"
- [ ] Try clicking TOC links → nothing happens (disabled)
- [ ] Report container is hidden

#### Quiz Completion
- [ ] Complete all 4 quiz questions
- [ ] Enter valid work email
- [ ] Submit email → TOC unlocks immediately
- [ ] TOC becomes full opacity (colors restored)
- [ ] Lock message disappears
- [ ] TOC links become clickable

#### Navigation
- [ ] Click first TOC link → smooth scrolls to that section
- [ ] Click each TOC link → verifies all links work
- [ ] Verify active link highlights (colored, bold, left border)
- [ ] Scroll through report → active link updates automatically

#### Report Display
- [ ] Click "Read the report" button → report shows
- [ ] Auto-scroll to report happens
- [ ] TOC still works after report shows
- [ ] Can navigate between sections multiple times

#### Edge Cases
- [ ] Refresh page after quiz → state resets correctly
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test with JavaScript disabled → basic links still work
- [ ] Test with slow network connection
- [ ] Verify no console errors

### Mobile Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] TOC repositions properly (top instead of fixed left)
- [ ] All interactions work on touch devices
- [ ] Lock message displays correctly on small screens
- [ ] Report margin adjusts (no left margin on mobile)

### Console Verification
Open browser console and verify these logs:

**On page load:**
```
"TOC initialized in locked state"
```

**After email submission:**
```
"TOC unlocked: {email: "...", maturityLevel: "...", score: X, ...}"
"TOC links enabled with smooth scrolling"
```

**After clicking "Read the report":**
```
"Show report event received: {maturityLevel: "...", score: X, ...}"
"Report event dispatched: {maturityLevel: "...", score: X, ...}"
```

**On TOC link click:**
```
No errors should appear
Smooth scroll should initiate
```

---

## 🔧 Troubleshooting Guide

### TOC doesn't unlock after email submission

**Possible causes:**
- React component not dispatching event (check console)
- Webflow JavaScript not listening (verify script is in Before </body>)
- TOC container ID mismatch (must be exactly "table-of-contents")

**Debug steps:**
1. Open browser console
2. Submit email in quiz
3. Look for "TOC unlocked: ..." message
4. If missing, event isn't dispatching from React
5. If present, check for TOC container errors

### TOC links don't scroll to sections

**Possible causes:**
- Section IDs don't match TOC hrefs
- Report container is still hidden
- Sections don't have IDs at all

**Debug steps:**
1. Inspect TOC link href (e.g., "#section-intro")
2. Search page for element with id="section-intro"
3. Verify section exists and ID matches exactly (case-sensitive)
4. Check if report container display is set to "block"

### TOC is invisible on page load

**Possible causes:**
- CSS not loaded properly
- TOC container display set to "none" in Webflow
- Z-index issue hiding TOC behind other elements

**Debug steps:**
1. Inspect TOC element in browser dev tools
2. Check computed styles for display, opacity, position
3. Verify CSS embed is on the page
4. Check z-index (should be 100)

### Lock message doesn't appear

**Possible causes:**
- CSS not loaded
- TOC doesn't have "toc-locked" class initially

**Debug steps:**
1. Check browser console for CSS syntax errors
2. Inspect TOC element for "toc-locked" class
3. Verify ::before pseudo-element is rendering

### Active section highlighting doesn't work

**Possible causes:**
- Sections don't have proper IDs
- Scroll event listener not attached
- Section positions not calculating correctly

**Debug steps:**
1. Verify all sections have IDs matching TOC hrefs
2. Check console for JavaScript errors
3. Test with manual clicks (should work even if auto-highlighting fails)

---

## 📊 Analytics Events (Optional)

If you have Google Analytics configured, these events will automatically fire:

### Event: `toc_unlocked`
**Triggers:** When user submits email and TOC unlocks
**Parameters:**
- maturity_level: "Reactive IT" | "Structured IT" | "Optimized IT"
- score: Number (3-9)

### Custom Events You Can Add:

#### Event: `toc_click`
Track which sections users navigate to:
```javascript
gtag('event', 'toc_click', {
  'section_id': targetId,
  'time_since_unlock': timeInSeconds
});
```

#### Event: `section_viewed`
Track how long users spend in each section:
```javascript
gtag('event', 'section_viewed', {
  'section_id': sectionId,
  'time_spent': timeInSeconds
});
```

---

## 🚀 Deployment Checklist

Before publishing to production:

- [ ] All 4 phases completed (React, JS, CSS, HTML)
- [ ] All functional tests passing
- [ ] Mobile responsive testing complete
- [ ] No console errors in any browser
- [ ] Analytics events firing correctly (if configured)
- [ ] Report content is finalized and proofread
- [ ] TOC links match all section IDs exactly
- [ ] Lock/unlock transitions are smooth
- [ ] "Read the report" button works
- [ ] Page performance is acceptable (no lag)

---

## 🔄 Rollback Plan

If issues arise after deployment:

### Immediate Rollback (5 minutes):
1. Remove Webflow custom JavaScript (Page Settings → Custom Code)
2. Remove Webflow custom CSS (delete Embed element or Head Code)
3. Publish site
4. Quiz will still work, but TOC feature will be disabled

### React Rollback (if needed):
1. Remove the unlockTOC event dispatch from Quiz.tsx (lines 151-159)
2. Rebuild React app
3. Deploy updated build

### Partial Rollback:
- Keep React changes, remove only Webflow code
- Quiz submission will dispatch event but nothing will happen
- No errors will occur, feature is simply non-functional

---

## 📚 Files Reference

| File | Purpose | Location |
|------|---------|----------|
| `Quiz.tsx` | React component with event dispatch | `src/components/Quiz.tsx` |
| `WEBFLOW_TOC_JAVASCRIPT.html` | JavaScript to copy to Webflow | Root directory |
| `WEBFLOW_TOC_CSS.html` | CSS styles to copy to Webflow | Root directory |
| `WEBFLOW_HTML_STRUCTURE.html` | HTML structure reference guide | Root directory |
| `TOC_IMPLEMENTATION_CHECKLIST.md` | This checklist | Root directory |

---

## 🎯 Success Criteria

The feature is successfully implemented when:

1. ✅ TOC is visible but locked on page load
2. ✅ User completes quiz → submits email → TOC unlocks instantly
3. ✅ User can click TOC links and smooth scroll to sections
4. ✅ Active section highlights as user scrolls through report
5. ✅ "Read the report" button shows hidden report
6. ✅ All features work on desktop and mobile
7. ✅ No console errors in any browser
8. ✅ User experience is smooth and intuitive

---

## 💡 Future Enhancements

Consider adding these features in future iterations:

- [ ] Backend email storage (replace client-side validation)
- [ ] PDF download of personalized report
- [ ] Email specific sections to user
- [ ] Progress indicator showing % of report read
- [ ] Highlight recommended sections based on maturity level
- [ ] "Scroll to top" button
- [ ] Section completion checkmarks
- [ ] Time tracking per section
- [ ] Print-friendly report styling
- [ ] Social sharing buttons for sections

---

## 📞 Support

If you encounter issues:

1. Check console for error messages
2. Review troubleshooting section above
3. Verify all IDs and classes match exactly
4. Test in incognito/private mode (rules out browser extensions)
5. Clear cache and hard reload (Cmd+Shift+R / Ctrl+Shift+R)

---

**Last Updated:** Implementation completed for React component (Phase 1)
**Status:** Ready for Webflow implementation (Phases 2-4)
