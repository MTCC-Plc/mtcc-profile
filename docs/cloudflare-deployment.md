# Deploying to Cloudflare Workers

The website is a static Next.js export served by Cloudflare Workers Static Assets. One Worker script, `worker/index.ts`, answers `POST /api/enquiry` by forwarding the private project enquiry to MTCC's Herald email API; every other path is served from `out/` without running the script. Nothing else runs server-side.

```
Browser ──POST /api/enquiry──▶ Worker ──POST──▶ Herald ──▶ info@mtcc.com.mv
   │                             │
   └─ Turnstile token            └─ rate limit, Turnstile check, field validation,
      + honeypot field              fixed recipients, holds the Herald key
```

The Herald key never reaches the browser. The dialog posts to `/api/enquiry` by default; a build with `NEXT_PUBLIC_ENQUIRY_ENDPOINT=mailto` opens an email draft instead, for hosting without the Worker.

Static asset requests are free and unlimited on the Workers Free plan. Only `/api/enquiry` invokes the script and counts against the plan's 100,000 requests per day.

## 1. Prerequisites

- A Cloudflare account. The MTCC zone is only needed for a custom `mtcc.com.mv` hostname (step 6).
- The Herald `Authorization` header value. The Worker sends it exactly as configured, so include any scheme prefix Herald expects (for example `Bearer …`).
- The repository on GitHub with the Cloudflare GitHub app allowed on it.

## 2. Create the Worker

Cloudflare dashboard → **Workers & Pages → Create → Import a repository**, select `MTCC-Plc/mtcc-profile`, then:

| Setting | Value |
|---|---|
| Project name | `mtcc-profile` (must match `name` in `wrangler.jsonc`) |
| Build command | `corepack pnpm build` |
| Deploy command | `npx wrangler deploy` |
| Builds for non-production branches | On, if preview URLs for branches are wanted |

Cloudflare installs dependencies automatically. The committed `.node-version` selects Node 22 and `packageManager` in `package.json` selects the pinned pnpm. `wrangler.jsonc` supplies everything else: the script entry point, the `out/` assets directory, the compatibility date, the non-secret variables and the rate limiter.

Press **Deploy**. The first build succeeds and serves the site, but the Worker returns `500` for enquiries until `HERALD_API_KEY` exists. The deployment creates the Worker so its settings pages become available: add the secrets below (and the Turnstile site key once you have it), then **Deployments → Retry build** (or push a commit).

### Build variables (inlined by `next build`)

Worker → **Settings → Build → Variables and secrets**:

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key | From step 4. Leave unset until the widget exists. |
| `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | — | Not needed. Defaults to `/api/enquiry`; only `mailto` changes behaviour. |
| `NEXT_TELEMETRY_DISABLED` | `1` | Optional. |

These are read only during the build. Changing one requires a new build; the values are frozen into the bundle.

### Runtime secrets (read by the Worker)

Worker → **Settings → Variables and Secrets → Add**, type **Secret**:

| Secret | Value |
|---|---|
| `HERALD_API_KEY` | Full Herald `Authorization` header value |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key from step 4 |

Alternatively from a terminal: `npx wrangler secret put HERALD_API_KEY`. While `TURNSTILE_SECRET_KEY` is unset the Worker does not require a token; set it as soon as the widget is live.

### Runtime variables (already in `wrangler.jsonc`)

`HERALD_URL`, `HERALD_SOURCE` and `ENQUIRY_TO` are committed in `wrangler.jsonc`. Because `wrangler deploy` applies the file on every deployment, edit the file rather than the dashboard; dashboard edits to these names are overwritten by the next deploy. `ENQUIRY_TO` accepts a comma-separated list, for example `info@mtcc.com.mv, projects@mtcc.com.mv`.

## 3. Verify the deployment

1. Open the `https://mtcc-profile.<account>.workers.dev` URL, go to the private projects section and open the enquiry dialog. The footer should read "Your enquiry goes directly to the MTCC team" with a **Send enquiry** button.
2. `curl -i https://mtcc-profile.<account>.workers.dev/api/enquiry` should return `405` with a JSON body.
3. Submit a test enquiry and confirm it arrives at the `ENQUIRY_TO` address. Logs are under the Worker's **Observability → Logs** (or `npx wrangler tail`).

