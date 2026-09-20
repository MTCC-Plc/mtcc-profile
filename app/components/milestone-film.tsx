"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward, X } from "lucide-react";
import Image from "./site-image";
import type { TimelineItem } from "../types/profile";
import styles from "./milestone-film.module.css";

type FilmItem = TimelineItem & { image: string; alt: string; category: string };
const SCENE_SECONDS = 6;

function timestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function MilestoneFilm({ title, items, playerRef, onClose }: { title: string; items: FilmItem[]; playerRef: RefObject<HTMLDivElement | null>; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const elapsed = useRef(0);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(true);
  const titleId = useId();
  const duration = items.length * SCENE_SECONDS;
  const ended = position >= duration;
  const active = Math.min(Math.floor(position / SCENE_SECONDS), items.length - 1);
  const item = items[active];
  /*
   * Only the neighbouring scenes stay mounted. There is now one photo per
   * milestone, so rendering them all would stack 22 full-bleed layers: ~156MB
   * of decoded bitmap pinned at once, every one of them promoted to its own
   * compositor layer by `will-change`. A three-scene window keeps the
   * cross-fade intact at a fraction of the cost.
   */
  const scenes = items.map((entry, index) => ({ entry, index })).filter(({ index }) => Math.abs(index - active) <= 1);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const player = playerRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scroll = { left: window.scrollX, top: window.scrollY };
    const body = document.body;
    const previous = { position: body.style.position, top: body.style.top, left: body.style.left, width: body.style.width, overflow: body.style.overflow };
    Object.assign(body.style, { position: "fixed", top: `-${scroll.top}px`, left: `-${scroll.left}px`, width: "100%", overflow: "hidden" });
    element.showModal();
    close.current?.focus({ preventScroll: true });
    const visibility = () => { if (document.hidden) setPlaying(false); };
    let enteredFullscreen = false;
    const fullscreenChange = () => {
      if (document.fullscreenElement === player) enteredFullscreen = true;
      else if (enteredFullscreen) onClose();
    };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", fullscreenChange);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("fullscreenchange", fullscreenChange);
      if (player && document.fullscreenElement === player) void document.exitFullscreen().catch(() => {});
      element.close();
      Object.assign(body.style, previous);
      window.scrollTo({ ...scroll, behavior: "instant" });
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [onClose, playerRef]);

  useEffect(() => {
    if (!playing) return;
    let frame: number;
    let previous: number | undefined;
    function advance(now: number) {
      // Use frame timestamps throughout; the first frame can predate this effect.
      elapsed.current = Math.min(duration, elapsed.current + (previous === undefined ? 0 : Math.max(0, now - previous) / 1000));
      previous = now;
      setPosition(elapsed.current);
      if (elapsed.current >= duration) {
        setPlaying(false);
      } else {
        frame = requestAnimationFrame(advance);
      }
    }
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);

  function seek(value: number) {
    elapsed.current = Math.max(0, Math.min(duration, value));
    setPosition(elapsed.current);
    if (elapsed.current >= duration) setPlaying(false);
  }

  function togglePlayback() {
    if (ended) { seek(0); setPlaying(true); }
    else setPlaying(value => !value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)"));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={onKeyDown}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    <div ref={playerRef} className={styles.player} data-playing={playing} style={{ "--scene-progress": ended ? 1 : (position % SCENE_SECONDS) / SCENE_SECONDS } as CSSProperties}>
      <header className={styles.topbar}>
        <div><p className={styles.eyebrow}>MTCC · Our journey</p><h2 id={titleId} className={styles.title}>{title}.</h2></div>
        <button ref={close} type="button" className={styles.iconButton} onClick={onClose} aria-label="Close journey"><X size={22} aria-hidden="true" /></button>
      </header>
      <div className={styles.scene}>
        <div className={styles.backdrops}>{scenes.map(({ entry, index }) => <Image key={index} className={styles.image} src={entry.image} alt={index === active ? entry.alt : ""} aria-hidden={index !== active} data-active={index === active} fill sizes="100vw" loading={index <= active + 1 ? "eager" : "lazy"} />)}</div>
        <div className={styles.shade} />
        <div className={styles.story} key={item.year} aria-live={playing ? "off" : "polite"} aria-atomic="true">
          <p className={styles.chapter}>{item.category}</p>
          <time className={styles.year} dateTime={item.year}>{item.year}</time>
          <h3 className={styles.headline}>{item.title}</h3>
          <p className={styles.description}>{item.detail}</p>
          {!playing && <p className={styles.status}>{ended ? "Journey complete" : "Paused"}</p>}
        </div>
      </div>
      <footer className={styles.controls}>
        <div className={styles.seekRow}><input type="range" className={styles.seek} min={0} max={duration} step={0.1} value={position}
          style={{ "--progress": `${position / duration * 100}%` } as CSSProperties} aria-label="Journey progress"
          aria-valuetext={`${timestamp(position)} of ${timestamp(duration)}. ${item.year}: ${item.title}`}
          onChange={event => seek(Number(event.currentTarget.value))} /></div>
        <div className={styles.transport}>
          <button type="button" className={styles.playButton} onClick={togglePlayback} aria-label={ended ? "Replay journey" : playing ? "Pause journey" : "Play journey"}>
            {ended ? <RotateCcw size={19} aria-hidden="true" /> : playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}{ended ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button type="button" className={styles.iconButton} disabled={active === 0} onClick={() => seek((active - 1) * SCENE_SECONDS)} aria-label="Previous chapter"><SkipBack size={19} aria-hidden="true" /></button>
          <button type="button" className={styles.iconButton} disabled={active === items.length - 1} onClick={() => seek((active + 1) * SCENE_SECONDS)} aria-label="Next chapter"><SkipForward size={19} aria-hidden="true" /></button>
          <span className={styles.clock}>{timestamp(position)} <span>/ {timestamp(duration)}</span></span>
          <span className={styles.counter}>Chapter {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        </div>
      </footer>
    </div>
  </dialog>;
}
