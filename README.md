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

The generated website is in `out/`. This is a static export; it requires no application server or database.

## Cloudflare Workers

The production host is Cloudflare Workers with Static Assets. It serves the same `out/` export plus one Worker script, `worker/index.ts`, which forwards the private project enquiry to MTCC's Herald email API with Turnstile bot protection and a per-IP rate limit. Setup, variables and local preview are described in [docs/cloudflare-deployment.md](docs/cloudflare-deployment.md).

## Content and checks

- Current PDF-based profile copy and figures: `app/data/company-profile.ts`
- User-supplied Annual Report 2025 figures: `app/data/annual-report-2025.ts`
- Digital transformation copy: `app/data/digital-transformation.ts`
- Featured investment opportunities: `app/data/featured-investments.ts`, sourced from `Featured Investment Projects.pdf`
- Current management names, titles and contact details: `app/data/management-contacts.ts`, supplied by MTCC
- Grouped drawer navigation: `app/data/navigation.ts`
- Original corporate/investor copy: `app/data/profiles.ts`
- Previous combined edition: `app/data/archived-company-profile.ts`
- Currency selection and formatting: `lib/currency.ts`
- Section components: `app/components/`
- Styles: `app/globals.css`
- Images: `public/assets/`
- Type checking: `corepack pnpm typecheck`

Local PDFs, working files, hosting backups, browser captures, and environment files are excluded from Git. The current edition follows `MTCC-Company-Profile-2026_9665.pdf`, with the existing mission, vision and values presentation preserved in `app/components/values-section.tsx`.

The hero uses the supplied Annual Report 2025 figures: 719 government projects underway, MVR 6.01B total assets, 16.25M passengers and 5,395 employees as at 31 December 2025. The financial section shows the proposed MVR 3.00 dividend per share; CSR and community spending is MVR 8.62M for 2025. Approximate USD equivalents are calculated from the new MVR figures. The user confirmed that the establishment year remains 1980.

The visible project portfolio now uses 719 government projects underway from Annual Report 2025, alongside the existing flagship projects. The workforce shows the dated 5,395-employee headcount and qualitative skills and credentials; updated role counts were not supplied. The transport section shows 16.25M passengers for 2025. Earlier project totals, sector allocations, workforce counts and passenger averages remain in the retained components and archived data, without being displayed. Four main operating divisions are described through the five existing service tabs. The private-project checklist sends the enquiry through `/api/enquiry`; a build with `NEXT_PUBLIC_ENQUIRY_ENDPOINT=mailto` (GitHub Pages) opens an editable email draft containing the selected works instead.

The digital transformation section sits immediately before the workforce. Its three keyboard-accessible chapters and five system views follow `MTCC-Digital-Transformation-Three-Section-Design_9408.pdf`. The reference has no actual system screenshots; `digital-system-visual.tsx` contains responsive service diagrams that can be replaced with approved screenshots later. The section and illustrations have their own CSS modules and support reduced motion.

Potential partnerships uses two accessible tabs for the Integrated Economic Hub and MTCC Staff Housing Scheme. All project descriptions, scales, indicative investments, housing components and partnership details follow `Featured Investment Projects.pdf`. The currency toggle changes displayed equivalents while retaining original investment estimates beneath converted amounts.

Each of the five hub projects and the staff housing scheme has locally hosted illustrative photography. Photo sources and licenses are recorded in `public/assets/investments/CREDITS.md`.

Leadership contains 20 management contacts and nine additional senior management contacts. The organisation chart starts with no person selected; the Senior management and All people views open the contact directory. Selecting a person shows their business card with email and telephone links. Existing portraits and division assignments are retained, while new contacts without a portrait use initials.

The right-hand navigation drawer groups links under About us, What we do, Projects, Sustainability, Investor relations and Contact. Business links open their matching business tab. Leadership and structure opens the organisation chart; Management team opens the full people directory, including when following a direct `#management-team` link.

## Retained sections

Unused layouts remain available without being mounted by the current page:

- `retained-project-portfolio.tsx` preserves the September 2026 register, its 878-project/MVR 34.84B totals, sector allocation and on-hand/completed comparison.
- `retained-workforce-section.tsx` preserves the earlier workforce statistics and the 6,672-person skills and credentials breakdown.
- `retained-profile-sections.tsx` exports the earlier story, services, people, metrics and portfolio sections.
- `publication-sections.tsx` retains the longer about/financial layouts, generic content blocks, leadership grid and contents navigation.
- `investment-highlights.tsx`, `flagship-projects.tsx`, `growth-strategy.tsx`, `differentiators-section.tsx`, `sustainability-section.tsx` and `partnership-section.tsx` retain the earlier dedicated layouts.
- `archivedCompanyProfile` preserves the previous section order and full data for reuse with those components.

To restore a section, import its component into `profile-page.tsx`, select its matching data from `archivedCompanyProfile`, and add it to the visible page and navigation. Its existing styles and assets are retained. Business details are mounted only when their corresponding view is selected.

The persistent currency toggle uses the **official rufiyaa symbol with MVR** and **$ USD**, and saves the preference locally. Supplied MVR/USD pairs are displayed exactly as provided. When only one currency was supplied, the equivalent is marked approximate using MVR 15.42 per USD ([MMA reference](https://database.mma.gov.mv/viya/series/4039)); this is a presentation rate, not a live exchange-rate feed. Original table units are retained.

The rufiyaa artwork is an inline SVG extracted from page 2 of the [MMA Currency Symbol Guideline](https://www.mma.gov.mv/files/currency/Currency%20Symbol%20Guideline.pdf). It inherits text color, keeps its original proportions, and precedes amounts. SVG avoids relying on device fonts for this symbol.

The business overview has five selectable panels. Detailed corporate service narratives and capabilities remain in expandable panels within the retained business components.
