import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IP Breaker",
  description: "Agentic IP Firewall for Vibe-Coded Products"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
