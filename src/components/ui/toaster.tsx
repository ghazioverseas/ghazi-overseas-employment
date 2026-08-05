"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-xl p-4 shadow-lg text-sm border flex flex-col gap-1 transition-all animate-in slide-in-from-bottom-5",
            t.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-900"
              : t.variant === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-white border-slate-200 text-slate-900"
          )}
        >
          {t.title && <p className="font-semibold">{t.title}</p>}
          {t.description && <p className="text-xs opacity-90">{t.description}</p>}
        </div>
      ))}
    </div>
  );
}
