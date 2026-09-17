# mtcc-profile

MTCC corporate and investor profiles for 2026, built with Next.js, React, and GSAP. The website includes responsive layouts, scroll-driven galleries, and reduced-motion support.

## Local development

Use Node.js 22.13 or newer and the package manager pinned in `package.json`:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open http://localhost:5173. The corporate profile is at `/corporate-profile/` and the investor profile at `/investor-profile/`.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys the static website on pushes to `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source.

The workflow reads the Pages base path, so profile navigation, images, and styles work at https://unleasheds.github.io/mtcc-profile/ as well as on a configured custom domain.

To reproduce the repository-path build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/mtcc-profile corepack pnpm build
```

The generated website is in `out/`. This is a static export; it requires no application server, database, OpenAI hosting, or Cloudflare Worker.

## Content and checks

- Profile copy and figures: `app/data/profiles.ts`
- Section components: `app/components/`
- Styles: `app/globals.css`
- Images: `public/assets/`
- Type checking: `corepack pnpm typecheck`

Local PDFs, working files, hosting backups, browser captures, and environment files are excluded from Git. Original profile figures and wording are retained in the website data.
