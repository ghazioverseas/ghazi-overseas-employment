import Link from "next/link";
import { ShieldCheck, ArrowRight, FileCheck2, UserCheck2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 text-white sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        <ResponsiveContainer className="relative z-10 text-center">
          {/* Government License Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-900/50 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md mb-8">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Government Licensed Overseas Employment Promoter # OPEP-1234</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
            Empowering Pakistani Professionals with Premier <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Overseas Careers</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg lg:text-xl leading-relaxed">
            The official Candidate Application Portal for Ghazi Overseas Employment Pakistan. Submit your verified credentials, upload required trade documents, and track your overseas recruitment process in real-time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full h-13 px-8 text-base bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 rounded-xl gap-2 font-semibold">
                Start Candidate Application <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-13 px-8 text-base border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl">
                Existing Candidate Login
              </Button>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8 max-w-4xl mx-auto border-t border-slate-800 pt-10">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">25+</span>
              <span className="text-xs text-slate-400 mt-1">Years Industry Trust</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-blue-400">100%</span>
              <span className="text-xs text-slate-400 mt-1">Government Compliant</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">50k+</span>
              <span className="text-xs text-slate-400 mt-1">Candidates Deployed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-emerald-400">R2 Secure</span>
              <span className="text-xs text-slate-400 mt-1">Encrypted Vault</span>
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Feature Pillar Cards */}
      <section className="py-20 bg-slate-50">
        <ResponsiveContainer>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Enterprise Grade Recruitment Ecosystem
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Designed from Day One with clean architecture, strict database persistence, and Cloudflare R2 file security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-6">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cloudflare R2 Document Vault</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct presigned upload token generation. Documents are safely isolated in Cloudflare R2 storage while metadata is tracked strictly in Neon PostgreSQL.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-6">
                <UserCheck2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Better Auth Security</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Strict multi-role middleware authorization for Candidate and Admin routes. No hardcoded arrays, session cookies, or dummy accounts.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-6">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Overseas Gulf Placements</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tailored for Pakistani trade specialists, engineers, medical staff, and skilled technicians targeting Saudi Arabia (KSA), UAE, and Qatar.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-slate-900 py-16 text-white border-t border-slate-800">
        <ResponsiveContainer className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold">Ready to Begin Your Overseas Application?</h3>
            <p className="text-slate-400 text-sm">
              Create your candidate account in under 2 minutes and submit your credentials securely.
            </p>
          </div>
          <Link href="/register" className="shrink-0">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 font-semibold rounded-xl">
              Register Candidate Profile
            </Button>
          </Link>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
