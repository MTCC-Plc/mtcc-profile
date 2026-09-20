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

/**
 * `getToken` resolves with the current token, or waits for the widget to
 * produce one (managed mode can take a moment, or need the visitor to
 * complete a challenge). It rejects if the widget failed to load or report a
 * token within the timeout.
 */
export type TurnstileHandle = { getToken: () => Promise<string>; reset: () => void };

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
  const loadFailed = useRef(false);
  const waiting = useRef<{ resolve: (token: string) => void; reject: (error: Error) => void }[]>([]);

  useImperativeHandle(ref, () => ({
    getToken: () => new Promise<string>((resolve, reject) => {
      const token = widget.current?.api.getResponse(widget.current.id);
      if (token) { resolve(token); return; }
      if (loadFailed.current) { reject(new Error("The verification service could not be loaded. Please try again.")); return; }
      const entry = { resolve, reject };
      waiting.current.push(entry);
      setTimeout(() => {
        if (!waiting.current.includes(entry)) return;
        waiting.current = waiting.current.filter(item => item !== entry);
        reject(new Error("Verification is taking longer than expected. Please try again."));
      }, 20_000);
    }),
    reset: () => widget.current?.api.reset(widget.current.id),
  }), []);

  function settle(action: (entry: { resolve: (token: string) => void; reject: (error: Error) => void }) => void) {
    const entries = waiting.current;
    waiting.current = [];
    entries.forEach(action);
  }

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    let cancelled = false;

    loadTurnstile().then(api => {
      if (cancelled) return;
      const id = api.render(element, {
        sitekey: siteKey,
        appearance: "interaction-only",
        size: "flexible",
        theme: "light",
        callback: (token: string) => settle(entry => entry.resolve(token)),
        "error-callback": () => settle(entry => entry.reject(new Error("Verification failed. Please try again."))),
        "expired-callback": () => api.reset(id),
      });
      widget.current = { api, id };
    }).catch(() => {
      loadFailed.current = true;
      settle(entry => entry.reject(new Error("The verification service could not be loaded. Please try again.")));
    });

    return () => {
      cancelled = true;
      if (widget.current) widget.current.api.remove(widget.current.id);
      widget.current = null;
      settle(entry => entry.reject(new Error("Verification was interrupted. Please try again.")));
    };
  }, [siteKey]);

  return <div ref={container} className={className} />;
}
