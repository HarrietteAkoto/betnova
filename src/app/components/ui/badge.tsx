import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "live" | "gold" | "secondary";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-accent-green text-bg-primary",
    live: "bg-accent-red text-white animate-pulse",
    gold: "bg-accent-gold text-bg-primary",
    secondary: "bg-bg-secondary text-text-primary border border-border",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}