# Devlink Folder

This folder will contain your Webflow components after you sync them using Webflow Devlink.

## How to Sync Components

1. Make sure you've enabled Devlink in your Webflow project settings
2. Run: `npx wf devlink init` (first time only)
3. Run: `npx wf devlink sync` (to sync/update components)

## What Gets Generated

After syncing, this folder will contain:
- React components for each Webflow element you've synced
- TypeScript type definitions
- Necessary styles and assets
- An `index.ts` file for easy imports

## Using Synced Components

Import components from this folder in your React code:

```tsx
import { MyComponent } from '../devlink';
// or
import { MyComponent } from '../devlink/MyComponent';
```

## Keeping Components Updated

Whenever you make changes in Webflow, run `npx wf devlink sync` again to update the components in this folder.
