import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetNova - The Ultimate Betting Experience",
  description: "A high-fidelity sports betting web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning tells React to ignore browser extensions
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}