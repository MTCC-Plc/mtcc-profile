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

If Pages reports an older deployment is still in progress, open **Actions → Deploy MTCC to GitHub Pages → Run workflow**, select `main`, and paste the full older SHA into **cancel_deployment**. The recovery step cancels only that deployment, waits up to two minutes for it to stop, then publishes the newly built site. Leave the field empty for normal deployments. If an old workflow is still running, cancel that run first so the recovery run can leave the queue.

To reproduce the repository-path build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/mtcc-profile corepack pnpm build
```

The generated website is in `out/`. This is a static export; it requires no application server, database, OpenAI hosting, or Cloudflare Worker.

## Content and checks

- Current PDF-based profile copy and figures: `app/data/company-profile.ts`
- Digital transformation copy: `app/data/digital-transformation.ts`
- Original corporate/investor copy: `app/data/profiles.ts`
- Previous combined edition: `app/data/archived-company-profile.ts`
- Currency selection and formatting: `lib/currency.ts`
- Section components: `app/components/`
- Styles: `app/globals.css`
- Images: `public/assets/`
- Type checking: `corepack pnpm typecheck`

Local PDFs, working files, hosting backups, browser captures, and environment files are excluded from Git. The current edition follows `MTCC-Company-Profile-2026_9665.pdf`, with the existing mission, vision and values presentation preserved in `app/components/values-section.tsx`.

The September 2026 register (868 projects, MVR 32.35B) is separate from the earlier on-hand/completed comparison. Financial figures remain labelled 2024. The new workforce section uses the supplied 6,672-person breakdown; a business-area breakdown is not displayed because its underlying figures are not visible in the supplied PDF. The private-project checklist opens an editable email draft containing the selected works.

The digital transformation section sits immediately before the workforce. Its three keyboard-accessible chapters and five system views follow `MTCC-Digital-Transformation-Three-Section-Design_9408.pdf`. The reference has no actual system screenshots; `digital-system-visual.tsx` contains responsive service diagrams that can be replaced with approved screenshots later. The section and illustrations have their own CSS modules and support reduced motion.

## Retained sections

Unused layouts remain available without being mounted by the current page:

- `retained-profile-sections.tsx` exports the earlier story, services, people, metrics and portfolio sections.
- `publication-sections.tsx` retains the longer about/financial layouts, generic content blocks, leadership grid and contents navigation.
- `investment-highlights.tsx`, `flagship-projects.tsx`, `growth-strategy.tsx`, `differentiators-section.tsx`, `sustainability-section.tsx` and `partnership-section.tsx` retain the earlier dedicated layouts.
- `archivedCompanyProfile` preserves the previous section order and full data for reuse with those components.

To restore a section, import its component into `profile-page.tsx`, select its matching data from `archivedCompanyProfile`, and add it to the visible page and navigation. Its existing styles and assets are retained. Business details and the project comparison are mounted only when their corresponding view is selected.

The persistent currency toggle uses the **official rufiyaa symbol with MVR** and **$ USD**, and saves the preference locally. Supplied MVR/USD pairs are displayed exactly as provided. When only one currency was supplied, the equivalent is marked approximate using MVR 15.42 per USD ([MMA reference](https://database.mma.gov.mv/viya/series/4039)); this is a presentation rate, not a live exchange-rate feed. Original table units are retained.

The rufiyaa artwork is an inline SVG extracted from page 2 of the [MMA Currency Symbol Guideline](https://www.mma.gov.mv/files/currency/Currency%20Symbol%20Guideline.pdf). It inherits text color, keeps its original proportions, and precedes amounts. SVG avoids relying on device fonts for this symbol.

The business overview has five selectable panels. Detailed corporate service narratives and capabilities remain in expandable panels within the retained business components.