## 4. Turnstile (bot protection)

Dashboard → **Turnstile → Add widget**:

- **Hostnames:** the `*.workers.dev` hostname and, later, the custom domain.
- **Widget mode:** *Managed* (recommended). Cloudflare decides per visitor whether to show a checkbox; most people never see it. *Invisible* also works with this integration.
- **Pre-clearance:** No.

Copy the **site key** into the build variable `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the **secret key** into the runtime secret `TURNSTILE_SECRET_KEY`, then trigger a new build (the site key needs one). The widget renders inside the dialog just above the footer with `appearance: interaction-only`, so it occupies no space unless a challenge is needed.

Cloudflare's test keys are useful locally: site key `1x00000000000000000000AA` with secret `1x0000000000000000000000000000000AA` always pass; secret `2x0000000000000000000000000000000AA` always fails.

## 5. Rate limiting and other protections

The rate limit is part of the Worker, so it applies on the `*.workers.dev` hostname as well as a custom domain. `wrangler.jsonc` declares the `ENQUIRY_RATE_LIMIT` binding as **5 requests per 60 seconds per IP address**; the Worker answers `429` beyond that and the dialog shows the message with the email fallback. Change `limit` (or `period`, which must be `10` or `60`) in the file to tune it.

The Worker also rejects cross-origin `POST`s, discards submissions that fill the hidden honeypot field, enforces field length limits and ignores any recipients supplied by the client. Turnstile handles automated browsers.

If the site is on a custom domain in the MTCC zone, a WAF rate-limiting rule can be layered on top (Security → WAF → Rate limiting rules, path `/api/enquiry`, method `POST`), which blocks at the edge before the Worker is invoked.

## 6. Custom domain

Worker → **Settings → Domains & Routes → Add → Custom domain**, for example `profile.mtcc.com.mv`. The zone must be on the same Cloudflare account; the DNS record and certificate are created automatically. Add the hostname to the Turnstile widget as well.

Leave `NEXT_PUBLIC_BASE_PATH` unset; the site is served from the domain root.

## 7. Local preview with the Worker

```sh
cp .env.example .env.local        # NEXT_PUBLIC_* values for the build
cp .dev.vars.example .dev.vars    # secrets for the Worker
corepack pnpm preview             # builds, then serves out/ + the Worker at http://localhost:8787
```

`pnpm dev` still works for design work but has no `/api/enquiry`: submitting the dialog there shows the error state with the email-draft fallback. Use `preview` to exercise the real flow. `wrangler dev` does not reload `.dev.vars`; restart it after editing. The rate limiter runs locally too, so repeated test submissions return `429` after the fifth in a minute.

To try the Worker without sending real email, point `HERALD_URL` in `.dev.vars` at any local HTTP server that returns `200` and log the request there.

To deploy from a terminal instead of Workers Builds: `NEXT_PUBLIC_ENQUIRY_ENDPOINT=/api/enquiry corepack pnpm build && npx wrangler deploy` after `npx wrangler login`.

## 8. Troubleshooting

| Symptom | Cause |
|---|---|
| Dialog shows "Open email draft" on Cloudflare | The build set `NEXT_PUBLIC_ENQUIRY_ENDPOINT=mailto`; remove that build variable and rebuild. |
| "We could not send your enquiry" on `pnpm dev` | Expected: `next dev` has no Worker. Use `pnpm preview`. |
| `{"ok":false,"error":"Email delivery is not configured."}` (500) | `HERALD_API_KEY` secret is not set on the Worker. |
| "Verification failed" on every submission | Secret and site key belong to different widgets, or the hostname is not listed on the widget. |
| "Please complete the verification" | `TURNSTILE_SECRET_KEY` is set but the site was built without `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. |
| "Too many enquiries from your connection" (429) | Rate limit reached for that IP; wait a minute. |
| "We could not send your enquiry right now." (502) | Herald rejected the request or timed out. The Worker log includes Herald's status and body. |
| Build fails with "name … does not match" | The project name in the dashboard differs from `name` in `wrangler.jsonc`. |

The dialog always offers "Open an email draft instead" after a failed send, so visitors are never stuck.
