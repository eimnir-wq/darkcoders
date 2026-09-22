"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold tracking-tight transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dc-green disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-dc-green text-dc-black hover:bg-dc-green-soft hover:shadow-[0_0_36px_-8px_rgba(0,255,136,0.75)] active:translate-y-px",
  secondary:
    "bg-transparent text-dc-green border border-dc-green/45 hover:border-dc-green hover:bg-dc-green/10",
  ghost: "bg-transparent text-dc-text/80 hover:text-dc-green hover:bg-dc-green/5",
  danger: "bg-[color:var(--sev-critical)]/15 text-[color:var(--sev-critical)] border border-[color:var(--sev-critical)]/40 hover:bg-[color:var(--sev-critical)]/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export interface ButtonProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
  href?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, href, target, rel, ...props },
  ref,
) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a className={classes} href={href} target={target ?? "_blank"} rel={rel ?? "noopener noreferrer"}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} type={props.type ?? "button"} {...props}>
      {children}
    </button>
  );
});
