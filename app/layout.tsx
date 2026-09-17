import type { Metadata } from "next";
import "./globals.css";
import { assetPath } from "../lib/asset-path";

export const metadata: Metadata = {
  title: "MTCC Profiles 2026",
  description: "Corporate and investor profiles for Maldives Transport & Contracting Company PLC.",
  icons: {
    icon: [
      { url: assetPath("/favicon.ico?v=mtcc-2"), sizes: "32x32", type: "image/x-icon" },
      { url: assetPath("/favicon-32.png?v=mtcc-2"), sizes: "32x32", type: "image/png" },
    ],
    shortcut: assetPath("/favicon.ico?v=mtcc-2"),
    apple: { url: assetPath("/apple-touch-icon.png?v=mtcc-2"), sizes: "180x180", type: "image/png" },
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
