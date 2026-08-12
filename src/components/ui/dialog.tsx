import * as React from "react";
import { cn } from "@/lib/utils";

const Dialog = ({
  children,
  open,
  onClose,
  className,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={cn("relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto", className)}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export { Dialog };
