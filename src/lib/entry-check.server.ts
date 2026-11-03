import { createHmac, timingSafeEqual } from 'node:crypto';

const cookieName = '__Host-mw_verified';
const lifetime = 30 * 60;

function signature(value: string, secret: string) {
  return createHmac('sha256', secret).update(`mobile-world-entry:${value}`).digest('hex');
}

function verified(request: Request, secret: string) {
  const value = request.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!value) return false;
  const [expiry, mac] = value.split('.');
  if (!expiry || !mac) return false;
  if (!/^\d+$/.test(expiry) || !/^[a-f0-9]{64}$/.test(mac)) return false;
  const remaining = Number(expiry) - Math.floor(Date.now() / 1000);
  return remaining > 0 && remaining <= lifetime && timingSafeEqual(Buffer.from(mac), Buffer.from(signature(expiry, secret)));
}

function reply(message: string, status: number) {
  return Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function entryCheck(request: Request): Promise<Response | undefined> {
  // Configuration stays in the server bundle; preview runtimes remain unchanged.
  const siteKey = process.env['TURNSTILE_SITE_KEY'];
  const secret = process.env['TURNSTILE_SECRET_KEY'];
  const url = new URL(request.url);
  if (!siteKey || !secret) {
    if (url.pathname === '/__verify') return reply('Verification is not configured.', 503);
    return;
  }

  if (url.pathname === '/__verify') {
    if (request.method !== 'POST') return reply('Method not allowed.', 405);
    if (request.headers.get('origin') !== url.origin) return reply('Request not allowed.', 403);
    if (Number(request.headers.get('content-length') ?? 0) > 4096) return reply('Request too large.', 413);
    try {
      const raw = await request.text();
      if (raw.length > 4096) return reply('Request too large.', 413);
      const body = JSON.parse(raw);
      if (typeof body.token !== 'string' || body.token.length > 2048 || !body.token) return reply('Please complete the CAPTCHA.', 400);
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret, response: body.token }),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return reply('Verification is temporarily unavailable. Please try again.', 503);
      const result = await response.json();
      if (result.success !== true || result.hostname !== url.hostname || result.action !== 'site-entry') return reply('Verification failed. Please try again.', 403);
      const expiry = String(Math.floor(Date.now() / 1000) + lifetime);
      return Response.json({ success: true }, { headers: {
        'Cache-Control': 'no-store',
        'Set-Cookie': `${cookieName}=${expiry}.${signature(expiry, secret)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${lifetime}`,
      } });
    } catch {
      return reply('Verification could not be completed. Please try again.', 503);
    }
  }

  // Only static assets bypass the server check; application requests stay protected.
  if (url.pathname.startsWith('/assets/') || ['/entry-check.js', '/favicon.ico', '/robots.txt'].includes(url.pathname)) return;
  if (verified(request, secret)) return;
  if (request.method !== 'GET' || !request.headers.get('accept')?.includes('text/html')) return reply('Human verification required. Open the website to continue.', 403);
  const safeKey = siteKey.replace(/[^a-zA-Z0-9_-]/g, '');
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Verify to enter · Mobile World</title><style>body{margin:0;background:#f6f5f1;color:#252a26;font:16px/1.6 sans-serif;min-height:100vh;display:grid;place-items:center}main{max-width:540px;padding:40px 24px}small{font-weight:bold;letter-spacing:.14em;color:#52664f}h1{font-size:clamp(28px,6vw,40px);line-height:1.2;letter-spacing:-.04em;margin:24px 0 16px}p{color:#626860}#captcha{margin:28px 0;min-height:70px}button{background:#334d35;color:white;border:0;border-radius:6px;padding:12px 20px;font:inherit;cursor:pointer}footer{margin-top:40px;font-size:12px;color:#73786f}</style><script src="/entry-check.js" defer></script></head><body><main><small>MOBILE WORLD</small><h1>A quick check before you enter.</h1><p>Please complete the security check below. This helps us keep automated traffic away.</p><div id="captcha" data-sitekey="${safeKey}"></div><p id="status" role="status" aria-live="polite">Connecting to the security check…</p><button id="retry" hidden>Try again</button><noscript>Enable JavaScript to complete the security check and enter the website.</noscript><footer>Human verification powered by Cloudflare Turnstile.</footer></main></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' },
  });
}
