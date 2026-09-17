export type Metric = { value: string; label: string; note?: string };
export type Service = { title: string; description: string; image: string; capabilities: string[]; body?: string[] };
export type TimelineItem = { year: string; title: string; detail: string };

export type ContentBlock =
  | { type: "text"; title?: string; paragraphs?: string[]; items?: string[] }
  | { type: "metrics"; title?: string; metrics: Metric[] }
  | { type: "table"; title: string; columns: string[]; rows: string[][]; note?: string }
  | { type: "bars"; title: string; items: { label: string; value: number; display?: string }[]; note?: string }
  | { type: "brands"; title: string; items: { name: string; product: string; image?: string }[] }
  | { type: "quote"; text: string };


export type ProfileSection =
  | { type: "story"; id: string; eyebrow: string; title: string; body: string[]; image: string; quote?: string }
  | { type: "values"; id: string; title: string; vision: string; mission: string; values: { letter: string; title: string; text: string }[] }
  | { type: "services"; id: string; eyebrow: string; title: string; intro: string; items: Service[] }
  | { type: "metrics"; id: string; eyebrow: string; title: string; intro: string; metrics: Metric[] }
  | { type: "timeline"; id: string; title: string; items: TimelineItem[] }
  | { type: "portfolio"; id: string; eyebrow: string; title: string; intro: string; items: { title: string; description: string; metric?: string }[] }
  | { type: "projects"; id: string; eyebrow: string; title: string; projects: { name: string; mvr: number; usd: number }[] }
  | { type: "people"; id: string; eyebrow: string; title: string; intro: string; body?: string[]; images: string[] }
  | { type: "strategy"; id: string; eyebrow: string; title: string; pillars: { title: string; items: string[] }[] }
  | { type: "content"; id: string; eyebrow: string; title: string; intro?: string; blocks: ContentBlock[]; dark?: boolean }
  | { type: "leadership"; id: string; title: string; people: { name: string; role: string; division?: string; image: string }[] };

export type ProfilePageData = {
  slug: string;
  theme: "corporate" | "investor";
  navigationLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    year: string;
    metrics: Metric[];
  };
  sections: ProfileSection[];
};
