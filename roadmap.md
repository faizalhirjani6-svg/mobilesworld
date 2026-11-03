# Security and Netlify readiness

- [x] Audit source, public files, credentials, and dependencies.
- [x] Harden error reporting and add a fail-closed credential guard.
- [x] Configure Netlify adapter and document environment variables and function needs.
- [x] Run seven regression tests, verify public pages, and check preview build diagnostics.
- [x] Document remaining risks and verification limits.
- [x] Add environment-file ignore rules — .gitignore now excludes .env, .env.*, private keys, and .netlify/; security:check --source-only passes.
- [ ] Verify Netlify build artifacts and hosted behavior — blocked: no Netlify deployment/account or generated Netlify artifacts available.