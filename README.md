# Overmighty Timer

A focused, mobile‑friendly Progressive Web App (PWA) for structured hangboard (fingerboard) training sessions. Overmighty Timer keeps you fully dialed in: precise phase transitions, visual circular progress, priority sounds, wake‑lock support, and shareable invitation onboarding.

## Tech Stack

- Framework: React 19 + TypeScript
- Build: Vite
- UI Primitives: Radix + custom components (shadcn-inspired patterns)
- Styling: Tailwind CSS
- State: Custom reducer + React Context (Training + Auth)
- Auth & Data: Firebase Auth & Firestore
- Notifications: Sonner (toast system)
- Sounds: Web Audio API utilities (see `soundUtils.ts`)
- PWA: Manifest + Service Worker + Install guide

## Local Development

```bash
# Install deps
npm install

# Start dev server
npm run dev

# Lint & fix
npm run lint
npm run lint:fix

# Type check (implicit via build)
npm run build

# Storybook
npm run storybook
```

Navigate to: http://localhost:5173

## PWA Installation

After opening the app in a supported mobile browser:

1. Android (Chrome): Menu (⋮) → “Install App” or “Add to Home Screen”.
2. iOS (Safari): Share Sheet → “Add to Home Screen”.
3. Desktop Chrome/Edge: Install icon in omnibox if criteria met.

Benefits:

- Fullscreen immersion
- Faster load (service worker cache)
- Screen won’t lock mid-set (with Wake Lock support)

## License

License to be determined. Until then, treat as “All rights reserved”. Open to discussion for OSS licensing (MIT / Apache 2.0) in future roadmap.

---

Feel free to open an issue for feature ideas, bugs, or ergonomics improvements. Train hard. Become overmighty.
