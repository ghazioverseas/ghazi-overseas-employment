import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { GhaziLogo } from "@/components/common/GhaziLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#D7E8D8] bg-[#0E5D2E] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand & License Info */}
          <div className="flex flex-col gap-3">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur inline-block w-fit">
              <GhaziLogo size="md" showLink={false} />
            </div>
            <p className="text-sm text-emerald-100 leading-relaxed mt-2">
              Pakistan&apos;s premier licensed Overseas Employment Promoter (License # O.E.P LIC No./2636/KARACHI). Deploying qualified professionals and skilled trade workers to Saudi Arabia, UAE, Qatar, and international destinations.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200 mt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> Government Verified Overseas Agency
            </div>
          </div>

          {/* Contact Head Office */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Official Head Office
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-emerald-100">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>Karachi / Islamabad Commercial Zone, Pakistan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>+92 (021) 111-GHAZI-0</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-300 shrink-0" />
                <span>info@ghazioverseas.pk</span>
              </li>
            </ul>
          </div>

          {/* Portals & Direct Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Candidate Portals
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-emerald-100">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Candidate Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Candidate Registration
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

        <div className="mt-10 border-t border-emerald-800/80 pt-6 text-center text-xs text-emerald-200">
          © {new Date().getFullYear()} Ghazi Overseas Employment Pakistan (O.E.P LIC No./2636/KARACHI). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
