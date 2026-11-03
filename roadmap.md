# Security and Netlify readiness

## Cross-device polish
- [ ] Improve narrow-screen text, header, contact rows, and stable opening height without changing content.
- [ ] Reduce unnecessary scroll work and pause decorative motion when offscreen.
- [ ] Verify navigation, photo sliding, and phone animation across phone, tablet, and desktop sizes.

## iPhone visuals
- [x] Make shop photos slide automatically in a smooth continuous loop while retaining touch dragging.
- [x] Enhance all five uploaded shop photos and add them to the shop gallery.
- [x] Remove the counter photo and verify the animation behind the opening text on phone and desktop screens.
- [x] Refresh the on-screen Mobile World logo and restore a clearly visible disassembly/reassembly loop.
- [x] Verify the animation and logo on narrow and desktop screens.
- [x] Smooth the parts joining, hold the assembled phone at the loop boundary, and blend the animation into the next section.

- [x] Audit source, public files, credentials, and dependencies.
- [x] Harden error reporting and add a fail-closed credential guard.
- [x] Configure Netlify adapter and document environment variables and function needs.
- [x] Run seven regression tests, verify public pages, and check preview build diagnostics.
- [x] Document remaining risks and verification limits.
- [x] Add environment-file ignore rules — .gitignore now excludes .env, .env.*, private keys, and .netlify/; security:check --source-only passes.
- [ ] Verify Netlify build artifacts and hosted behavior — blocked: no Netlify deployment/account or generated Netlify artifacts available.