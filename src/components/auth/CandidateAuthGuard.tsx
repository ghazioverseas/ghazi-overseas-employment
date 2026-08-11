"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthSessionAction } from "@/actions/auth.actions";
import { Loader2 } from "lucide-react";

export function CandidateAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkRole() {
      try {
        const res = await getAuthSessionAction();
        if (res.success && res.user) {
          if (res.user.role === "admin") {
            // Admin users should not access candidate portal — redirect to admin dashboard
            router.replace("/admin/dashboard");
            return;
          }
          setAuthorized(true);
        } else {
          // Not logged in — redirect to candidate login
          router.replace("/login");
          return;
        }
      } catch {
        router.replace("/login");
        return;
      } finally {
        setChecking(false);
      }
    }
    checkRole();
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#167A3D]" />
          <p className="text-sm font-semibold text-slate-600">Verifying candidate access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
