"use client";

import { useState } from "react";
import Image from "./site-image";
import { officialTeamPortraits } from "../data/official-team-portraits";
import styles from "./team-portrait.module.css";

export function TeamPortrait({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const official = src ? officialTeamPortraits[src] : undefined;
  if (!src || localFailed) {
    const names = name.trim().split(/\s+/);
    const initials = [names[0], names.length > 1 ? names[names.length - 1] : ""].map(part => part[0] ?? "").join("");
    return <span className={styles.initials} role="img" aria-label={name}>{initials}</span>;
  }
  return <Image
    src={!failed && official ? official : src}
    alt={name}
    width={400}
    height={400}
    sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 240px"
    onError={() => { if (official && !failed) setFailed(true); else setLocalFailed(true); }}
  />;
}
