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
  title: "CNA Tutor",
  description: "A guided study app to help you get ready for the Texas CNA written exam",
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

