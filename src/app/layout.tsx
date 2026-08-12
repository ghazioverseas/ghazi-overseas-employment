import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ghazi Overseas Employment Pakistan | Candidate Portal",
    template: "%s | Ghazi Overseas Employment Pakistan",
  },
  description:
    "Official Candidate Application Portal for Ghazi Overseas Employment Pakistan. Licensed Overseas Employment Promoter (OPEP-2636/KARACHI). Apply for overseas jobs in KSA, UAE, Qatar, and Gulf region.",
  keywords: [
    "Ghazi Overseas Employment",
    "Overseas Jobs Pakistan",
    "Work Visa KSA UAE",
    "OPEP-2636",
    "Overseas Recruitment Portal",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#167A3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#F8FAF8] text-slate-900 antialiased selection:bg-[#167A3D] selection:text-white`}>
        <ErrorBoundary>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
