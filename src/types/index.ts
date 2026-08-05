export type UserRole = "admin" | "candidate";

export type CandidateStatus =
  | "registered"
  | "profile_incomplete"
  | "documents_pending"
  | "under_review"
  | "awaiting_payment_verification"
  | "verified"
  | "shortlisted"
  | "approved"
  | "rejected";

export type DocumentType =
  | "passport"
  | "cnic_front"
  | "cnic_back"
  | "cv"
  | "medical_report"
  | "experience_certificate"
  | "degree_diploma"
  | "photo";

export type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | "pending_payment"
  | "payment_under_review"
  | "approved";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  cnic: string;
  passportNumber?: string | null;
  phone: string;
  countryPreference?: string | null;
  tradeCategory?: string | null;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentRecord {
  id: string;
  candidateId: string;
  documentType: DocumentType;
  originalFileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  uploadDate: Date;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
