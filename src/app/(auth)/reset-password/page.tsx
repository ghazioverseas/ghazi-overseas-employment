"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/validators/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "dummy_token_from_url",
    },
  });

  const onSubmit = async (_data: ResetPasswordInput) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
      toast({ title: "Password Reset Successful", description: "You can now log in with your new password.", variant: "success" });
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md">
            <Lock className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Set New Password</CardTitle>
          <CardDescription>
            Enter your new secure password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          {completed ? (
            <div className="rounded-xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800 border border-emerald-200 text-center">
              Password has been successfully updated! You may now sign in.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("token")} />

              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-blue-700 hover:bg-blue-800 font-semibold"
              >
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          <Link href="/login" className="flex items-center gap-1.5 font-semibold text-blue-600 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
