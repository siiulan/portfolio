// Cloudflare Worker for siiulan.dev: serves the built site (dist/) and makes siiulan.dev the one
// address. www. and portfolio. answer with a permanent redirect to the same path on siiulan.dev
// (browsers carry the #route across the redirect), so links and search results all agree.
// Every other host, such as the workers.dev preview, is served as-is.

const CANONICAL = "siiulan.dev";
const ALIASES = new Set(["www.siiulan.dev", "portfolio.siiulan.dev"]);

export default {
  /** @param {Request} request @param {{ ASSETS: { fetch: typeof fetch } }} env */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (ALIASES.has(url.hostname)) {
      url.protocol = "https:";
      url.hostname = CANONICAL;
      return Response.redirect(url.toString(), 301);
    }
    // Static files; unknown paths get index.html, where src/lib/routes.ts turns them into routes.
    const res = await env.ASSETS.fetch(request);
    return url.pathname.endsWith(".mp4") ? withRange(request, res) : res;
  },
};

// Byte-range support for video, ported from WealthWeGo (apps/api/src/range.ts). Workers static
// assets always answer 200 with the whole file, but Safari (macOS and iOS) only plays an MP4 if
// the server honours `Range` with 206.
const RANGE = /^bytes=(\d*)-(\d*)$/;

/** @param {Request} req @param {Response} res */
async function withRange(req, res) {
  const headers = new Headers(res.headers);
  headers.set("Accept-Ranges", "bytes");
  const range = req.headers.get("range");
  if (!range || req.method !== "GET" || res.status !== 200) {
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }

  const body = new Uint8Array(await res.arrayBuffer());
  const size = body.byteLength;
  const m = RANGE.exec(range.trim());
  // Several ranges or a malformed header: send the whole file (allowed by RFC 9110).
  if (!m || (m[1] === "" && m[2] === "")) return new Response(body, { status: 200, headers });

  let start;
  let end;
  if (m[1] === "") {
    start = Math.max(0, size - Number(m[2])); // "bytes=-500": the last 500 bytes
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    headers.delete("Content-Length");
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}
