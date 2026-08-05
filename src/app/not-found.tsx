import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-4 text-center bg-[#F8FAF8]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-[#167A3D] mb-6 shadow-sm">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">404 - Page Not Found</h1>
      <p className="mt-3 max-w-md text-base text-slate-600">
        The requested portal page or document resource does not exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button size="lg" className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 rounded-xl">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
