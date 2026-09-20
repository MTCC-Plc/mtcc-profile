// Cloudflare Worker. Static files in out/ are served by the assets binding
// before this script runs; only paths with no matching file reach it, and the
// only one it answers is POST /api/enquiry.
//
// The enquiry handler is the only server-side code in the project. It
// receives the private project enquiry from the dialog, checks it, and
// forwards it to Herald so the Herald API key never reaches the browser.
// Recipients are fixed here, never taken from the request, so the key cannot
// be used as an open relay.

import { enquiryLimits, enquiryRecipient, enquirySubject, formatEnquiryText, type EnquiryFields, type EnquiryResponse } from "../lib/enquiry";

type Env = {
  /** Static assets binding declared in wrangler.jsonc. */
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  /** Rate limiter declared in wrangler.jsonc. */
  ENQUIRY_RATE_LIMIT: { limit: (options: { key: string }) => Promise<{ success: boolean }> };
  /** Full value of Herald's Authorization header. Secret. */
  HERALD_API_KEY: string;
  /** Herald email endpoint. Defaults to production Herald. */
  HERALD_URL?: string;
  /** Value sent as Herald's `source`. */
  HERALD_SOURCE?: string;
  /** Comma-separated recipient emails. Defaults to info@mtcc.com.mv. */
  ENQUIRY_TO?: string;
  /** Turnstile secret key. When set, every request must carry a valid token. */
  TURNSTILE_SECRET_KEY?: string;
};

const defaultHeraldUrl = "https://api-herald.mtcc.com.mv/notification/email";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry") return handleEnquiry(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

export default worker;

async function handleEnquiry(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "POST") return reply(405, "Method not allowed.", { Allow: "POST" });
  if (!env.HERALD_API_KEY) return reply(500, "Email delivery is not configured.");

  // Browsers always send Origin on cross-site and same-site POSTs; refuse other sites.
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin) return reply(403, "Forbidden.");

  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const { success: withinLimit } = await env.ENQUIRY_RATE_LIMIT.limit({ key: ip });
  if (!withinLimit) return reply(429, "Too many enquiries from your connection. Please try again in a few minutes.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply(400, "Invalid request body.");
  }
  if (!isRecord(body)) return reply(400, "Invalid request body.");

  // Honeypot: real users never see the field; bots that fill it get a quiet success.
  if (text(body.website)) return reply(200);

  const fields = readFields(body);
  if (!fields.name) return reply(400, "Please enter your name.");
  if (!emailPattern.test(fields.email)) return reply(400, "Please enter a valid email address.");
  if (!fields.details) return reply(400, "Please tell us a little about your project.");

  if (env.TURNSTILE_SECRET_KEY) {
    const token = text(body.turnstileToken);
    if (!token) return reply(400, "Please complete the verification and try again.");
    const verified = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip);
    if (!verified) return reply(400, "Verification failed. Please try again.");
  }

  const recipients = (env.ENQUIRY_TO ?? enquiryRecipient).split(",").map(email => email.trim()).filter(Boolean).map(email => ({ email }));
  const message = formatEnquiryText(fields);

  let herald: Response;
  try {
    herald = await fetch(env.HERALD_URL ?? defaultHeraldUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: env.HERALD_API_KEY },
      body: JSON.stringify({
        source: env.HERALD_SOURCE ?? "MTCC Company Profile",
        message,
        emailHtml: formatEnquiryHtml(fields),
        emailSubject: `${enquirySubject} – ${fields.name}`,
        recipients,
      }),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    console.error("Herald request failed", error);
    return reply(502, "We could not send your enquiry right now.");
  }

  if (!herald.ok) {
    console.error("Herald responded", herald.status, await herald.text().catch(() => ""));
    return reply(502, "We could not send your enquiry right now.");
  }

  return reply(200);
}

function reply(status: number, error?: string, headers: Record<string, string> = {}): Response {
  const payload: EnquiryResponse = error && status !== 200 ? { ok: false, error } : { ok: true };
  return Response.json(payload, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function text(value: unknown, limit = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function readFields(body: Record<string, unknown>): EnquiryFields {
  const preferences = Array.isArray(body.preferences)
    ? body.preferences.slice(0, enquiryLimits.preferences).map(item => text(item, enquiryLimits.preferenceTitle)).filter(Boolean)
    : [];
  return {
    name: text(body.name, enquiryLimits.name),
    email: text(body.email, enquiryLimits.email),
    phone: text(body.phone, enquiryLimits.phone),
    company: text(body.company, enquiryLimits.company),
    location: text(body.location, enquiryLimits.location),
    timeline: text(body.timeline, enquiryLimits.timeline),
    details: text(body.details, enquiryLimits.details),
    preferences,
  };
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  if (ip !== "unknown") form.set("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: AbortSignal.timeout(10_000) });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification failed", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function formatEnquiryHtml(fields: EnquiryFields): string {
  const shown = (value: string) => (value ? escapeHtml(value) : "<em>Not provided</em>");
  const row = (label: string, value: string) => `<tr><th align="left" style="padding:6px 12px 6px 0;white-space:nowrap;vertical-align:top">${label}</th><td style="padding:6px 0">${value}</td></tr>`;
  const preferences = fields.preferences.length
    ? `<ul>${fields.preferences.map(title => `<li>${escapeHtml(title)}</li>`).join("")}</ul>`
    : "<p><em>Please help us define the works needed for our project.</em></p>";
  return [
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#072c43">`,
    `<p>A private project enquiry was submitted through the company profile website.</p>`,
    `<h3 style="margin:20px 0 6px">Project preferences</h3>${preferences}`,
    `<h3 style="margin:20px 0 6px">Contact details</h3><table cellpadding="0" cellspacing="0">`,
    row("Name", escapeHtml(fields.name)),
    row("Email", `<a href="mailto:${escapeHtml(fields.email)}">${escapeHtml(fields.email)}</a>`),
    row("Phone", shown(fields.phone)),
    row("Company", shown(fields.company)),
    `</table>`,
    `<h3 style="margin:20px 0 6px">Project details</h3><table cellpadding="0" cellspacing="0">`,
    row("Island / location", shown(fields.location)),
    row("Expected timeline", shown(fields.timeline)),
    `</table>`,
    `<p style="white-space:pre-wrap;margin-top:12px">${escapeHtml(fields.details)}</p>`,
    `</div>`,
  ].join("");
}
