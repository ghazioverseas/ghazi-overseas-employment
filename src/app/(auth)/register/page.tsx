"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateRegisterSchema, CandidateRegisterInput } from "@/validators/auth.schema";
import { registerCandidateAction, getAuthSessionAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CandidateRegisterInput>({
    resolver: zodResolver(candidateRegisterSchema),
    defaultValues: {
      country: "Pakistan",
      gender: "Male",
      yearsOfExperience: 2,
    },
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
        // Not logged in — show register form
      }
      setCheckingSession(false);
    }
    checkExistingSession();
  }, [router]);

  const onSubmit = async (data: CandidateRegisterInput) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await registerCandidateAction(data);
      if (!res.success) {
        setErrorMessage(res.error || "Registration failed.");
        toast({ title: "Registration Error", description: res.error, variant: "destructive" });
      } else {
        toast({ title: "Registration Successful", description: "Account created! Redirecting to Dashboard...", variant: "success" });
        // Automatically redirect to Candidate Dashboard
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
      <Card className="w-full max-w-3xl shadow-xl border-[#D7E8D8] bg-white">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <GhaziLogo size="md" showLink={false} />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">Candidate Application Registration</CardTitle>
          <CardDescription>
            Submit your personal & professional details to apply for overseas jobs with Ghazi Overseas Employment
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-800 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Personal Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 pb-1 border-b border-[#D7E8D8]">
                1. Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name (As per CNIC/Passport) *</Label>
                  <Input id="fullName" placeholder="Muhammad Ali" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fatherName">Father&apos;s Name *</Label>
                  <Input id="fatherName" placeholder="Tariq Ali" {...register("fatherName")} />
                  {errors.fatherName && <p className="text-xs text-red-[#167A3D]">{errors.fatherName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cnic">CNIC Number *</Label>
                  <Input id="cnic" placeholder="12345-1234567-1" {...register("cnic")} />
                  {errors.cnic && <p className="text-xs text-red-600">{errors.cnic.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="passportNumber">Passport Number (Optional)</Label>
                  <Input id="passportNumber" placeholder="AB1234567" {...register("passportNumber")} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                  {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select id="gender" {...register("gender")}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 pb-1 border-b border-[#D7E8D8]">
                2. Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile Phone *</Label>
                  <Input id="phone" placeholder="03001234567" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                  <Input id="whatsapp" placeholder="03001234567" {...register("whatsapp")} />
                  {errors.whatsapp && <p className="text-xs text-red-600">{errors.whatsapp.message}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="name@domain.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Address & Location */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 pb-1 border-b border-[#D7E8D8]">
                3. Address & Residential Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-3">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input id="address" placeholder="House / Street / Sector address" {...register("address")} />
                  {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" placeholder="Karachi / Lahore / Islamabad" {...register("city")} />
                  {errors.city && <p className="text-xs text-red-600">{errors.city.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="province">Province *</Label>
                  <Input id="province" placeholder="Sindh / Punjab / KPK" {...register("province")} />
                  {errors.province && <p className="text-xs text-red-600">{errors.province.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...register("country")} readOnly className="bg-slate-100" />
                </div>
              </div>
            </div>

            {/* Section 4: Profession & Education */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 pb-1 border-b border-[#D7E8D8]">
                4. Professional Experience & Qualification
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="profession">Trade Profession / Category *</Label>
                  <Input id="profession" placeholder="Electrician / Welder / Driver / Nurse" {...register("profession")} />
                  {errors.profession && <p className="text-xs text-red-600">{errors.profession.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input id="yearsOfExperience" type="number" min="0" {...register("yearsOfExperience")} />
                  {errors.yearsOfExperience && <p className="text-xs text-red-600">{errors.yearsOfExperience.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="education">Highest Education *</Label>
                  <Input id="education" placeholder="Matric / DAE / Bachelor / Diploma" {...register("education")} />
                  {errors.education && <p className="text-xs text-red-600">{errors.education.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 5: Security Password */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#167A3D] mb-3 pb-1 border-b border-[#D7E8D8]">
                5. Security Password
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold text-base gap-2 rounded-xl shadow-lg mt-4"
            >
              {loading ? "Registering & Logging in..." : "Submit Registration & Go to Dashboard"} <UserPlus className="h-5 w-5" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center justify-center border-t border-[#D7E8D8] pt-4 text-xs text-slate-600">
          <span>
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#167A3D] hover:underline">
              Sign In Here
            </Link>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
