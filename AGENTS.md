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
- Keep the phone's screen, chassis, back, and circuit-board animations synchronized as one CSS sequence; the exploded pose must expose the internals while retaining a readable front logo.
- Render the phone animation once inside the opening section as a non-interactive decorative background, so content and links remain above it.
- Use the dedicated Embla photo strip for gallery movement, keeping continuous looping and touch dragging in one place and respecting reduced motion.
- Use constrained grid tracks for narrow header and text rows; keep decorative phone motion synchronized and pause it only when offscreen or the document is hidden to reduce background rendering.
