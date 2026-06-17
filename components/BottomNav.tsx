"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Gamepad2, Wallet, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Sports", icon: TrendingUp },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/withdraw", label: "Withdraw", icon: Wallet },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-50 pb-4">
      <div className="container mx-auto max-w-lg flex items-center justify-around py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-green-500" : "text-gray-500 hover:text-green-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
