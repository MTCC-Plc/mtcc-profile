import type { Metadata } from "next";
import "./globals.css";
import { assetPath } from "../lib/asset-path";

export const metadata: Metadata = {
  title: "MTCC Profiles 2026",
  description: "Corporate and investor profiles for Maldives Transport & Contracting Company PLC.",
  icons: {
    icon: assetPath("/favicon.svg?v=mtcc-2026"),
    shortcut: assetPath("/favicon.svg?v=mtcc-2026"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
