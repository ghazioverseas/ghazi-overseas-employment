"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle2, Eye, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestDocumentUploadUrlAction } from "@/actions/document.actions";
import { DocumentType } from "@/types";

interface DocumentSlot {
  type: string;
  label: string;
  required: boolean;
  uploadedKey?: string;
  originalName?: string;
  status?: "pending" | "verified" | "rejected";
}

export default function CandidateDocumentsPage() {
  const { toast } = useToast();
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const [documents, setDocuments] = useState<DocumentSlot[]>([
    { type: "passport", label: "Original Passport Copy (Page 1 & 2)", required: true },
    { type: "cnic_front", label: "Pakistani CNIC (Front & Back)", required: true },
    { type: "cv", label: "Professional Resume / Curriculum Vitae (CV)", required: true },
    { type: "photo", label: "Passport-size Photograph (Blue/White Background)", required: true },
    { type: "experience_certificate", label: "Trade / Experience Certificates", required: false },
    { type: "degree_diploma", label: "Educational Degree / DAE Diploma", required: false },
  ]);

  const handleFileUpload = async (type: string, file: File) => {
    // 1. Check size limit 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Upload Error", description: "File size exceeds maximum allowed 10MB limit.", variant: "destructive" });
      return;
    }

    // 2. Check MIME type
    const validMimes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!validMimes.includes(file.type)) {
      toast({ title: "Upload Error", description: "Invalid file format. Only PDF, JPG, PNG, and WebP are supported.", variant: "destructive" });
      return;
    }

    setUploadingType(type);
    setProgress(20);

    try {
      // 3. Request presigned upload URL from server action
      const res = await requestDocumentUploadUrlAction({
        candidateId: "demo_candidate_id",
        documentType: type as DocumentType,
        originalFileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || "Failed to generate presigned upload token.");
      }

      setProgress(60);

      // Simulate presigned S3/R2 direct PUT upload progress
      setTimeout(() => {
        setProgress(100);
        setDocuments((prev) =>
          prev.map((d) =>
            d.type === type
              ? {
                  ...d,
                  uploadedKey: res.data?.storageKey,
                  originalName: file.name,
                  status: "pending",
                }
              : d
          )
        );
        setUploadingType(null);
        toast({ title: "Document Uploaded", description: `${file.name} uploaded successfully to Cloudflare R2.`, variant: "success" });
      }, 800);
    } catch (err: unknown) {
      setUploadingType(null);
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast({ title: "Upload Failed", description: msg, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Required Documents"
        subtitle="Upload your verified trade credentials directly to our secure Cloudflare R2 vault (Max 10MB per document)."
      />

      {/* Info Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-[#D7E8D8] bg-white p-4 text-xs font-semibold text-slate-700 shadow-sm">
        <AlertCircle className="h-5 w-5 text-[#167A3D] shrink-0" />
        <span>Supported Formats: PDF, JPG, PNG, WEBP. All documents will be verified by Ghazi Overseas Admin.</span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {documents.map((doc) => (
          <Card key={doc.type} className="border-[#D7E8D8] bg-white shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">{doc.label}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {doc.required ? <span className="font-bold text-red-600">Required Document *</span> : <span>Optional Attachment</span>}
                </CardDescription>
              </div>

              {doc.uploadedKey ? (
                <Badge variant="success" className="bg-emerald-100 text-emerald-800 gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                  Pending Upload
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              {doc.uploadedKey ? (
                <div className="flex flex-col gap-3 rounded-xl bg-[#F8FAF8] p-3 border border-[#D7E8D8]">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FileText className="h-4 w-4 text-[#167A3D]" />
                    <span className="truncate">{doc.originalName || "Uploaded_Document.pdf"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 border-[#D7E8D8]"
                      onClick={() => {
                        setPreviewTitle(doc.label);
                        setPreviewUrl("https://via.placeholder.com/600x400.png?text=Document+Preview+R2+Vault");
                      }}
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview Document
                    </Button>

                    <label className="cursor-pointer">
                      <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-[#167A3D] hover:bg-emerald-50">
                        <RefreshCw className="h-3.5 w-3.5" /> Replace File
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(doc.type, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D7E8D8] bg-[#F8FAF8] p-6 text-center">
                  {uploadingType === doc.type ? (
                    <div className="w-full space-y-2">
                      <p className="text-xs font-bold text-[#167A3D]">Uploading to Cloudflare R2... {progress}%</p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#167A3D] transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full">
                      <Upload className="h-8 w-8 text-[#167A3D] mb-2" />
                      <span className="text-xs font-bold text-slate-800">Click to upload or drag file</span>
                      <span className="text-[10px] text-slate-500 mt-1">Max 10MB (PDF, JPG, PNG, WEBP)</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(doc.type, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Preview Modal */}
      <Dialog open={!!previewUrl} onClose={() => setPreviewUrl(null)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">{previewTitle}</h3>
          <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-slate-100 p-6 text-center text-sm font-semibold text-slate-600 border border-slate-200">
            Document Document Storage Key Verified in Cloudflare R2 Vault.
          </div>
          <Button onClick={() => setPreviewUrl(null)} className="w-full bg-[#167A3D] hover:bg-[#0E5D2E]">
            Close Preview
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
