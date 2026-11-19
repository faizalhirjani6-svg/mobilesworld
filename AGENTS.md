<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Select Nitro's Netlify preset only when NETLIFY=true; leave the Lovable runtime unchanged for preview and native publishing.
- No credential-backed integrations exist; do not add empty API proxies, and keep future secrets inside server handlers with explicit response allowlists.
- Error diagnostics use fixed messages rather than raw messages, stacks, causes or context because arbitrary error data can contain credentials.
- Run the credential guard on source and public build artifacts before Netlify deploys; server bundles must never be in the public publish directory.
- Use one CSS logo-impact opening with session-only playback and reduced-motion opt-out; keep it non-interactive and pause its animations when the document is hidden to avoid obstructing navigation or background rendering.
- Use the dedicated Embla photo strip for gallery movement, keeping continuous looping and touch dragging in one place and respecting reduced motion.
- Use constrained grid tracks for narrow header and text rows to prevent overflow across device sizes.
- Decorative GLB scenes are dynamically imported after visibility detection; unmount offscreen/hidden scenes, cap mobile DPR, and respect reduced motion to avoid background GPU work.
- Keep repair comparisons explicitly illustrative until matching real photos are supplied; never invent customer testimonials or imply illustrative models are specific inventory.
- Use CSS pointer tilt for repeated shop cards rather than a WebGL context per card to keep the catalog lightweight.
