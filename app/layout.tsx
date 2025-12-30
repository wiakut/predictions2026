import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Твоє передбачення на 2026",
  description: "Відкрий магію нового року. Що принесе тобі цей час?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

