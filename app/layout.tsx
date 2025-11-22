import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casper Accelerate | ZK-Rollup",
  description: "Zero-knowledge rollup UX for the Casper Network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
