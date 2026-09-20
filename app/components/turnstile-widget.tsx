"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";

// Cloudflare Turnstile is loaded on demand when the enquiry dialog opens.
// The widget renders in "interaction-only" appearance, so visitors only see
// it when Cloudflare needs them to complete a challenge.

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  getResponse: (widgetId: string) => string | undefined;
};

declare global {
  interface Window { turnstile?: Turnstile; onTurnstileReady?: () => void }
}

export type TurnstileHandle = { getToken: () => string; reset: () => void };

type TurnstileWidgetProps = {
  siteKey: string;
  ref?: Ref<TurnstileHandle>;
  className?: string;
};

let loader: Promise<Turnstile> | undefined;

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loader ??= new Promise<Turnstile>((resolve, reject) => {
    window.onTurnstileReady = () => { if (window.turnstile) resolve(window.turnstile); };
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit";
    script.async = true;
    script.onerror = () => { loader = undefined; reject(new Error("Turnstile failed to load")); };
    document.head.append(script);
  });
  return loader;
}

export function TurnstileWidget({ siteKey, ref, className }: TurnstileWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<{ api: Turnstile; id: string }>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => widget.current?.api.getResponse(widget.current.id) ?? "",
    reset: () => widget.current?.api.reset(widget.current.id),
  }), []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;

    loadTurnstile().then(api => {
      if (cancelled) return;
      const id = api.render(element, { sitekey: siteKey, appearance: "interaction-only", size: "flexible", theme: "light" });
      widget.current = { api, id };
    }).catch(() => { /* The server rejects the submission and the dialog offers the email fallback. */ });

    return () => {
      cancelled = true;
      if (widget.current) widget.current.api.remove(widget.current.id);
      widget.current = null;
    };
  }, [siteKey]);

  return <div ref={container} className={className} />;
}
