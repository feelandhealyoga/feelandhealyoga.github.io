# Astro Migration Plan

## Overview
Convert the existing React SPA to Astro for better SEO via static HTML generation, while keeping React components intact for interactivity.

## Current Structure
- React app using Vite, with components in src/components/, pages in src/pages/.
- Minimal routing: only home (/) and 404 (*), but 404 will be removed per user request.
- Uses react-router-dom, but no actual page navigation—single page with sections.

## Migration Steps
1. **Install Astro and React Integration**:
   - `npm install astro`
   - `npx astro add react`

2. **Restructure Files**:
   - Move React components to `src/components/` (keep `.tsx`).
   - Create `src/pages/index.astro`: Import and render all sections (e.g., `<HeroSection client:load />` for full interactivity on load).
   - Remove `NotFound.tsx` and related routing.
   - Move assets to `public/`.

3. **Remove Unnecessary Dependencies**:
   - Uninstall `react-router-dom`, `BrowserRouter`, and routing logic since no page-level routes exist.
   - Keep React for interactive components (e.g., `TrialPopup` with `client:load`).

4. **Configuration**:
   - Set up `astro.config.mjs` for static output, React support.
   - Update `package.json` scripts: `astro dev`, `astro build`.

5. **SEO and Static Generation**:
   - Astro generates static HTML for the index page, with JS only for interactive parts, improving SEO and performance.

## Client Directives
- `client:load`: Pre-renders as HTML for SEO, then hydrates with JS immediately for interactivity.

## Routing
- No 404 page; everything routes to index (single static page).

## Post-Migration
- Run `astro build` to generate static HTML.
- Verify SEO improvements and interactivity.