# ORQO API docs

Developer documentation for the ORQO REST API, served at **docs.orqo.site**
(separate from the app at app.orqo.site). Built with
[Fumadocs](https://fumadocs.dev) on Next.js and exported as a static site.

- **Guides** are MDX in `content/docs/` (quickstart, authentication, errors,
  pagination, idempotency, rate limits, webhooks, versioning). Sidebar order:
  `content/docs/meta.json`.
- **API reference** pages are generated at build time from
  `public/openapi.json`: one page per operation, grouped by tag, with
  request/response schemas, code samples and a try-it playground. Nothing to
  write by hand.
- **For AI agents**: `/llms.txt`, `/llms-full.txt`, a Markdown copy of every
  page (`/llms.mdx/docs/<slug>/content.md`), `/openapi.json` and
  `/errors.json`.

## Develop

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Update the API reference

The spec comes from the ORQO app (`orqo-nv`), where Scramble generates it and
`tests/Feature/Api/OpenApiSpecTest.php` keeps it in sync with the code. After
an API change is merged there:

```bash
# in orqo-nv
SENTRY_LARAVEL_DSN= php artisan scramble:export     # writes openapi.json

# here
npm run sync:openapi                                # copies ../orqo-nv/openapi.json
# or: ORQO_OPENAPI=https://example.com/openapi.json npm run sync:openapi
npm run build
```

For a breaking change also add a row to the changelog in
`content/docs/versioning.mdx`. New error codes go in both
`content/docs/errors.mdx` and `public/errors.json`.

## Build

```bash
npm run build      # static site in out/
npm start          # serve out/ on http://localhost:3000
```

`next.config.mjs` uses `output: 'export'`, so `out/` is plain HTML, JS and
JSON. Search runs in the browser (Orama; the index is the static
`/api/search` file), so no server is needed.

## Deploy on its own domain (docs.orqo.site)

Any static host works. Two options:

### A. Cloudflare Pages (recommended)

1. Push this repository to GitHub (for example `AhmedRagabRG/orqo-docs`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to
   Git**, pick the repository.
3. Build settings: framework preset **None**, build command `npm run build`,
   output directory `out`, environment variable `NODE_VERSION=22` (or newer).
4. After the first deploy: **Custom domains → Set up a custom domain** →
   `docs.orqo.site`. If `orqo.site` uses Cloudflare DNS the record is created
   for you; otherwise add `CNAME docs <project>.pages.dev` at your DNS host.

Every push to `main` redeploys; pull requests get preview URLs.

### B. Your own server (nginx)

```bash
npm ci && npm run build
rsync -a --delete out/ deploy@your-server:/var/www/docs.orqo.site/
```

```nginx
server {
    listen 443 ssl http2;
    server_name docs.orqo.site;
    root /var/www/docs.orqo.site;

    ssl_certificate     /etc/letsencrypt/live/docs.orqo.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.orqo.site/privkey.pem;

    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    error_page 404 /404.html;
}
```

Point a DNS `A` record for `docs` at the server and issue the certificate
with `certbot --nginx -d docs.orqo.site`.

### The try-it playground and CORS

The playground calls `https://app.orqo.site/api/v1/...` straight from the
reader's browser with the API token they paste in. The app allows this with
its own CORS policy for the public API (`orqo-nv/config/api.php`), driven by
an exact-origin allowlist:

```dotenv
# orqo-nv .env (production)
API_CORS_ALLOWED_ORIGINS=https://docs.orqo.site
```

Wildcards are ignored, `http://` is accepted only for `localhost`, and no
credentials (cookies) are ever allowed cross-origin: the playground works with
a bearer token only. Add a preview domain (for example a Cloudflare Pages
preview URL) to the list only if you want its playground to work too.

To try the playground against a local app, export a spec whose server is
your local URL and build from it (don't commit that spec):

```bash
# in orqo-nv, with API_CORS_ALLOWED_ORIGINS=http://localhost:3000 in .env
API_DOCS_SERVER_URL=http://localhost:8000/api php artisan scramble:export --path=/tmp/openapi.local.json
# here
ORQO_OPENAPI=/tmp/openapi.local.json npm run sync:openapi && npm run dev
# afterwards: npm run sync:openapi   (restores the production spec)
```

In the playground, the Authorization field starts with `Bearer `; paste the
token after it.
