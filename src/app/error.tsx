"use client";

import Link from "next/link";
import { ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700 mb-6 shadow-sm">
        <ServerCrash className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">500 - Internal Server Error</h1>
      <p className="mt-3 max-w-md text-base text-slate-600">
        {error.message || "A critical server error occurred. Our engineering team has been notified."}
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg" onClick={() => reset()} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <RefreshCw className="h-4 w-4" /> Try Reloading
        </Button>
        <Link href="/">
          <Button size="lg" variant="outline">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
