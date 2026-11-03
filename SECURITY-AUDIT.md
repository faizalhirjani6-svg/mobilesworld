# Mobile World — security audit and Netlify deployment

Audit date: 3 November 2026.

## Verified source findings

- Inspected application routes, shared UI, server entry/middleware, configuration,
  public files, and dependency lockfile. No hardcoded API credentials or actual
  credential-backed API requests were found. Google Fonts loads and the Maps link
  do not require private API keys. No keys needed moving to a server handler.
- Existing error reporting serialized messages, stacks, causes and arbitrary
  context. It now emits fixed diagnostics instead. Tests exercise synthetic
  sensitive data to check it is not forwarded to browser telemetry.
- Production dependency scan reported no known vulnerabilities in 52 dependencies.
  This does not cover every development/build dependency or future advisory.
- No database is connected; database security checks did not apply. The platform
  deep scan completed with no findings. It is supporting evidence, not a guarantee.
- Each content route already has its own page title and social metadata.

## Resolved — environment-file ignore rules

The required ignore rules are now in `.gitignore` (added 3 November 2026):

```gitignore
.env
.env.*
!.env.example
**/.env
**/.env.*
!**/.env.example
.dev.vars.*
*.pem
*.key
.netlify/
```

`bun run security:check --source-only` passes. Deployment is no longer blocked by
the guard. Ignore rules do not remove previously committed credentials: if any
were committed in historical revisions, rotate them with their issuing provider
and remove them from history outside this editor. Repository history was not
inspected or rewritten.

## Netlify environment variable list

| Variable | Must you configure it? | Purpose |
| --- | --- | --- |
| Application secrets | No — none are used | This is a public informational site |
| `NETLIFY` | No — Netlify supplies `true` | Selects the Netlify deployment adapter |
| `NODE_VERSION` | No — set to `22` in `netlify.toml` | Build runtime |
| `LOVABLE_API_KEY`, `LOVABLE_CRON_SECRET` | Do not copy | Managed by Lovable and unused by this app |

`.env.example` contains comments and one commented placeholder, not credentials.
For future integrations, add only necessary unprefixed secrets in Netlify's
environment settings with Functions scope, separately by deployment context.
Never use `VITE_` or Vite `define` to expose a private credential. Do not commit
secrets to `.env`, TOML, source files, or example files. Lovable stores secrets
outside committed environment files; Netlify has its own environment store.

## Deployment configuration

- The build runs tests, the source credential guard, the framework build, then
  the public-output credential guard. Use the checked-in `bun.lock` and Netlify's
  Bun installation support; verify the Netlify build log installs Bun correctly.
- Public publish directory: `dist` only. Do not publish the repository root,
  `.output`, or `.netlify`.
- Nitro's `netlify` adapter generates the SSR handler under
  `.netlify/functions-internal/server/server.mjs`; it is not a public asset.
- `netlify/functions/` is configured for independently authored functions. There
  is no secret-backed request to proxy, so no unnecessary API endpoint was added.
  See its README for constraints on any future handler.
- Client source maps are disabled. Netlify configuration adds anti-sniffing,
  framing, referrer, and permission headers. Verify headers on SSR responses after
  deployment: host behavior can differ for generated functions and static assets.
- Preserve the default Lovable adapter outside Netlify. No catch-all SPA redirect
  is added because this application needs its generated SSR function.

## What is and is not verified

- Seven automated routing/security tests passed across three test files.
- The preview's latest automated build diagnostic reported `build OK`.
- Browser checks loaded and refreshed `/`, `/privacy`, `/terms`, verified the
  Maps link and not-found page, and observed zero page runtime errors.
- The source credential guard reports only the missing `.gitignore` rules.
- No `dist` or Netlify function bundle was available locally to inspect; a
  Netlify-target build and public-artifact inspection remain unverified.

Source inspection and automated tests are local checks. The guard checks known
credential formats and unsafe browser environment reads; it cannot recognize
every possible arbitrary password or prove that unknown secrets are absent.
It scans public text assets and rejects source maps/environment/key files; large
source files and binary assets are not content-scanned. It never prints matches.

No Netlify deployment was made and no Netlify account is connected. The actual
Netlify artifact, production headers, SSR routing and production logs must be
verified after the first deploy. The current local preview does not prove the
Netlify adapter works in production. Verify `/`, `/privacy`, `/terms` on direct
navigation and refresh, the Maps link, images, and unknown-path 404 behavior.
Verify the generated function exists and only public assets are in `dist`.

## Remaining risks

1. ~~`.gitignore` manual change~~ — resolved on 3 November 2026; the rules are in place and the guard passes.
2. Historical repository revisions and external provider dashboards are not
   audited here. Rotate any previously exposed credential, even after removal.
3. Unused chart UI interpolates trusted configuration into CSS. It is not used
   by any current page; validate/escape values before allowing untrusted inputs.
4. Google Fonts sends visitor connection metadata to Google. The current privacy
   page should be reviewed for your actual hosting and third-party disclosures.
5. Strict content-security policy is not enabled: the app emits hydration scripts
   and uses inline styles. A tested nonce-based policy is preferable to adding a
   policy that silently breaks pages. Third-party/framework diagnostics outside
   the application error boundary still need review in deployed logs.
6. Future secret-backed functions need input validation, caller authorization,
   abuse/rate controls and response allowlists; moving a key alone is not enough.

References: [Nitro Netlify adapter](https://nitro.build/deploy/providers/netlify),
[Netlify configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/).