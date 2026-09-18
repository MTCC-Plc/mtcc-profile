"use client";

import { useState } from "react";
import Image from "./site-image";
import { officialTeamPortraits } from "../data/official-team-portraits";

export function TeamPortrait({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const official = officialTeamPortraits[src];
  return <Image
    src={!failed && official ? official : src}
    alt={name}
    width={400}
    height={400}
    sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 240px"
    onError={() => setFailed(true)}
  />;
}
