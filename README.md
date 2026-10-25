# Portfolio v2

Single-viewport personal portfolio — sections page with wheel / swipe / keys and a step bar instead of a scrollbar, over an interactive `WaveMesh` canvas background.

Stack: Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn structure (`components.json`, `@/components/ui`) · motion · lucide-react.

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run deploy    # build and publish dist/ to GitHub Pages (gh-pages branch)
```

- Content lives in `src/data/profile.ts`.
- Sections are in `src/components/sections/`; paging logic is `src/hooks/use-section-nav.ts`.
- Add shadcn primitives with `npx shadcn@latest add <component>`; they land in `src/components/ui`.
