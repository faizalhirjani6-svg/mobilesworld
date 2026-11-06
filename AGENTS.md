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
- Use a single muted, inline video opening with session-only playback and reduced-motion opt-out, so the edited user clip replaces both old logo and phone animations without obstructing navigation.
- Use the dedicated Embla photo strip for gallery movement, keeping continuous looping and touch dragging in one place and respecting reduced motion.
- Use constrained grid tracks for narrow header and text rows; pause opening video playback while the document is hidden to reduce background rendering.
- Anchor video overlays to the contained footage's aspect-ratio frame, not the viewport, so they remain aligned through letterboxing.
