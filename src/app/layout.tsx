import type { Metadata } from "next";
import "./globals.css";
import Header from "@components/layout/Header";     // ← This should now work after tsconfig update
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "BetNova - Sports Betting Ghana",
  description: "The Ultimate Sports Betting Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#0A0A0A] text-white">
        <Header />
        <main className="pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
