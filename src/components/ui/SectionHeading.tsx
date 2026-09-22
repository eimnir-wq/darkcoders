import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
  className,
  children,
}: {
  label?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {label && (
        <span className="dc-label inline-flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-dc-green" aria-hidden="true" />
          {label}
        </span>
      )}
      <h2 className="text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-dc-text sm:text-4xl lg:text-[42px]">
        {title}
      </h2>
      {subtitle && (
        <p className={cn("max-w-2xl text-[15px] leading-relaxed text-dc-muted", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
