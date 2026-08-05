"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateRegisterSchema, CandidateRegisterInput } from "@/validators/auth.schema";
import { registerCandidateAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Building2, UserPlus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
  });

  const onSubmit = async (data: CandidateRegisterInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await registerCandidateAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Registration failed.");
        toast({ title: "Registration Error", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Registration Successful", description: res.message, variant: "success" });
        window.location.href = "/login";
      }
    } catch {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md">
            <Building2 className="h-6 w-6 text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Candidate Registration</CardTitle>
          <CardDescription>
            Register your profile with Ghazi Overseas Employment Pakistan
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-800 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name (As per CNIC/Passport)</Label>
              <Input id="fullName" placeholder="Muhammad Ali" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="name@domain.com" {...register("email")} />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile Phone</Label>
                <Input id="phone" placeholder="+923001234567" {...register("phone")} />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cnic">CNIC Number</Label>
              <Input id="cnic" placeholder="12345-1234567-1" {...register("cnic")} />
              {errors.cnic && <p className="text-xs text-red-600">{errors.cnic.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 font-semibold gap-2 mt-2"
            >
              {loading ? "Creating Account..." : "Create Candidate Account"} <UserPlus className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
