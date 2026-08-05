import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GhaziLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLink?: boolean;
}

export function GhaziLogo({ className, size = "md", showLink = true }: GhaziLogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      {/* Official Emblem Box */}
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-[#167A3D] text-white shadow-md font-bold tracking-tighter",
          size === "sm" && "h-10 w-10 text-xs",
          size === "md" && "h-12 w-12 text-sm",
          size === "lg" && "h-16 w-16 text-lg",
          size === "xl" && "h-20 w-20 text-xl"
        )}
      >
        <div className="flex flex-col items-center leading-none text-center">
          <span className="font-extrabold text-white">GHAZI</span>
          <span className="text-[9px] font-semibold text-emerald-200 uppercase tracking-widest mt-0.5">OEP</span>
        </div>
      </div>

      {/* Typography Badge */}
      <div className="flex flex-col">
        <span
          className={cn(
            "font-extrabold tracking-tight text-[#167A3D] uppercase leading-none",
            size === "sm" && "text-base",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl",
            size === "xl" && "text-3xl"
          )}
        >
          GHAZI
        </span>
        <span
          className={cn(
            "font-bold tracking-wider text-slate-600 uppercase leading-tight",
            size === "sm" && "text-[9px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm",
            size === "xl" && "text-base"
          )}
        >
          OVERSEAS EMPLOYMENT
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="rounded bg-[#167A3D] px-1.5 py-0.5 text-[9px] font-extrabold text-white tracking-widest uppercase">
            O.E.P LIC No. 2636/KARACHI
          </span>
        </div>
      </div>
    </div>
  );

  if (showLink) {
    return <Link href="/">{content}</Link>;
  }

  return content;
}
