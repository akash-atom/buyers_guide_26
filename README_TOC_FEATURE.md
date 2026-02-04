# Table of Contents Unlock Feature - Quick Start Guide

## 🎯 Overview

This feature adds an interactive table of contents (TOC) that:
- Appears on page load but is **locked** (grayed out, links disabled)
- **Unlocks immediately** when user submits email after quiz
- Allows smooth navigation through report sections
- Tracks and highlights the active section as user scrolls
- Works seamlessly with the existing "Read the report" workflow

## 📦 What's Been Done

### ✅ Phase 1: React Component (COMPLETED)

**Modified:** `src/components/Quiz.tsx` (lines 151-159)

Added event dispatch after email submission that fires `unlockTOC` event to Webflow with quiz data:
- User's email
- Maturity level (Reactive/Structured/Optimized IT)
- Quiz score
- Timestamp
- Quiz completion flag

**Testing:** After building and running the app, submitting a valid work email will dispatch this event (visible in browser console).

## 📋 What You Need to Do in Webflow

### Phase 2: Add JavaScript (15 minutes)

1. Open file: `WEBFLOW_TOC_JAVASCRIPT.html`
2. Copy the entire `<script>` tag
3. In Webflow: Page Settings → Custom Code → Before `</body>`
4. Paste the code
5. Save

### Phase 3: Add CSS (10 minutes)

1. Open file: `WEBFLOW_TOC_CSS.html`
2. Copy the entire `<style>` tag
3. In Webflow: Add Embed element OR Page Settings → Custom Code → Head Code
4. Paste the code
5. Save

### Phase 4: Create HTML Structure (30-60 minutes)

**⚠️ CRITICAL: Create report content FIRST!**

1. Open file: `WEBFLOW_HTML_STRUCTURE.html` for reference
2. Create report content with 5-6 sections (see recommended structure below)
3. Build TOC navigation with proper IDs and classes
4. Link TOC items to report sections

## 📄 Files Created

| File | Purpose |
|------|---------|
| `WEBFLOW_TOC_JAVASCRIPT.html` | Copy this JavaScript to Webflow |
| `WEBFLOW_TOC_CSS.html` | Copy this CSS to Webflow |
| `WEBFLOW_HTML_STRUCTURE.html` | HTML structure reference guide |
| `TOC_IMPLEMENTATION_CHECKLIST.md` | Detailed implementation checklist |
| `README_TOC_FEATURE.md` | This quick start guide |

## 🏗️ Recommended Report Structure

Create these sections in your Webflow report (you can customize content):

1. **Introduction/Overview**
   - Brief welcome and context
   - What the report covers

2. **Your IT Maturity Assessment Results**
   - Display their maturity level
   - Show their score visualization
   - Key findings summary

3. **Reactive IT Stage**
   - What defines this stage
   - Common challenges
   - Ticket composition breakdown
   - Technology recommendations
   - Path to improvement

4. **Structured IT Stage**
   - Characteristics of this stage
   - What's different from Reactive
   - Focus areas for improvement
   - Automation opportunities

5. **Optimized IT Stage**
   - The pinnacle of IT maturity
   - Best practices
   - Advanced strategies
   - Maintaining excellence

6. **Next Steps / Action Items**
   - Specific recommendations based on their level
   - Quick wins they can implement
   - Long-term strategic initiatives
   - Call to action (contact, demo, etc.)

## 🔑 Critical IDs and Classes

### TOC Container
```
ID: table-of-contents
Element: Nav or Div
Position: Fixed (left sidebar)
```

### TOC Links
```
Class: toc-link
Href: Must match section IDs (e.g., #section-intro)
```

### Report Container
```
ID: hidden_report
Initial display: none
```

### Report Sections
```
IDs: section-intro, section-assessment, section-reactive, etc.
Must match TOC href values (without the #)
```

## 🧪 Quick Test

After implementing:

1. Load page → TOC should be visible but grayed out
2. Complete quiz → Submit email
3. TOC should unlock (full color, clickable)
4. Click TOC link → Should smooth scroll to that section
5. Click "Read the report" → Report should appear
6. Scroll through report → Active TOC link should highlight

## 🎨 Visual Flow

```
Page Load
    ↓
[ Locked TOC (grayed) ]  [ Quiz Component ]
    ↓
User completes quiz
    ↓
[ Locked TOC ]  [ Email Form ]
    ↓
User submits email → unlockTOC event fires
    ↓
[ Unlocked TOC (active) ]  [ Quiz Results ]
    ↓
User clicks "Read the report" → showReport event fires
    ↓
[ Active TOC ]  [ Full Report Visible ]
    ↓
User clicks TOC link
    ↓
[ Smooth scroll to section ] [ Section highlighted ]
```

## 🚨 Important Notes

1. **Report content must exist BEFORE implementing TOC**
   - TOC links need valid sections to scroll to
   - Section IDs must exactly match TOC hrefs

2. **Event flow is separate**
   - `unlockTOC` event → Makes TOC clickable
   - `showReport` event → Shows report content
   - This allows users to unlock navigation before viewing report

3. **IDs must match exactly**
   - Case-sensitive
   - No spaces
   - Format: `section-name` (lowercase with hyphens)

4. **Mobile responsive**
   - CSS includes mobile breakpoints
   - TOC repositions to top on mobile
   - Report margins adjust automatically

## 📞 Need Help?

1. Check `TOC_IMPLEMENTATION_CHECKLIST.md` for detailed steps
2. Review `WEBFLOW_HTML_STRUCTURE.html` for structure examples
3. Look at browser console for error messages
4. Verify all IDs and classes match exactly

## ✅ Success Checklist

- [ ] React component change deployed (Quiz.tsx modified)
- [ ] Webflow JavaScript added (Before `</body>`)
- [ ] Webflow CSS added (Embed or Head Code)
- [ ] Report content created with proper sections
- [ ] TOC navigation built with correct IDs/classes
- [ ] Report container has id="hidden_report"
- [ ] All TOC hrefs match section IDs
- [ ] Tested: TOC locks on page load
- [ ] Tested: TOC unlocks after email submission
- [ ] Tested: TOC links scroll to sections
- [ ] Tested: "Read the report" shows report
- [ ] Tested: Mobile responsive layout works
- [ ] No console errors in browser

## 🎉 You're Done!

Once all phases are complete, users will experience a seamless flow:
1. See locked TOC → creates curiosity
2. Complete quiz → immediate reward (unlocked navigation)
3. Click "Read the report" → access full content
4. Use TOC to navigate → enhanced reading experience

The feature adds value without blocking access, creating a better user experience while capturing leads.

---

**Implementation Time Estimate:**
- React (✅ Done): 5 minutes
- Webflow JS: 15 minutes
- Webflow CSS: 10 minutes
- Webflow HTML: 30-60 minutes (depending on content creation)
- Testing: 20 minutes

**Total: ~1.5-2 hours** (including content creation)
