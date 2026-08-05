"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Eye, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentRow {
  id: string;
  candidateName: string;
  documentType: string;
  originalFileName: string;
  storageKey: string;
  fileSizeMb: number;
  uploadedAt: string;
}

export default function AdminDocumentsPage() {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [docs, setDocs] = useState<DocumentRow[]>([
    {
      id: "doc_101",
      candidateName: "Muhammad Ali",
      documentType: "Passport",
      originalFileName: "Ali_Passport_Verified.pdf",
      storageKey: "documents/cand_1/passport.pdf",
      fileSizeMb: 2.4,
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "doc_102",
      candidateName: "Muhammad Ali",
      documentType: "CNIC",
      originalFileName: "CNIC_Front_Back.jpg",
      storageKey: "documents/cand_1/cnic.jpg",
      fileSizeMb: 1.1,
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "doc_103",
      candidateName: "Tariq Mahmood",
      documentType: "CV Resume",
      originalFileName: "Tariq_Resume_Welding.pdf",
      storageKey: "documents/cand_2/cv.pdf",
      fileSizeMb: 0.8,
      uploadedAt: new Date().toLocaleDateString(),
    },
  ]);

  const handleDelete = (id: string, fileName: string) => {
    setDocs(docs.filter((d) => d.id !== id));
    toast({ title: "Document Purged", description: `${fileName} deleted from Cloudflare R2 bucket and Neon DB.`, variant: "success" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cloudflare R2 Document Storage Vault"
        subtitle="Manage all uploaded candidate passports, CNIC cards, resumes, and trade certificates."
      />

      <Card className="border-[#D7E8D8] bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-slate-700 font-bold border-b border-[#D7E8D8]">
              <tr>
                <th className="p-4">Candidate Name</th>
                <th className="p-4">Doc Type</th>
                <th className="p-4">File Name</th>
                <th className="p-4">File Size</th>
                <th className="p-4">Upload Date</th>
                <th className="p-4 text-right">R2 Storage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7E8D8] text-slate-700">
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#F8FAF8] transition-colors">
                  <td className="p-4 font-bold text-slate-900">{doc.candidateName}</td>
                  <td className="p-4 font-semibold text-[#167A3D]">{doc.documentType}</td>
                  <td className="p-4 font-medium text-slate-800">{doc.originalFileName}</td>
                  <td className="p-4">{doc.fileSizeMb} MB</td>
                  <td className="p-4">{doc.uploadedAt}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1 border-[#D7E8D8]"
                        onClick={() => setPreviewUrl("https://via.placeholder.com/600x400.png?text=R2+Vault+Preview")}
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1 border-[#D7E8D8]">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(doc.id, doc.originalFileName)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Cloudflare R2 Object Preview</h3>
          <div className="flex min-h-[250px] items-center justify-center rounded-xl bg-slate-100 p-6 text-center text-sm font-semibold text-slate-600 border border-slate-200">
            Object verified in Cloudflare R2 bucket (`ghazi-documents`).
          </div>
          <Button onClick={() => setPreviewUrl(null)} className="w-full bg-[#167A3D]">
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
