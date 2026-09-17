import type { Metadata } from "next";
import "./globals.css";

const favicon = "https://mtcc.mv/wp-content/uploads/2019/11/mtcc-favicon.png";

export const metadata: Metadata = {
  title: "MTCC Profiles 2026",
  description: "Corporate and investor profiles for Maldives Transport & Contracting Company PLC.",
  icons: {
    icon: { url: favicon, type: "image/png" },
    shortcut: favicon,
    apple: { url: favicon, type: "image/png" },
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
