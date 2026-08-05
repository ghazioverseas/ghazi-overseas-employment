import React from "react";
import Link from "next/link";
import { Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand & License Details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white">
                Ghazi Overseas Employment
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Licensed Overseas Employment Promoter in Pakistan (License # OPEP-1234). Connecting Pakistani skilled professionals and technical talent with top international employers in the Middle East and worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Government Registered & Verified Portal
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Official Head Office
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                <span>Islamabad / Rawalpindi Commercial Zone, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span>+92 (051) 111-GHAZI-0</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span>info@ghazioverseas.pk</span>
              </li>
            </ul>
          </div>

          {/* Portals & Governance */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              System Portals
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Candidate Portal Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  New Candidate Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Admin Verification Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Ghazi Overseas Employment Pakistan. All rights reserved. Built with Clean Enterprise Architecture.
        </div>
      </div>
    </footer>
  );
}
