# Portfolio v2

Single-viewport personal portfolio — sections page with wheel / swipe / keys and a step bar instead of a scrollbar, over an interactive `WaveMesh` canvas background.

Stack: Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn structure (`components.json`, `@/components/ui`) · motion · lucide-react.

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run deploy    # build with the /portfolio/ base and publish to GitHub Pages (gh-pages branch)
```

Hosting: [siiulan.dev](https://siiulan.dev) runs on a Cloudflare Worker (`wrangler.jsonc`, `worker/index.js`),
deployed by Cloudflare Workers Builds from `main` (build `npm run build`, deploy `npx wrangler deploy`).
The Worker serves `dist/`, redirects `www.` and `portfolio.` to `siiulan.dev`, and answers video
`Range` requests so Safari can play them. GitHub Pages (`siiulan.github.io/portfolio`) still works.

- Content lives in `src/data/profile.ts`.
- Sections are in `src/components/sections/`; paging logic is `src/hooks/use-section-nav.ts`.
- Add shadcn primitives with `npx shadcn@latest add <component>`; they land in `src/components/ui`.
