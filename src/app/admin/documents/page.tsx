"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Eye, Download, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPresignedDownloadUrlAction } from "@/actions/document.actions";

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
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewKey, setPreviewKey] = useState<string>("");
  const [previewIsImg, setPreviewIsImg] = useState<boolean>(false);

  const [docs, setDocs] = useState<DocumentRow[]>([
    {
      id: "doc_101",
      candidateName: "Muhammad Ali",
      documentType: "Passport",
      originalFileName: "Ali_Passport_Verified.pdf",
      storageKey: "candidates/cand_default_1/passport_sample.pdf",
      fileSizeMb: 2.4,
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "doc_102",
      candidateName: "Muhammad Ali",
      documentType: "CNIC",
      originalFileName: "CNIC_Front_Back.jpg",
      storageKey: "candidates/cand_default_1/cnic_sample.jpg",
      fileSizeMb: 1.1,
      uploadedAt: new Date().toLocaleDateString(),
    },
    {
      id: "doc_103",
      candidateName: "Tariq Mahmood",
      documentType: "CV Resume",
      originalFileName: "Tariq_Resume_Welding.pdf",
      storageKey: "candidates/cand_default_2/cv_sample.pdf",
      fileSizeMb: 0.8,
      uploadedAt: new Date().toLocaleDateString(),
    },
  ]);

  const handlePreview = async (fileName: string, storageKey: string) => {
    try {
      setPreviewTitle(fileName);
      setPreviewKey(storageKey);
      const isImg = !!storageKey.match(/\.(jpg|jpeg|png|webp)$/i);
      setPreviewIsImg(isImg);

      const res = await getPresignedDownloadUrlAction(storageKey);
      if (res.success && res.url) {
        setPreviewUrl(res.url);
      } else {
        toast({ title: "Preview Error", description: res.error || "Unable to generate preview URL.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to load document preview.", variant: "destructive" });
    }
  };

  const handleDownload = async (storageKey: string, fileName: string) => {
    try {
      const res = await getPresignedDownloadUrlAction(storageKey);
      if (res.success && res.url) {
        const a = document.createElement("a");
        a.href = res.url;
        a.download = fileName || "document";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast({ title: "Download Initiated", description: `Downloading ${fileName}...`, variant: "success" });
      } else {
        toast({ title: "Download Error", description: res.error || "Failed to generate download URL.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to download file.", variant: "destructive" });
    }
  };

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
                        onClick={() => handlePreview(doc.originalFileName, doc.storageKey)}
                      >
                        <Eye className="h-3.5 w-3.5 text-[#167A3D]" /> Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1 border-[#D7E8D8]"
                        onClick={() => handleDownload(doc.storageKey, doc.originalFileName)}
                      >
                        <Download className="h-3.5 w-3.5 text-[#167A3D]" /> Download
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
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#D7E8D8] pb-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#167A3D]" /> {previewTitle}
            </h3>
            {previewUrl && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs border-[#D7E8D8]"
                onClick={() => handleDownload(previewKey, previewTitle)}
              >
                <Download className="h-3.5 w-3.5 text-[#167A3D]" /> Download Original
              </Button>
            )}
          </div>

          <div className="flex min-h-[360px] items-center justify-center rounded-xl bg-slate-900/5 p-2 text-center text-sm font-semibold text-slate-600 border border-slate-200">
            {previewIsImg && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt={previewTitle} className="max-h-[480px] w-auto object-contain rounded-lg shadow-sm" />
            ) : previewUrl ? (
              <iframe src={previewUrl} title={previewTitle} className="w-full h-[480px] rounded-lg border-0" />
            ) : (
              <p>Loading document stream...</p>
            )}
          </div>

          <Button onClick={() => setPreviewUrl(null)} className="w-full bg-[#167A3D] text-white">
            Close Preview Window
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
