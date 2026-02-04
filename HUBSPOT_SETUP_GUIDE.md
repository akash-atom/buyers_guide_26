# HubSpot Integration Setup Guide

## Overview

The quiz now sends all form data to HubSpot automatically when users submit their email. This captures leads and their quiz responses for follow-up.

---

## 📊 Data Being Sent to HubSpot

When a user submits their email, HubSpot receives:

| Field | Description | Example |
|-------|-------------|---------|
| **email** | User's work email | `john@acme.com` |
| **quiz_score** | Total score (3-9) | `5` |
| **it_maturity_level** | Result category | `Reactive IT` |
| **quiz_question_1** | Answer to Q1 | `Agents handle most of them manually` |
| **quiz_question_2** | Answer to Q2 | `Agent manually provisions each system...` |
| **quiz_question_3** | Answer to Q3 | `Less than 30% — we're constantly firefighting...` |
| **primary_goal** | Answer to Q4 | `Reduce ticket volume and agent workload` |

---

## 🔧 Setup Steps

### Step 1: Create Custom Properties in HubSpot

1. Go to **Settings** → **Properties**
2. Select **Contact properties**
3. Create these custom properties:

#### Property 1: Quiz Score
- **Label**: Quiz Score
- **Internal name**: `quiz_score`
- **Field type**: Number
- **Group**: Contact Information

#### Property 2: IT Maturity Level
- **Label**: IT Maturity Level
- **Internal name**: `it_maturity_level`
- **Field type**: Single-line text
- **Group**: Contact Information

#### Property 3: Quiz Question 1
- **Label**: Quiz Question 1
- **Internal name**: `quiz_question_1`
- **Field type**: Single-line text
- **Group**: Contact Information

#### Property 4: Quiz Question 2
- **Label**: Quiz Question 2
- **Internal name**: `quiz_question_2`
- **Field type**: Single-line text
- **Group**: Contact Information

#### Property 5: Quiz Question 3
- **Label**: Quiz Question 3
- **Internal name**: `quiz_question_3`
- **Field type**: Single-line text
- **Group**: Contact Information

#### Property 6: Primary Goal
- **Label**: Primary Goal
- **Internal name**: `primary_goal`
- **Field type**: Single-line text
- **Group**: Contact Information

---

### Step 2: Create a Form in HubSpot

1. Go to **Marketing** → **Forms**
2. Click **Create form**
3. Select **Embedded form**
4. Name it: "IT Maturity Quiz - Lead Capture"
5. Add these fields:
   - Email (default - required)
   - Quiz Score (custom field)
   - IT Maturity Level (custom field)
   - Quiz Question 1 (custom field)
   - Quiz Question 2 (custom field)
   - Quiz Question 3 (custom field)
   - Primary Goal (custom field)

6. **Form Options:**
   - Set form submission to "Thank you message" or redirect
   - Enable GDPR options if needed
   - Configure notification emails

7. **Get Form Details:**
   - After creating, click on the form
   - Go to **Share** or **Options**
   - Note your **Form GUID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

---

### Step 3: Get Your Portal ID

1. In HubSpot, click your account name (top right)
2. Go to **Account & Billing**
3. Find **Hub ID** or **Portal ID** (8-digit number)
4. Copy it

---

### Step 4: Update React Component Configuration

Open both files:
- `src/components/Quiz.tsx`
- `src/components/ITMaturityQuiz.webflow.tsx`

Find this section (around line 67-71):

```typescript
// HubSpot configuration - REPLACE WITH YOUR VALUES
const HUBSPOT_CONFIG = {
  portalId: 'YOUR_PORTAL_ID', // Replace with your HubSpot Portal ID
  formId: 'YOUR_FORM_ID',     // Replace with your HubSpot Form ID
};
```

Replace with your actual values:

```typescript
const HUBSPOT_CONFIG = {
  portalId: '12345678',                              // Your 8-digit Portal ID
  formId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  // Your Form GUID
};
```

---

### Step 5: Build and Deploy

```bash
# Build the updated component
npm run build:lib

# Publish to Webflow
echo "Y" | npx webflow library share

# Then in Webflow Designer:
# 1. Sync the updated component
# 2. Publish your site
```

---

## 🧪 Testing

### Test the Integration:

1. Open your published site
2. Open browser console (F12)
3. Complete the quiz
4. Submit a test email
5. Look for console logs:

**Success:**
```
✅ Data submitted to HubSpot successfully
```

**Failure:**
```
⚠️ HubSpot submission failed: [error message]
```

### Verify in HubSpot:

1. Go to **Contacts** → **Contacts**
2. Search for your test email
3. Open the contact record
4. Check if custom properties are populated:
   - Quiz Score
   - IT Maturity Level
   - Quiz Question 1, 2, 3
   - Primary Goal

---

## 🔍 Troubleshooting

### Error: "Failed to submit to HubSpot"

**Possible causes:**
1. **Wrong Portal ID or Form ID**
   - Double-check both values
   - Portal ID should be 8 digits
   - Form ID should be GUID format

2. **Form not published**
   - Go to form settings
   - Make sure form is published/active

3. **CORS issues**
   - HubSpot Forms API allows CORS by default
   - Check browser console for CORS errors

4. **Property names don't match**
   - Verify internal property names in HubSpot exactly match:
     - `quiz_score`
     - `it_maturity_level`
     - `quiz_question_1`
     - etc.

