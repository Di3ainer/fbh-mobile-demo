// Cloudflare Pages: the app may open pages with POST, which static hosts reject (405).
// Serve the same static file for any request method.
export async function onRequest({ request, env, next }) {
  if (request.method === "GET" || request.method === "HEAD") return next();
  return env.ASSETS.fetch(new Request(request.url, { method: "GET", headers: request.headers }));
}
