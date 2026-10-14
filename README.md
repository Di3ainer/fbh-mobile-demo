# FBH mobile website

Static mobile website and a plain HTML diagnostic page.

Enable GitHub Pages in Settings → Pages → Deploy from a branch → main → /(root).

Use hello-world.html in the app first to test hosting, then index.html for the complete website.

Use frame-test.html to see whether the app opens the page inside an iframe and which parameters it passes.

The app's dedicated page embeds the site in an iframe. The host must allow framing (no `X-Frame-Options` / `frame-ancestors` restriction) and must answer the request method the app uses. GitHub Pages only serves GET/HEAD and returns 405 to POST.

## Hosting on Cloudflare Pages

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo, branch `main`, no build command, output directory `/`. `functions/_middleware.js` makes POST requests return the page instead of 405.