### Error: "Property X does not exist"

**Solution:**
- Create the missing custom property in HubSpot
- Use exact internal names from Step 1

### Submission works but data not showing

**Check:**
1. Form field mappings in HubSpot
2. Property permissions (make sure properties are editable via API)
3. Contact record - properties might be in a different section

---

## 📊 Analytics & Reporting

### Create a Report in HubSpot:

1. Go to **Reports** → **Analytics Tools** → **Create custom report**
2. Select **Contact-based** report
3. Add these fields:
   - Email
   - IT Maturity Level
   - Quiz Score
   - Primary Goal
   - Create Date

### Sample Reports:

**Maturity Level Distribution:**
```
Chart: Donut chart
X-axis: IT Maturity Level
Value: Count of contacts
```

**Average Score by Goal:**
```
Chart: Bar chart
X-axis: Primary Goal
Y-axis: Average of Quiz Score
```

**Lead Volume Over Time:**
```
Chart: Line chart
X-axis: Create Date (by day/week)
Y-axis: Count of contacts
Filter: Has Quiz Score
```

---

## 🔐 Security Considerations

### What's Safe:
- ✅ HubSpot Forms API is designed for public form submissions
- ✅ No authentication needed (form submissions are intentionally public)
- ✅ Portal ID and Form ID are not sensitive (visible in embed code)
- ✅ HTTPS encrypted

### Best Practices:
- Don't expose any HubSpot API keys in frontend code
- Use Forms API (not Contacts API) for public submissions
- Enable reCAPTCHA in HubSpot form settings if spam is an issue
- Monitor submission volume for abuse

---

## 🎯 Workflow Automation Ideas

### Auto-assign based on Maturity Level:

**Workflow 1: Reactive IT Leads**
- Trigger: Contact created with Maturity Level = "Reactive IT"
- Actions:
  - Assign to sales rep focused on early-stage companies
  - Send email series about AI deflection basics
  - Add to "Reactive IT" list

**Workflow 2: Optimized IT Leads**
- Trigger: Contact created with Maturity Level = "Optimized IT"
- Actions:
  - Assign to enterprise sales rep
  - Send advanced optimization resources
  - Schedule discovery call

**Workflow 3: Goal-based Nurture**
- Trigger: Contact created with Primary Goal = "Reduce ticket volume"
- Actions:
  - Send ROI calculator
  - Share case studies about ticket reduction
  - Invite to webinar about automation

---

## 📝 Custom Property Recommendations

### Additional Properties to Consider:

#### Lead Score
- Use quiz score as part of lead scoring formula
- Higher scores (7-9) might indicate more mature buyers

#### Lifecycle Stage
- Automatically set to "Lead" or "Marketing Qualified Lead"
- Based on quiz completion + email domain

#### Lead Source
- Set to "IT Maturity Quiz"
- Helps track which leads came from this form

---

## 🔄 Updating Field Mappings

If you want to change which data is sent to HubSpot:

**File:** `src/utils/hubspot.ts`

**Modify the fields array:**

```typescript
fields: [
  {
    objectTypeId: '0-1',
    name: 'email',
    value: data.email,
  },
  {
    objectTypeId: '0-1',
    name: 'quiz_score', // Change this to match your property
    value: data.score.toString(),
  },
  // Add more fields here...
]
```

---

## 📈 Success Metrics

### Track these KPIs:

| Metric | Description | Goal |
|--------|-------------|------|
| **Submission Rate** | Quiz completions → email submissions | >70% |
| **Data Quality** | % of submissions with all fields | 100% |
| **API Success Rate** | Successful HubSpot submissions | >95% |
| **Lead Response Time** | Time to first contact after submission | <24 hours |

---

## 🐛 Debug Mode

### Enable detailed logging:

In browser console:
```javascript
// See all HubSpot submissions
localStorage.setItem('DEBUG_HUBSPOT', 'true');

// Disable debug mode
localStorage.removeItem('DEBUG_HUBSPOT');
```

Then check console for detailed submission data.

---

## 🔗 Useful Links

- [HubSpot Forms API Documentation](https://legacydocs.hubspot.com/docs/methods/forms/submit_form)
- [Create Custom Properties](https://knowledge.hubspot.com/properties/create-and-edit-properties)
- [HubSpot Workflows](https://knowledge.hubspot.com/workflows/create-workflows)
- [Form Submission Troubleshooting](https://knowledge.hubspot.com/forms/troubleshoot-hubspot-forms)

---

## ✅ Checklist

Before going live:

- [ ] Created all custom properties in HubSpot
- [ ] Created form in HubSpot
- [ ] Got Portal ID and Form ID
- [ ] Updated `HUBSPOT_CONFIG` in both component files
- [ ] Built and published component to Webflow
- [ ] Tested with real email submission
- [ ] Verified data appears in HubSpot contact record
- [ ] Set up follow-up workflows
- [ ] Configured notification emails
- [ ] Enabled reCAPTCHA (if needed)

---

## 🎉 You're Done!

Once configured, every quiz submission will automatically create or update a contact in HubSpot with all quiz data. This enables:

- ✅ Lead capture and nurturing
- ✅ Segmentation by maturity level
- ✅ Goal-based follow-up
- ✅ ROI tracking
- ✅ Sales enablement

**Questions?** Check the troubleshooting section or HubSpot's documentation links above.
