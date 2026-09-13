import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NemaLens AI | Diagnostic intelligence",
  description: "Evidence-linked parasitology research workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
