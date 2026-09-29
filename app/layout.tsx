import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentMind - AI Content Strategy That Remembers",
  description: "AI-powered content strategy agent with persistent memory using Hindsight",
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
