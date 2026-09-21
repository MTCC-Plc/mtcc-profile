"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { assetPath } from "../../lib/asset-path";
import { imageUrl } from "../assets/url";

/**
 * Plays an HLS stream. The source is segmented so no single file breaks the
 * 25 MiB ceiling Cloudflare Pages puts on static assets, and the viewer still
 * sees one continuous video.
 *
 * Safari and iOS play HLS natively. Everything else needs hls.js, which is
 * vendored into public/assets/vendor and fetched only when the viewer presses
 * play — it is ~529KB, far too much to spend on a section most people scroll
 * past. Nothing streams until then either: `preload="none"` plus the poster
 * means an idle visit costs one image, not 123MB of segments.
 */
export type HlsHandle = { play: () => Promise<void>; element: HTMLVideoElement | null };

let hlsScript: Promise<void> | null = null;

function loadHlsScript() {
  hlsScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = assetPath("/assets/vendor/hls.min.js");
    script.onload = () => resolve();
    script.onerror = () => { hlsScript = null; reject(new Error("hls.js failed to load")); };
    document.head.append(script);
  });
  return hlsScript;
}

type HlsConstructor = new (config?: unknown) => {
  loadSource: (src: string) => void;
  attachMedia: (video: HTMLVideoElement) => void;
  destroy: () => void;
};

export function HlsVideo({ src, poster, label, className, handle }: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  handle?: Ref<HlsHandle>;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [attached, setAttached] = useState(false);
  const teardown = useRef<(() => void) | null>(null);

  useEffect(() => () => { teardown.current?.(); }, []);

  /** Attach the stream on demand, then start playback. */
  const start = useCallback(async () => {
    const element = video.current;
    if (!element) return;
    if (!attached) {
      // Safari reports playback support for the HLS type and needs no library.
      if (element.canPlayType("application/vnd.apple.mpegurl")) {
        element.src = assetPath(src);
      } else {
        await loadHlsScript();
        const Hls = (window as unknown as { Hls?: HlsConstructor & { isSupported: () => boolean } }).Hls;
        if (!Hls?.isSupported()) {
          // Nothing left to try; leave the poster in place rather than a dead player.
          return;
        }
        const hls = new Hls();
        hls.loadSource(assetPath(src));
        hls.attachMedia(element);
        teardown.current = () => hls.destroy();
      }
      setAttached(true);
    }
    await element.play().catch(() => {});
  }, [attached, src]);

  useImperativeHandle(handle, () => ({
    play: start,
    element: video.current,
  }), [start]);

  return (
    <video
      ref={video}
      className={className}
      poster={imageUrl(poster)}
      preload="none"
      playsInline
      controls={attached}
      aria-label={label}
    />
  );
}
