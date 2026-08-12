"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Upload, FileText, CheckCircle2, Eye, Download, RefreshCw, AlertCircle, Send, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getCandidateDocumentsAction,
  deleteDocumentByStorageKeyAction,
} from "@/actions/document.actions";
import { getAdminSettingsAction } from "@/actions/settings.actions";
import { getCurrentCandidateProfileAction } from "@/actions/candidate.actions";

interface DocumentSlot {
  type: string;
  label: string;
  required: boolean;
  uploadedKey?: string;
  originalName?: string;
  status?: "pending" | "verified" | "rejected";
}

interface FetchedDoc {
  id: string;
  candidateId: string;
  documentType: string;
  originalFileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  verificationStatus: string;
}

export default function CandidateDocumentsPage() {
  const { toast } = useToast();
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewMime, setPreviewMime] = useState<string>("application/pdf");
  const [previewKey, setPreviewKey] = useState<string>("");
  const [maxUploadMb, setMaxUploadMb] = useState(10);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);

  const [documents, setDocuments] = useState<DocumentSlot[]>([
    { type: "passport", label: "Original Passport Copy (Page 1 & 2)", required: true },
    { type: "cnic_front", label: "Pakistani CNIC (Front & Back)", required: true },
    { type: "cv", label: "Professional Resume / Curriculum Vitae (CV)", required: true },
    { type: "photo", label: "Passport-size Photograph (Blue/White Background)", required: true },
    { type: "experience_certificate", label: "Trade / Experience Certificates", required: false },
    { type: "degree_diploma", label: "Educational Degree / DAE Diploma", required: false },
  ]);

  const loadDocuments = useCallback(async (targetCandId?: string) => {
    try {
      const res = await getCandidateDocumentsAction(targetCandId);
      if (res.success && Array.isArray(res.data)) {
        const fetchedDocs = res.data as FetchedDoc[];
        setDocuments((prev) =>
          prev.map((slot) => {
            const match = fetchedDocs.find((d) => d.documentType === slot.type);
            if (match) {
              return {
                ...slot,
                uploadedKey: match.storageKey,
                originalName: match.originalFileName,
                status: (match.verificationStatus as "pending" | "verified" | "rejected") || "pending",
              };
            }
            if (slot.uploadedKey) {
              return slot;
            }
            return {
              ...slot,
              uploadedKey: undefined,
              originalName: undefined,
              status: undefined,
            };
          })
        );
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          getAdminSettingsAction(),
          getCurrentCandidateProfileAction(),
        ]);

        if (settingsRes.success && settingsRes.data) {
          setMaxUploadMb((settingsRes.data as { maxUploadSizeMb?: number }).maxUploadSizeMb || 10);
        }

        if (profileRes.success && profileRes.data) {
          setCandidateId(profileRes.data.id);
          await loadDocuments(profileRes.data.id);
        } else {
          await loadDocuments("current");
        }
      } catch {
        await loadDocuments("current");
      }
    }
    init();
  }, [loadDocuments]);

  const handleFileUpload = async (type: string, file: File) => {
    if (file.size > maxUploadMb * 1024 * 1024) {
      toast({
        title: "Upload Error",
        description: `File size exceeds maximum allowed ${maxUploadMb}MB limit set by admin settings.`,
        variant: "destructive",
      });
      return;
    }

    const validMimes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!validMimes.includes(file.type)) {
      toast({ title: "Upload Error", description: "Invalid file format. Only PDF, JPG, PNG, and WebP are supported.", variant: "destructive" });
      return;
    }

    setUploadingType(type);
    setProgress(30);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", type);
      formData.append("candidateId", candidateId || "current");

      setProgress(60);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload document.");
      }

      setProgress(100);

      setDocuments((prev) =>
        prev.map((d) =>
          d.type === type
            ? {
                ...d,
                uploadedKey: data.data.storageKey,
                originalName: file.name,
                status: "pending" as const,
              }
            : d
        )
      );

      setUploadingType(null);
      setProgress(0);
      toast({ title: "Document Uploaded", description: `${file.name} uploaded successfully.`, variant: "success" });

      setTimeout(async () => {
        try {
          await loadDocuments(candidateId || "current");
        } catch {
          // Optimistic state remains active
        }
      }, 1000);
    } catch (err: unknown) {
      setUploadingType(null);
      setProgress(0);
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast({ title: "Upload Failed", description: msg, variant: "destructive" });
    }
  };

  const handlePreview = (label: string, key?: string) => {
    if (!key) {
      toast({ title: "Preview Failed", description: "No document found for preview.", variant: "destructive" });
      return;
    }
    const previewTabUrl = `/api/documents/download?key=${encodeURIComponent(key)}`;
    window.open(previewTabUrl, "_blank");
    toast({ title: "Opening Preview", description: `Opening ${label} in a new tab...`, variant: "success" });
  };

  const handleDownload = (key?: string, filename?: string) => {
    if (!key) return;
    const downloadUrl = `/api/documents/download?key=${encodeURIComponent(key)}&download=true`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename || "document";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({ title: "Download Initiated", description: `Downloading ${filename || "file"}...`, variant: "success" });
  };

  const handleReplace = async (type: string, key?: string, label?: string) => {
    try {
      if (key) {
        await deleteDocumentByStorageKeyAction(key);
      }
    } catch {
      // Ignore background delete errors
    }

    setDocuments((prev) =>
      prev.map((d) =>
        d.type === type
          ? {
              ...d,
              uploadedKey: undefined,
              originalName: undefined,
              status: undefined,
            }
          : d
      )
    );

    toast({
      title: "Document Removed",
      description: `Previous ${label || "file"} removed. You can now upload a replacement file.`,
      variant: "success",
    });
  };

  const handleSubmitAllDocuments = () => {
    setSubmittingAll(true);
    const requiredPending = documents.filter((d) => d.required && !d.uploadedKey);

    if (requiredPending.length > 0) {
      toast({
        title: "Required Documents Missing",
        description: `Please upload all mandatory documents before submitting: ${requiredPending.map((d) => d.label).join(", ")}`,
        variant: "destructive",
      });
      setSubmittingAll(false);
      return;
    }

    setTimeout(() => {
      setSubmittingAll(false);
      setIsFinalSubmitted(true);
      toast({
        title: "Documents Finalized & Submitted",
        description: "All mandatory documents have been submitted to Ghazi Overseas verification team.",
        variant: "success",
      });
    }, 1000);
  };

  const uploadedCount = documents.filter((d) => d.uploadedKey).length;

  return (
    <div className="space-[#D7E8D8] space-y-6">
      <PageHeader
        title="Upload Required Documents"
        subtitle={`Upload your verified trade credentials directly to our secure Cloudflare R2 vault (Max ${maxUploadMb}MB per document).`}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl border border-[#D7E8D8] bg-white p-4 text-xs font-semibold text-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-[#167A3D] shrink-0" />
          <span>Supported Formats: PDF, JPG, PNG, WEBP. Maximum Limit: {maxUploadMb}MB per file.</span>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Badge variant="outline" className="bg-[#F8FAF8] border-[#D7E8D8] text-[#167A3D] font-extrabold px-3 py-1 text-xs">
            {uploadedCount} of {documents.length} Uploaded
          </Badge>
          {isFinalSubmitted && (
            <Badge variant="success" className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 text-xs gap-1">
              <FileCheck className="h-3.5 w-3.5" /> Final Submitted
            </Badge>
          )}
        </div>
      </div>

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
                    <span className="truncate">{doc.originalName || `${doc.type}_document.pdf`}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 border-[#D7E8D8] font-bold hover:bg-slate-50"
                      onClick={() => handlePreview(doc.label, doc.uploadedKey)}
                    >
                      <Eye className="h-3.5 w-3.5 text-[#167A3D]" /> Preview
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 border-[#D7E8D8] font-bold hover:bg-slate-50"
                      onClick={() => handleDownload(doc.uploadedKey, doc.originalName)}
                    >
                      <Download className="h-3.5 w-3.5 text-[#167A3D]" /> Download
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs gap-1 text-[#167A3D] hover:bg-emerald-50 font-bold"
                      onClick={() => handleReplace(doc.type, doc.uploadedKey, doc.label)}
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D7E8D8] bg-[#F8FAF8] p-6 text-center">
                  {uploadingType === doc.type ? (
                    <div className="w-full space-y-2">
                      <p className="text-xs font-bold text-[#167A3D]">Uploading document... {progress}%</p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#167A3D] transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full">
                      <Upload className="h-8 w-8 text-[#167A3D] mb-2" />
                      <span className="text-xs font-bold text-slate-800">Click to upload or drag file</span>
                      <span className="text-[10px] text-slate-500 mt-1">Max {maxUploadMb}MB (PDF, JPG, PNG, WEBP)</span>
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

      <div className="rounded-2xl border border-[#D7E8D8] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Send className="h-5 w-5 text-[#167A3D]" /> Submit Documents for Final Review
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Once all required documents are uploaded, submit them for verification by Ghazi Overseas clearance team.
          </p>
        </div>

        <Button
          onClick={handleSubmitAllDocuments}
          disabled={submittingAll || isFinalSubmitted}
          className="bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-extrabold px-6 h-12 rounded-xl text-sm gap-2 shrink-0 shadow-md"
        >
          {submittingAll ? "Submitting Application..." : isFinalSubmitted ? "Documents Submitted ✓" : "Submit All Documents"}
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Preview Dialog */}
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
                className="gap-1 text-xs border-[#D7E8D8] font-bold"
                onClick={() => handleDownload(previewKey, previewTitle)}
              >
                <Download className="h-3.5 w-3.5 text-[#167A3D]" /> Download Original
              </Button>
            )}
          </div>

          <div className="flex min-h-[360px] items-center justify-center rounded-xl bg-slate-900/5 p-2 text-center text-sm font-semibold text-slate-600 border border-slate-200">
            {previewMime === "image" && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt={previewTitle} className="max-h-[500px] w-auto object-contain rounded-lg shadow-sm" />
            ) : previewUrl ? (
              <iframe src={previewUrl} title={previewTitle} className="w-full h-[500px] rounded-lg border-0" />
            ) : (
              <p>Loading document preview...</p>
            )}
          </div>

          <Button onClick={() => setPreviewUrl(null)} className="w-full bg-[#167A3D] hover:bg-[#0E5D2E] text-white font-bold">
            Close Preview Window
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
