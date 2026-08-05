"use server";

import { PipelineService } from "@/services/pipeline.service";

export async function updatePipelineStageAction(applicationId: string, newStage: string) {
  try {
    const updated = await PipelineService.updateApplicationStage(applicationId, newStage, "admin_super_user");
    return { success: true, data: updated, message: `Pipeline stage updated to ${newStage.toUpperCase()}` };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update pipeline stage.";
    return { success: false, error: errMessage };
  }
}

export async function scheduleInterviewAction(data: {
  applicationId: string;
  candidateId: string;
  jobId: string;
  interviewDate: string;
  interviewTime: string;
  mode: "online" | "office" | "phone";
  location?: string;
  notes?: string;
}) {
  try {
    const interview = await PipelineService.scheduleInterview(data);
    return { success: true, data: interview, message: "Interview scheduled successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to schedule interview.";
    return { success: false, error: errMessage };
  }
}

export async function updateMedicalTrackingAction(data: {
  applicationId: string;
  candidateId: string;
  status: "pending" | "passed" | "failed";
  medicalDate?: string;
  medicalCenter?: string;
  remarks?: string;
}) {
  try {
    const record = await PipelineService.updateMedicalTracking(data);
    return { success: true, data: record, message: `Medical status updated to ${data.status.toUpperCase()}` };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update medical tracking.";
    return { success: false, error: errMessage };
  }
}

export async function updateVisaTrackingAction(data: {
  applicationId: string;
  candidateId: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  visaNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  remarks?: string;
}) {
  try {
    const record = await PipelineService.updateVisaTracking(data);
    return { success: true, data: record, message: `Visa status updated to ${data.status.toUpperCase()}` };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update visa tracking.";
    return { success: false, error: errMessage };
  }
}

export async function issueFlightTicketAction(data: {
  applicationId: string;
  candidateId: string;
  airline: string;
  flightNumber?: string;
  departureDate?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  pnr?: string;
  seat?: string;
  ticketPdfKey?: string;
}) {
  try {
    const ticket = await PipelineService.issueTicket(data);
    return { success: true, data: ticket, message: "Flight ticket issued successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to issue flight ticket.";
    return { success: false, error: errMessage };
  }
}

export async function getCandidatePipelineAction(candidateId: string) {
  try {
    const pipelineData = await PipelineService.getCandidatePipelineDetails(candidateId);
    return { success: true, data: pipelineData };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch candidate pipeline.";
    return { success: false, error: errMessage };
  }
}
