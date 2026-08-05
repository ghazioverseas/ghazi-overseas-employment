import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-700 mb-6 shadow-sm">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">403 - Access Forbidden</h1>
      <p className="mt-3 max-w-md text-base text-slate-600">
        You do not have the required permissions or role privileges to access this portal section.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button size="lg" className="bg-slate-900 hover:bg-slate-800 gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
