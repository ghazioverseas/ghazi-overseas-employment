import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card className="border-[#D7E8D8] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900">{value}</h3>
          {description && <p className="text-[11px] text-slate-400 font-medium">{description}</p>}
        </div>
        <div className="rounded-xl bg-[#F8FAF8] p-3 text-[#167A3D] border border-[#D7E8D8]">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
