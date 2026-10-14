// The app's dedicated page may open URLs with POST; static assets only answer GET/HEAD (405 otherwise).
// Serve the same file for any request method.
export default {
  async fetch(request, env) {
    if (request.method === "GET" || request.method === "HEAD") return env.ASSETS.fetch(request);
    return env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  },
};
