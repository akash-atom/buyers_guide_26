# Table of Contents Feature - Visual Reference Guide

## 🎨 Layout Examples

### Desktop Layout (Before Unlock)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Site Header                         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────┐  ┌───────────────────────────────────────┐
│                   │  │                                       │
│  🔒 Complete      │  │    IT Maturity Assessment Quiz       │
│  quiz to unlock   │  │                                       │
│ ┌───────────────┐ │  │  Question 1 of 4                     │
│ │               │ │  │  ───────────────────                 │
│ │ • Introduction│ │  │                                       │
│ │               │ │  │  How are password resets and basic   │
│ │ • Assessment  │ │  │  'how do I' questions handled today? │
│ │               │ │  │                                       │
│ │ • Reactive IT │ │  │  ○ Agents handle most manually       │
│ │               │ │  │  ○ Some self-service/AI deflection   │
│ │ • Structured  │ │  │  ○ 80%+ resolved automatically       │
│ │               │ │  │                                       │
│ │ • Optimized   │ │  │  [Previous]  [Next]                  │
│ │               │ │  │                                       │
│ │ • Next Steps  │ │  │                                       │
│ │               │ │  │                                       │
│ └───────────────┘ │  │                                       │
│   TOC (locked)    │  │                                       │
│   opacity: 0.5    │  │                                       │
│   grayscale: 50%  │  │                                       │
│   clicks disabled │  │                                       │
└───────────────────┘  └───────────────────────────────────────┘
  Fixed left sidebar     Main content area
  250px wide             Responsive width
```

### Desktop Layout (After Email, Before Report)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Site Header                         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────┐  ┌───────────────────────────────────────┐
│                   │  │                                       │
│ ┌───────────────┐ │  │    ✓ Quiz Complete!                  │
│ │               │ │  │                                       │
│ │ • Introduction│ │  │    You're at Reactive IT             │
│ │               │ │  │                                       │
│ │ • Assessment  │ │  │    Your agents are handling work     │
│ │               │ │  │    that AI and automation could      │
│ │ • Reactive IT │ │  │    deflect. Every ticket deflected   │
│ │               │ │  │    saves 15-30 minutes.              │
│ │ • Structured  │ │  │                                       │
│ │               │ │  │    Ticket Composition:               │
│ │ • Optimized   │ │  │    • Deflectable: 40-50% handled     │
│ │               │ │  │      manually                        │
│ │ • Next Steps  │ │  │    • Automatable: 20-30% requiring  │
│ │               │ │  │      human routing                   │
│ └───────────────┘ │  │    • Expert: 30-40% but agents      │
│   TOC (unlocked)  │  │      rarely get to focus here        │
│   opacity: 1      │  │                                       │
│   Full color      │  │    [Read the report]                 │
│   Clicks enabled  │  │                                       │
│   Hover effects   │  │                                       │
└───────────────────┘  └───────────────────────────────────────┘
  ← Unlocked instantly    Results screen
     after email submit
```

### Desktop Layout (After Clicking "Read the report")

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Site Header                         │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────┐  ┌───────────────────────────────────────┐
│                   │  │                                       │
│ ┌───────────────┐ │  │  IT Maturity Assessment Report       │
│ │               │ │  │  ═════════════════════════════       │
│ │ • Introduction│ │  │                                       │
│ │               │ │  │  1. Introduction                     │
│ │ • Assessment  │ ◀──┼─ Welcome to your personalized IT     │
│ │   (active)    │ │  │  maturity assessment report. This    │
│ │               │ │  │  guide is tailored based on your     │
│ │ • Reactive IT │ │  │  responses...                        │
│ │               │ │  │                                       │
│ │ • Structured  │ │  │  2. Your IT Maturity Assessment      │
│ │               │ │  │  Based on your quiz responses, you   │
│ │ • Optimized   │ │  │  are at the Reactive IT stage...     │
│ │               │ │  │                                       │
│ │ • Next Steps  │ │  │  [Chart showing score: 5/9]          │
│ │               │ │  │                                       │
│ └───────────────┘ │  │  3. Understanding Reactive IT        │
│   Interactive TOC │  │  At this stage, your team handles... │
│   Click to scroll │  │                                       │
│   Auto-highlights │  │  (User can scroll or click TOC)      │
└───────────────────┘  └───────────────────────────────────────┘
```

### Mobile Layout (Stacked)

```
┌─────────────────────────┐
│      Site Header        │
└─────────────────────────┘

