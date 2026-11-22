import { projects } from "@/data/profile";

/**
 * The site's route table, and the one place that decides what a URL means.
 *
 * Routes live in the hash (#about, #projects/wealthwego) because GitHub Pages can't serve
 * sub-paths. Anything that isn't an exact route resolves to the closest valid one:
 *   #Projects/  → #projects                 (case and trailing slashes, silently)
 *   #projects/x → #projects                 (unknown detail: its parent section)
 *   #about/x    → #about                    (section without details: the section)
 *   #nonsense   → #home                     (unknown section: home)
 *   /portfolio/projects/wealthwego → #projects/wealthwego   (path-style links)
 * The address bar is corrected with replaceState, so Back never returns to the bad URL.
 */

export const SECTIONS: { id: string; label: string }[] = [
  { id: "home", label: "Index" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
export const SECTION_IDS: string[] = SECTIONS.map((s) => s.id);

/** Sub-routes per section: #<section>/<sub>. */
const SUB_ROUTES: Record<string, ReadonlySet<string>> = {
  projects: new Set(projects.filter((p) => p.caseStudy).map((p) => p.id)),
};

export type Route = { index: number; sub: string | null };

export function routeHash({ index, sub }: Route) {
  return `#${SECTION_IDS[index]}${sub ? `/${sub}` : ""}`;
}

/**
 * Resolves a hash to a route. `found` is false when the URL named something that doesn't exist
 * (worth telling the visitor); `exact` is false when the URL needs rewriting to its canonical form.
 */
export function resolve(hash: string): { route: Route; canonical: string; found: boolean; exact: boolean } {
  let raw: string;
  try {
    raw = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    raw = "\u0000"; // malformed %-escape: treat as an unknown route
  }
  const parts = raw.toLowerCase().split("/").filter(Boolean);

  // No hash at all is the home page as-is.
  if (parts.length === 0) return { route: { index: 0, sub: null }, canonical: hash, found: true, exact: true };

  const index = SECTION_IDS.indexOf(parts[0]);
  if (index < 0) return result({ index: 0, sub: null }, hash, false);

  const sub = parts[1] ?? null;
  if (sub === null) return result({ index, sub: null }, hash, parts.length === 1);
  const valid = SUB_ROUTES[parts[0]]?.has(sub) && parts.length === 2;
  return result({ index, sub: valid ? sub : null }, hash, !!valid);
}

function result(route: Route, hash: string, found: boolean) {
  const canonical = routeHash(route);
  return { route, canonical, found, exact: canonical === hash };
}

/** The current URL's route, after fixing the address bar if it wasn't canonical. */
export function currentRoute() {
  pathToHash();
  const r = resolve(location.hash);
  if (!r.exact) history.replaceState(history.state, "", r.canonical);
  return r;
}

/**
 * Turns a path below the site root into a hash route: /portfolio/projects/x → /portfolio/#projects/x.
 * On GitHub Pages, public/404.html does the same before the app loads; in dev and preview,
 * Vite serves the app for any path, so it's done here.
 */
function pathToHash() {
  const base = import.meta.env.BASE_URL;
  const { pathname } = location;
  if (!pathname.startsWith(base) || pathname === base) return;
  const rest = pathname.slice(base.length).replace(/\/+$/, "");
  const hash = rest && rest !== "index.html" ? `#${rest}` : location.hash;
  history.replaceState(history.state, "", base + hash);
}
