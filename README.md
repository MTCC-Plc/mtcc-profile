# mtcc-profile

MTCC’s combined company profile for 2026, built with Next.js, React, and GSAP. The website includes responsive layouts, scroll-driven galleries, and reduced-motion support.

## Local development

Use Node.js 22.13 or newer and the package manager pinned in `package.json`:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open http://localhost:5173. All corporate and investor content is arranged on the home page. The old `/corporate-profile/` and `/investor-profile/` URLs redirect to it, preserving section links.

## GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys the static website on pushes to `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the build source.

The workflow reads the Pages base path, so profile navigation, images, and styles work at https://unleasheds.github.io/mtcc-profile/ as well as on a configured custom domain.

To reproduce the repository-path build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/mtcc-profile corepack pnpm build
```

The generated website is in `out/`. This is a static export; it requires no application server, database, OpenAI hosting, or Cloudflare Worker.

## Content and checks

- Original profile copy and figures: `app/data/profiles.ts`
- Combined section order and shared content: `app/data/company-profile.ts`
- Currency selection and formatting: `lib/currency.ts`
- Section components: `app/components/`
- Styles: `app/globals.css`
- Images: `public/assets/`
- Type checking: `corepack pnpm typecheck`

Local PDFs, working files, hosting backups, browser captures, and environment files are excluded from Git. Original profile figures and wording are retained in the website data.

The persistent currency toggle uses the **official rufiyaa symbol with MVR** and **$ USD**, and saves the preference locally. Supplied MVR/USD pairs are displayed exactly as provided. When only one currency was supplied, the equivalent is marked approximate using MVR 15.42 per USD ([MMA reference](https://database.mma.gov.mv/viya/series/4039)); this is a presentation rate, not a live exchange-rate feed. Original table units are retained.

The rufiyaa artwork is an inline SVG extracted from page 2 of the [MMA Currency Symbol Guideline](https://www.mma.gov.mv/files/currency/Currency%20Symbol%20Guideline.pdf). It inherits text color, keeps its original proportions, and precedes amounts. SVG avoids relying on device fonts for this symbol.

The business overview links to each dedicated business section. Detailed corporate service narratives and capabilities are grouped in expandable panels within those sections, avoiding a duplicate core-services carousel.