┌─────────────────────────┐
│ 🔒 Complete quiz to     │
│    unlock               │
│ ┌─────────────────────┐ │
│ │ • Introduction      │ │
│ │ • Assessment        │ │
│ │ • Reactive IT       │ │
│ │ • Structured        │ │
│ │ • Optimized         │ │
│ │ • Next Steps        │ │
│ └─────────────────────┘ │
│   TOC (full width)      │
└─────────────────────────┘

┌─────────────────────────┐
│                         │
│  Quiz Component         │
│                         │
│  Question 1 of 4        │
│  ─────────────          │
│                         │
│  How are password...    │
│                         │
│  ○ Option 1             │
│  ○ Option 2             │
│  ○ Option 3             │
│                         │
│  [Next]                 │
│                         │
└─────────────────────────┘
```

---

## 🎨 State Changes

### TOC Locked State (Initial)

```css
Visual: Grayed out, muted
Opacity: 0.5
Filter: grayscale(50%)
Cursor: not-allowed
Pointer Events: none
Message: "🔒 Complete quiz to unlock"

Color Scheme:
- Links: #999 (gray)
- Background: rgba(0,0,0,0.05) (light gray)
- Border: none
```

**What user sees:**
```
┌─────────────────────┐
│ 🔒 Complete quiz to │
│    unlock           │
│ ┌─────────────────┐ │
│ │ • Introduction  │ │  ← Gray text
│ │ • Assessment    │ │  ← Can't click
│ │ • Reactive IT   │ │  ← No hover
│ │ • Structured    │ │  ← Disabled
│ │ • Optimized     │ │
│ │ • Next Steps    │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### TOC Unlocked State (After Email)

```css
Visual: Full color, interactive
Opacity: 1
Filter: none
Cursor: pointer
Pointer Events: auto
Transition: 0.3s ease-in-out
```

**What user sees:**
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │ • Introduction  │ │  ← Full color
│ │ • Assessment    │ │  ← Clickable
│ │ • Reactive IT   │ │  ← Hover effect
│ │ • Structured    │ │  ← Interactive
│ │ • Optimized     │ │
│ │ • Next Steps    │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### TOC Active Link (Currently Viewing Section)

```css
Visual: Highlighted, bold
Background: rgba(124, 58, 237, 0.15)
Color: #7C3AED (purple)
Font-weight: 600
Border-left: 3px solid #7C3AED
Padding-left: 13px
```

**What user sees:**
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │ • Introduction  │ │
│ │█• Assessment ◄─ │ │  ← Active (purple)
│ │ • Reactive IT   │ │     Bold text
│ │ • Structured    │ │     Left border
│ │ • Optimized     │ │
│ │ • Next Steps    │ │
│ └─────────────────┘ │
└─────────────────────┘
```

### TOC Hover Effect (Unlocked)

```css
Background: rgba(124, 58, 237, 0.1)
Color: #7C3AED
Transform: translateX(4px)
Transition: 0.2s ease
Cursor: pointer
```

**What user sees:**
```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │ • Introduction  │ │
│ │ → Assessment ← │ │  ← Hover (purple bg)
│ │ • Reactive IT   │ │     Shifts right 4px
│ │ • Structured    │ │     Purple text
│ │ • Optimized     │ │
│ │ • Next Steps    │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 📐 Exact Dimensions

### Desktop (≥769px)

```
TOC Container:
- Position: fixed
- Left: 20px
- Top: 100px
- Width: 250px
- Max-height: calc(100vh - 120px)
- Overflow-y: auto
- Z-index: 100

Report Container:
- Margin-left: 300px (250px TOC + 50px gap)
- Padding: 20px
- Width: calc(100% - 300px)

TOC Links:
- Display: block
- Padding: 10px 12px
- Margin-bottom: 4px
- Border-radius: 8px
- Font-size: 14px
- Line-height: 1.4

Active Link Border:
- Border-left: 3px solid #7C3AED
- Padding-left: 13px (16px - 3px border)

Lock Message:
- Position: absolute
- Top: -30px
- Left: 50%
- Transform: translateX(-50%)
- Padding: 8px 16px
- Font-size: 14px
```

