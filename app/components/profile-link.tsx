"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Reset before routing so the next profile cannot inherit the previous scroll. */
export function ProfileLink(props: Omit<ComponentProps<typeof Link>, "onNavigate">) {
  return <Link {...props} onNavigate={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })} />;
}
