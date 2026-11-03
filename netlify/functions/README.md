# Netlify functions

No credential-backed API exists in Mobile World, so there is no API proxy to
implement or secret to move. Do not add a generic proxy or an endpoint that
returns environment variables. Nitro generates the site's SSR function in
`.netlify/functions-internal/`; this directory is only for separately authored
Netlify functions and does not replace that generated function.

If a future external API integration is added, read its private credential with
`process.env['PROVIDER_API_KEY']` inside the server handler, reject unsupported
methods, validate input, use a fixed provider URL, enforce authorization and
rate limits as appropriate, and return only explicitly selected public fields.
Never return or log credentials, upstream headers, raw errors, or request bodies.
Do not import server handlers into frontend modules or use `VITE_` for secrets.