### Tablet (480px - 768px)

```
TOC Container:
- Position: relative
- Left: 0
- Top: 0
- Width: 100%
- Margin-bottom: 20px

Report Container:
- Margin-left: 0
- Padding: 10px
- Width: 100%

TOC Links:
- Font-size: 13px
- Padding: 8px 10px

Lock Message:
- Font-size: 12px
- Padding: 6px 12px
- Top: -25px
```

### Mobile (≤479px)

```
TOC Container:
- Padding: 15px
- Full width

TOC Links:
- Font-size: 12px
- Padding: 8px 10px

Report Sections:
- Padding: 10px
- Font-size: 16px (body text)
```

---

## 🎨 Color Palette

### Primary Colors

```
Brand Purple (Primary):
- Hex: #7C3AED
- RGB: rgb(124, 58, 237)
- Use: Active links, highlights, borders

Light Purple (Hover/Active Backgrounds):
- RGBA: rgba(124, 58, 237, 0.1)  - Hover
- RGBA: rgba(124, 58, 237, 0.15) - Active
- Use: Link backgrounds on interaction

Dark Text:
- Hex: #374151
- Use: Default link text (unlocked)

Gray Text (Locked):
- Hex: #999999
- Use: Locked state links

Lock Message Background:
- RGBA: rgba(0, 0, 0, 0.8)
- Use: Lock message tooltip
```

### State Colors

```
Locked State:
- Text: #999
- Opacity: 0.5
- Filter: grayscale(50%)

Unlocked State:
- Text: #374151
- Hover Text: #7C3AED
- Active Text: #7C3AED

Backgrounds:
- White: #FFFFFF (TOC container)
- Light Gray: #F9FAFB (section backgrounds)
- Hover: rgba(124, 58, 237, 0.1)
- Active: rgba(124, 58, 237, 0.15)
```

---

## 🔄 Animation Timing

```css
/* TOC Unlock Animation */
.toc-unlocked {
  animation: unlock-fade-in 0.4s ease-out;
  transition: all 0.3s ease-in-out;
}

@keyframes unlock-fade-in {
  from { opacity: 0.5; transform: scale(0.98); }
  to   { opacity: 1; transform: scale(1); }
}

/* Link Hover */
.toc-link:hover {
  transition: all 0.2s ease;
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Section Scroll Animation */
targetElement.scrollIntoView({
  behavior: 'smooth',  // Smooth animation
  block: 'start'       // Align to top
});
```

**Timing Breakdown:**
- Unlock animation: 400ms (0.4s)
- State transitions: 300ms (0.3s)
- Hover effects: 200ms (0.2s)
- Scroll animation: Browser default (~500-800ms)

---

## 📱 Responsive Breakpoints

```css
/* Desktop (default) */
@media (min-width: 769px) {
  #table-of-contents {
    position: fixed;
    left: 20px;
    width: 250px;
  }
  #hidden_report {
    margin-left: 300px;
  }
}

/* Tablet */
@media (max-width: 768px) {
  #table-of-contents {
    position: relative;
    width: 100%;
    left: 0;
  }
  #hidden_report {
    margin-left: 0;
  }
  .toc-locked::before {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  #table-of-contents {
    padding: 15px;
  }
  .toc-link {
    font-size: 12px;
  }
}
```

---

## 🎯 Interactive States Diagram

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  TOC LINK STATES                               │
│                                                 │
│  1. LOCKED (default on page load)              │
│     ┌─────────────────────┐                    │
│     │ • Introduction      │  Gray text         │
│     └─────────────────────┘  Can't click       │
│                              No hover           │
│                                                 │
│  2. UNLOCKED (after email)                     │
│     ┌─────────────────────┐                    │
│     │ • Introduction      │  Normal text       │
│     └─────────────────────┘  Clickable         │
│                              Hover enabled      │
│                                                 │
│  3. HOVER (unlocked + mouse over)              │
│     ┌─────────────────────┐                    │
│     │ → Introduction      │  Purple text       │
│     └─────────────────────┘  Light purple bg   │
│                              Shifts right 4px   │
│                                                 │
│  4. ACTIVE (currently viewing this section)    │
│     ┌─────────────────────┐                    │
│     │█• Introduction      │  Bold purple text  │
│     └─────────────────────┘  Purple bg         │
│                              Left border        │
│                                                 │
│  5. ACTIVE + HOVER                             │
│     ┌─────────────────────┐                    │
│     │█→ Introduction      │  Bold purple       │
│     └─────────────────────┘  Darker bg         │
│                              Shifts right       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🖼️ Visual Indicators

