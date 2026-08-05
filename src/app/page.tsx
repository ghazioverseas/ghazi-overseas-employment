import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Activity, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAF8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAF8] to-emerald-50/50 py-16 sm:py-24 border-b border-[#D7E8D8]">
        <ResponsiveContainer className="relative z-10 text-center">
          {/* Government License Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D7E8D8] bg-white px-4 py-1.5 text-xs font-extrabold text-[#167A3D] shadow-sm mb-8">
            <ShieldCheck className="h-4 w-4 text-[#167A3D]" />
            <span>O.E.P LIC No. 2636 / KARACHI — Government Licensed Recruitment Agency</span>
          </div>

          {/* Large Ghazi Logo */}
          <div className="flex justify-center mb-8">
            <GhaziLogo size="xl" showLink={false} />
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
            Pakistan&apos;s Trusted <span className="text-[#167A3D]">Overseas Employment</span> Agency
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-700 sm:text-lg lg:text-xl leading-relaxed">
            Apply securely for overseas jobs. Upload your documents. Track your application. Simple payment verification.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-14 px-8 text-base bg-[#167A3D] hover:bg-[#0E5D2E] text-white shadow-xl shadow-[#167A3D]/20 rounded-xl gap-2 font-extrabold">
                Apply Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base border-[#D7E8D8] bg-white text-slate-900 hover:bg-[#F8FAF8] rounded-xl font-bold">
                Login
              </Button>
            </Link>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <ResponsiveContainer>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Candidates Trust Ghazi Overseas Employment
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              A transparent, government-compliant Candidate Application Portal built for fast deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#167A3D]/10 text-[#167A3D] mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Document Upload</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload your Passport, CNIC, and Trade Certificates directly to an encrypted Cloudflare R2 vault.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#167A3D]/10 text-[#167A3D] mb-4">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Application Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor your application through a step-by-step visual tracker from submission to final approval.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#167A3D]/10 text-[#167A3D] mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Approval</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Streamlined verification process with quick admin review and payment verification.
              </p>
            </div>

            <div className="rounded-2xl border border-[#D7E8D8] bg-[#F8FAF8] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#167A3D]/10 text-[#167A3D] mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Licensed Recruitment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Official agency (License # 2636/Karachi) connecting candidates with legitimate Gulf employers.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-[#167A3D] py-16 text-white">
        <ResponsiveContainer className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-black">Begin Your Overseas Job Application Today</h3>
            <p className="text-emerald-100 text-sm">
              Register your profile, upload your documents, and track your application status online.
            </p>
          </div>
          <Link href="/register" className="shrink-0">
            <Button size="lg" className="bg-white text-[#167A3D] hover:bg-emerald-50 h-13 px-8 font-extrabold rounded-xl shadow-lg">
              Create Candidate Account
            </Button>
          </Link>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
