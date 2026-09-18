import type { Metadata } from "next";
import "./globals.css";

const favicon = "https://mtcc.mv/wp-content/uploads/2019/11/mtcc-favicon.png";

export const metadata: Metadata = {
  title: "MTCC | Company Profile 2026",
  description: "The complete company profile of Maldives Transport & Contracting Company PLC.",
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