### Lock Icon (Before Unlock)

```
Position: Above TOC
Style: Floating tooltip

 🔒 Complete quiz to unlock
 ╔════════════════════════╗
 ║                        ║
 ║  [TOC content below]   ║
 ║                        ║
 ╚════════════════════════╝
```

### Active Indicator (While Reading)

```
Left border shows active section:

 ┌────────────────────┐
 │ • Introduction     │
 │█• Assessment  ◄─── Active (purple border)
 │ • Reactive IT      │
 │ • Structured       │
 └────────────────────┘
```

### Hover Indicator

```
Subtle shift to the right:

Before hover:
│ • Introduction     │

During hover:
│  → Introduction    │  (moved 4px right, purple)
```

### Scroll Indicator

```
Optional: Add a progress bar showing scroll position

 ┌────────────────────┐
 │ • Introduction     │ ─┐
 │ • Assessment       │  │
 │ • Reactive IT      │  ├─ You are here
 │ • Structured       │  │
 │ • Optimized        │  │
 │ • Next Steps       │ ─┘
 └────────────────────┘
     ▓▓▓▓▓▓░░░░░░░░     Progress: 40%
```

---

## 🎬 Animation Flow

### 1. Page Load → TOC Appears Locked

```
Time: 0ms
┌─────────────┐
│ Loading...  │
└─────────────┘
        ↓
Time: 200ms
┌─────────────┐
│ 🔒 Locked   │  ← Fades in
│ • Links     │    Opacity: 0.5
│ • Disabled  │    Grayscale
└─────────────┘
```

### 2. Email Submit → Unlock Animation

```
Time: 0ms (email submitted)
┌─────────────┐
│ 🔒 Locked   │  ← Current state
│ • Links     │
└─────────────┘
        ↓
Time: 0-400ms (transition)
┌─────────────┐
│ 🔓→ 🆓     │  ← Lock fades out
│ • ···→ •   │    Color restores
└─────────────┘    Scale: 0.98 → 1
        ↓
Time: 400ms (complete)
┌─────────────┐
│ Unlocked!   │  ← Full color
│ • Links     │    Clickable
└─────────────┘    Hover enabled
```

### 3. Link Click → Smooth Scroll

```
Time: 0ms (link clicked)
[Section 1 - visible]
[Section 2 - below fold]
        ↓
Time: 0-600ms (scrolling)
[Section 1 - scrolling up]
[Section 2 - coming into view]
        ↓
Time: 600ms (complete)
[Section 2 - visible at top]
[Section 3 - below fold]

TOC Updates:
• Section 1  →  • Section 1
█• Section 2     • Section 2
• Section 3      █• Section 2 (active)
```

---

## 📊 Z-Index Layers

```
Layer 7: Modals/Overlays (if any)        z-index: 1000
Layer 6: Lock message tooltip            z-index: 200
Layer 5: TOC container                   z-index: 100
Layer 4: Header (if fixed)               z-index: 50
Layer 3: Quiz component                  z-index: 10
Layer 2: Report content                  z-index: 1
Layer 1: Background                      z-index: 0
```

Ensures TOC stays above report content but below modals.

---

## 🎨 Custom Styling Options

### Option 1: Minimal Style (Clean)

```css
#table-of-contents {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.toc-link {
  border: none;
  border-radius: 4px;
}
```

### Option 2: Bold Style (High Contrast)

```css
#table-of-contents {
  background: #1F2937;
  color: white;
}

.toc-link {
  color: #E5E7EB;
  border-left: 3px solid transparent;
}

.toc-link.active {
  border-left-color: #7C3AED;
  background: rgba(124, 58, 237, 0.2);
}
```

### Option 3: Gradient Style (Modern)

```css
#table-of-contents {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.toc-link {
  color: rgba(255,255,255,0.8);
}

.toc-link:hover {
  color: white;
  background: rgba(255,255,255,0.1);
}
```

---

This visual reference guide should help you understand exactly how the TOC feature looks and behaves at every stage!
