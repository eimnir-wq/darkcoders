import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  variant = "full",
  className,
  priority = false,
  height,
}: {
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
  height?: number;
}) {
  if (variant === "mark") {
    const h = height ?? 34;
    return (
      <Image
        src="/brand/darkcoders-mark.png"
        alt="Dark Coders"
        width={Math.round((220 / 308) * h)}
        height={h}
        priority={priority}
        className={cn("h-auto w-auto", className)}
      />
    );
  }

  const h = height ?? 30;
  return (
    <Image
      src="/brand/darkcoders-logo.png"
      alt="Dark Coders — Hunt In The Darkness!"
      width={Math.round((2134 / 308) * h)}
      height={h}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}
