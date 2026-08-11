"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validators/auth.schema";
import { loginAction, getAuthSessionAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const res = await getAuthSessionAction();
        if (res.success && res.user) {
          if (res.user.role === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/candidate/dashboard");
          }
          return;
        }
      } catch {
        // Not logged in — show login form
      }
      setCheckingSession(false);
    }
    checkExistingSession();
  }, [router]);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await loginAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Login failed.");
        toast({ title: "Authentication Error", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Welcome Back", description: "Successfully authenticated.", variant: "success" });
        window.location.href = "/candidate/dashboard";
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center bg-[#F8FAF8]">
        <Loader2 className="h-8 w-8 animate-spin text-[#167A3D]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4 py-12 bg-[#F8FAF8]">
      <Card className="w-full max-w-md shadow-xl border-[#D7E8D8] bg-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <GhaziLogo size="md" showLink={false} />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">Candidate Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your candidate dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-800 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="your.email@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#167A3D] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 rounded border-[#D7E8D8] text-[#167A3D] focus:ring-[#167A3D]"
                {...register("rememberMe")}
              />
              <Label htmlFor="rememberMe" className="text-xs text-slate-600 font-medium">
                Remember me on this browser
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold gap-2 mt-2 rounded-xl shadow-md"
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"} <LogIn className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center border-t border-[#D7E8D8] pt-4 gap-2 text-xs text-slate-600">
          <span>
            Don&apos;t have a candidate profile?{" "}
            <Link href="/register" className="font-bold text-[#167A3D] hover:underline">
              Apply Now
            </Link>
          </span>

          <div className="pt-2 border-t border-[#D7E8D8] w-full text-center">
            <span className="text-slate-500">
              Are you an Administrator?{" "}
              <Link href="/admin/login" className="font-bold text-[#167A3D] hover:underline">
                Admin Login
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
