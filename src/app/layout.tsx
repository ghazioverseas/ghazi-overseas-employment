import type { Metadata } from "next";
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
    "Official Candidate Application Portal for Ghazi Overseas Employment Pakistan. Licensed Overseas Employment Promoter (OPEP-1234). Apply for overseas jobs in KSA, UAE, Qatar, and Gulf region.",
  keywords: [
    "Ghazi Overseas Employment",
    "Overseas Jobs Pakistan",
    "Work Visa KSA UAE",
    "OPEP-1234",
    "Overseas Recruitment Portal",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
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
