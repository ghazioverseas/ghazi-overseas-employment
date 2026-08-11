"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validators/auth.schema";
import { adminLoginAction, getAuthSessionAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await getAuthSessionAction();
        if (res.success && res.user) {
          if (res.user.role === "admin") {
            router.replace("/admin/dashboard");
          } else {
            // Candidate user trying to access admin login — send them to candidate dashboard
            router.replace("/candidate/dashboard");
          }
          return;
        }
      } catch {
        // Not logged in — show admin login form
      }
      setCheckingSession(false);
    }
    checkExistingSession();
  }, [router]);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await adminLoginAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Admin authentication failed.");
        toast({ title: "Access Denied", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Admin Authenticated", description: "Welcome to Admin Control Center.", variant: "success" });
        // Redirect to Admin Dashboard
        window.location.href = "/admin/dashboard";
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#167A3D]" />
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#F8FAF8]">
      <Card className="w-full max-w-md shadow-2xl border-[#D7E8D8] bg-white">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="flex justify-center">
            <GhaziLogo size="md" showLink={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 self-center rounded-full bg-[#167A3D] px-3.5 py-1 text-xs font-black uppercase tracking-widest text-white shadow-sm">
            <ShieldCheck className="h-4 w-4" /> ADMIN PORTAL
          </div>

          <CardTitle className="text-2xl font-black text-slate-900 pt-1">
            Secure Administrative Access
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Authorized Ghazi Overseas Employment staff & super admin sign in
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-xs font-bold text-red-800 border border-red-200 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">Admin Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="name@domain.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#167A3D] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="adminRememberMe"
                className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D] focus:ring-[#167A3D]"
                {...register("rememberMe")}
              />
              <Label htmlFor="adminRememberMe" className="text-xs text-slate-600 font-medium cursor-pointer">
                Remember admin session
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-sm gap-2 rounded-xl shadow-lg mt-2"
            >
              {loading ? "Authenticating Admin..." : "Sign In to Admin Portal"} <Lock className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center border-t border-[#D7E8D8] pt-4 text-xs text-slate-600">
          <span>
            Candidate looking to apply or check status?{" "}
            <Link href="/login" className="font-bold text-[#167A3D] hover:underline">
              Candidate Login
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
