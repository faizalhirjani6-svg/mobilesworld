import { afterEach, describe, expect, it, vi } from 'vitest';
import { entryCheck } from '../lib/entry-check.server';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
function configure() {
  vi.stubEnv('NETLIFY', 'true');
  vi.stubEnv('TURNSTILE_SITE_KEY', 'placeholder');
  vi.stubEnv('TURNSTILE_SECRET_KEY', 'placeholder');
}
const origin = 'https://mobilesworld.netlify.app';
function submit() {
  return new Request(`${origin}/__verify`, { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ token: 'placeholder' }) });
}

describe('entry verification', () => {
  it('leaves preview runtimes unchanged', async () => {
    vi.stubEnv('NETLIFY', 'false');
    vi.stubEnv('TURNSTILE_SITE_KEY', '');
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    expect(await entryCheck(new Request(origin))).toBeUndefined();
  });
  it('does not claim verification when configuration is absent', async () => {
    vi.stubEnv('NETLIFY', 'true');
    vi.stubEnv('TURNSTILE_SITE_KEY', '');
    expect(await entryCheck(new Request(origin))).toBeUndefined();
    expect((await entryCheck(submit()))?.status).toBe(503);
  });
  it('challenges HTML and denies application requests without a valid cookie', async () => {
    configure();
    const page = await entryCheck(new Request(origin, { headers: { accept: 'text/html' } }));
    expect(await page?.text()).toContain('A quick check before you enter.');
    expect(page?.headers.get('cache-control')).toContain('no-store');
    expect((await entryCheck(new Request(`${origin}/_serverFn/test`)))?.status).toBe(403);
    expect(await entryCheck(new Request(`${origin}/assets/app.js`))).toBeUndefined();
  });
  it('rejects cross-origin verification', async () => {
    configure();
    expect((await entryCheck(new Request(`${origin}/__verify`, { method: 'POST', headers: { origin: 'https://example.org' } })))?.status).toBe(403);
  });
  it('requires the expected hostname and action', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, hostname: 'example.org', action: 'site-entry' })));
    expect((await entryCheck(submit()))?.status).toBe(403);
  });
  it('issues a signed cookie only after validation and rejects tampering', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ success: true, hostname: 'mobilesworld.netlify.app', action: 'site-entry' })));
    const response = await entryCheck(submit());
    const cookie = response?.headers.get('set-cookie');
    expect(cookie).toContain('HttpOnly; Secure; SameSite=Lax');
    const pair = cookie!.split(';')[0]!;
    expect(await entryCheck(new Request(origin, { headers: { cookie: pair } }))).toBeUndefined();
    expect((await entryCheck(new Request(origin, { headers: { cookie: `${pair}broken` } })))?.status).toBe(403);
  });
});
