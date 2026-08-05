import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GhaziLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLink?: boolean;
}

export function GhaziLogo({ className, size = "md", showLink = true }: GhaziLogoProps) {
  const content = (
    <div className={cn("inline-flex items-center select-none", className)}>
      <Image
        src="/logo.png"
        alt="Ghazi Overseas Employment Pakistan (O.E.P LIC No. 2636/KARACHI)"
        width={340}
        height={110}
        priority
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-200",
          size === "sm" && "max-h-10 max-w-[200px]",
          size === "md" && "max-h-14 max-w-[260px]",
          size === "lg" && "max-h-20 max-w-[340px]",
          size === "xl" && "max-h-28 max-w-[420px]"
        )}
      />
    </div>
  );

  if (showLink) {
    return (
      <Link href="/" className="inline-block transition-opacity hover:opacity-95">
        {content}
      </Link>
    );
  }

  return content;
}
