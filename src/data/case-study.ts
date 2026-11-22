// WealthWeGo engineering case study. Every figure comes from the project's docs/ENGINEERING.md.

export const caseStudy = {
  name: "WealthWeGo",
  live: "https://wealthwego.siiulan.dev",
  intro:
    "One engineer, the whole stack: a React app, a TypeScript API on Cloudflare's edge, a tested finance engine, a database with encrypted backups, and a CI/CD pipeline guarding every change. All of it running on free tiers.",
  stats: [
    { value: "$0", unit: "/mo", label: "to run in production, on free tiers" },
    { value: "99–100", label: "mobile Lighthouse score, every page" },
    { value: "323", label: "automated tests: 155 unit & API, 168 browser" },
    { value: "100%", label: "line coverage on the finance engine" },
  ],
};

export const architecture = {
  client: {
    title: "React 19 SPA",
    sub: "Browser",
    items: ["TanStack Router · Zustand", "Monte Carlo in a Web Worker", "Local-first in IndexedDB"],
  },
  edge: {
    title: "Hono API",
    sub: "Cloudflare Worker",
    items: ["One origin: app + /api/v1", "Google OIDC · PKCE + nonce", "zod at every boundary"],
  },
  stores: [
    { title: "D1 · SQLite", sub: "Drizzle ORM, versioned migrations" },
    { title: "R2 · backups", sub: "Nightly, encrypted, 30 days" },
  ],
  core: {
    title: "packages/core",
    text: "Pure TypeScript finance engine shared by client and server: no I/O, no clock, property-tested",
  },
};

export const pipeline = [
  { title: "Commit", text: "Husky + lint-staged format and lint changed files" },
  { title: "Lint · typecheck · unit · build", text: "Prettier, ESLint, strict tsc, Vitest with coverage gates" },
  { title: "Playwright + axe + Lighthouse", text: "168 browser tests on the exact build, WCAG 2.2 AA, performance budgets" },
  { title: "gitleaks", text: "Secret scan on every push and pull request" },
  { title: "Staging", text: "Its own Worker and database, checked by hand" },
  { title: "Production", text: "Cloudflare builds: build → migrate D1 → deploy" },
];

export const pipelineNote =
  "CI holds no deploy credentials · Renovate weekly updates · well inside the free Actions minutes";

export const security = [
  { title: "Strict CSP", text: "No inline or third-party scripts; HSTS preload" },
  { title: "Google sign-in", text: "OIDC with PKCE, state and nonce; signature verified" },
  { title: "Hashed sessions", text: "Only SHA-256 of the token stored; __Host- cookies" },
  { title: "Encrypted plans", text: "AES-256-GCM, bound to the owner's user id" },
  { title: "Abuse controls", text: "CSRF origin check, per-IP and per-account rate limits" },
  { title: "Privacy", text: "Guests send nothing; export and delete anytime" },
];
