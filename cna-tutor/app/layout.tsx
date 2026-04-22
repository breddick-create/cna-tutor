import type { Metadata } from "next";
import { Source_Code_Pro, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HCCI Tutor",
  description: "A guided readiness-first study app for CNA and CCMA exam prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-[var(--font-sans)] antialiased">{children}</body>
    </html>
  );
}

