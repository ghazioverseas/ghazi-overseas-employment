"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Layout, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateCmsSectionAction } from "@/actions/cms.actions";

export default function AdminCmsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [heroForm, setHeroForm] = useState({
    title: "Pakistan's Trusted Overseas Employment Agency",
    subtitle: "Apply securely for overseas jobs, upload verified documents, and track your visa & recruitment pipeline.",
    badge: "Government Licensed O.E.P LIC No. 2636/KARACHI",
  });

  const [aboutForm, setAboutForm] = useState({
    title: "About Ghazi Overseas Employment Pakistan",
    subtitle: "Over 25 years of excellence in international manpower recruitment.",
    description: "Ghazi Overseas Employment is a premier manpower agency certified by the Ministry of Overseas Pakistanis. We bridge Pakistani technical talent with leading enterprises across Saudi Arabia, UAE, Qatar, Oman, and Kuwait.",
  });

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateCmsSectionAction("hero", heroForm.title, heroForm.subtitle, heroForm);
      if (res.success) {
        toast({ title: "CMS Saved", description: "Hero section content updated.", variant: "success" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update CMS.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website CMS Content Manager"
        subtitle="Edit website sections, homepage hero, about agency, CEO message, services, and legal policies without coding."
      />

      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[#D7E8D8]">
        {[
          { key: "hero", label: "Hero Banner" },
          { key: "about", label: "About Agency" },
          { key: "ceo", label: "CEO Message" },
          { key: "services", label: "Services" },
          { key: "countries", label: "Destination Countries" },
          { key: "terms", label: "Privacy & Terms" },
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
            className={`text-xs font-bold rounded-xl ${
              activeTab === tab.key ? "bg-[#167A3D] text-white" : "border-[#D7E8D8] text-slate-700 bg-white"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === "hero" && (
        <Card className="border-[#D7E8D8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layout className="h-5 w-5 text-[#167A3D]" /> Homepage Hero Section Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label>Hero Badge Tagline *</Label>
                <Input
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Main Heading *</Label>
                <Input
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Subheading Description *</Label>
                <Textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading} className="bg-[#167A3D] text-white font-bold gap-2">
                <Save className="h-4 w-4" /> Save Hero Section
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === "about" && (
        <Card className="border-[#D7E8D8] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#167A3D]" /> About Agency Section Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label>Section Title *</Label>
                <Input
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Agency Description *</Label>
                <Textarea
                  rows={4}
                  value={aboutForm.description}
                  onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={loading} className="bg-[#167A3D] text-white font-bold gap-2">
                <Save className="h-4 w-4" /> Save About Section
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
