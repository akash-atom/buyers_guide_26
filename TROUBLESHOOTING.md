# Troubleshooting: Component Not Showing in Webflow

## Steps to Fix:

### 1. Re-run the Share Command with Verbose Output

Run this in your terminal:

```bash
npx webflow library share --verbose
```

This will show detailed output about what's happening.

### 2. Check for These Common Issues:

**A. Did the command complete successfully?**
- Look for "Successfully shared" or similar message
- If it failed, check the error message

**B. Are you looking in the right place in Webflow?**
- Open Webflow Designer
- Click the **Add (+)** panel on the left
- Look under **"Components"** or **"Custom"** section
- Search for "IT Maturity Quiz"

**C. Try refreshing Webflow Designer**
- Close and reopen the Webflow Designer
- Or hard refresh: Cmd/Ctrl + Shift + R

### 3. Verify the Library is Registered

Run:
```bash
npx webflow library share --no-input --verbose
```

Check the output for any errors.

### 4. Check Your Webflow Workspace

- Make sure you have a **Workspace plan** (Code Components require this)
- Verify you're logged into the correct Webflow account
- Confirm you selected the right site during `library share`

### 5. Bundle the Library First

Try bundling first to catch any errors:

```bash
npx webflow library bundle --verbose
```

This will validate your configuration without uploading.

### 6. Check the Component Export

Verify the component is exported correctly:

```bash
cat dist/index.es.js | grep ITMaturityQuiz
```

You should see the component export.

### 7. Try with Debug Flags

```bash
npx webflow library share --verbose --debug-bundler
```

This shows the bundler configuration and any issues.

## Common Solutions:

### Solution 1: Re-authenticate

```bash
npx webflow auth logout
npx webflow auth login
npx webflow library share
```

### Solution 2: Check Workspace Access

Code Components require a **Workspace plan**. Verify:
1. Go to webflow.com
2. Check your account settings
3. Confirm you have Workspace access

### Solution 3: Verify Site Selection

When you run `library share`, make sure you select the correct site:
- Site name should be "Atomicwork Main Website"
- If you selected the wrong site, run the command again

### Solution 4: Check Browser Cache

If using Webflow in browser:
1. Clear browser cache
2. Hard refresh (Cmd/Ctrl + Shift + R)
3. Close and reopen Designer

## What to Check in Webflow Designer:

1. **Add Panel** - Left sidebar, + icon
2. **Components Tab** - Should show custom components
3. **Search** - Try searching for "Quiz" or "IT Maturity"
4. **Apps Panel** - Some components appear here

## Still Not Working?

Run this diagnostic:

```bash
# 1. Check if build is correct
ls -lh dist/

# 2. Verify webflow.json
cat webflow.json

# 3. Try sharing again with all debugging
npx webflow library share --verbose --debug-bundler --dev

# 4. Check the logs
npx webflow library log
tail -50 /Users/akashchoudhary/Library/Logs/webflow-cli-nodejs/*.log
```

## Alternative: Manual Verification

1. **Did the share command actually run?**
   - Check if you completed all the prompts
   - Look for success message

2. **Check Webflow account**
   - Log into webflow.com
   - Go to your workspace settings
   - Look for registered components/libraries

---

## Next Steps:

**Run this now:**
```bash
npx webflow library share --verbose
```

And share the output with me so I can see what's happening!
