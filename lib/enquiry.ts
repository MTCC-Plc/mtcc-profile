// Shared between the browser dialog and the Cloudflare Pages Function so that
// the field limits and the plain-text email layout are defined once.

export const enquiryRecipient = "info@mtcc.com.mv";
export const enquirySubject = "Private project enquiry";

export const enquiryLimits = {
  name: 120,
  email: 254,
  phone: 40,
  company: 160,
  location: 180,
  timeline: 120,
  details: 4000,
  preferences: 40,
  preferenceTitle: 200,
} as const;

export type EnquiryFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  timeline: string;
  details: string;
  preferences: string[];
};

export type EnquiryResponse = { ok: true } | { ok: false; error: string };

export function formatEnquiryText(fields: EnquiryFields): string {
  const shown = (value: string) => value || "Not provided";
  return [
    "Hello MTCC,",
    "",
    "I would like to discuss a private project with your team.",
    "",
    "PROJECT PREFERENCES",
    fields.preferences.length ? fields.preferences.map(title => `- ${title}`).join("\n") : "Please help us define the works needed for our project.",
    "",
    "CONTACT DETAILS",
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Phone: ${shown(fields.phone)}`,
    `Company: ${shown(fields.company)}`,
    "",
    "PROJECT DETAILS",
    `Island / location: ${shown(fields.location)}`,
    `Expected timeline: ${shown(fields.timeline)}`,
    "",
    fields.details,
  ].join("\n");
}
