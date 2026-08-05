"use server";

import { JobService, JobInput } from "@/services/job.service";
import { PipelineService } from "@/services/pipeline.service";

export async function createJobAction(input: JobInput) {
  try {
    const job = await JobService.createJob(input);
    return { success: true, data: job };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create job.";
    return { success: false, error: errMessage };
  }
}

export async function updateJobAction(id: string, input: Partial<JobInput>) {
  try {
    const updated = await JobService.updateJob(id, input);
    return { success: true, data: updated };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update job.";
    return { success: false, error: errMessage };
  }
}

export async function deleteJobAction(id: string) {
  try {
    await JobService.deleteJob(id);
    return { success: true, message: "Job deleted successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to delete job.";
    return { success: false, error: errMessage };
  }
}

export async function duplicateJobAction(id: string) {
  try {
    const duplicated = await JobService.duplicateJob(id);
    return { success: true, data: duplicated };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to duplicate job.";
    return { success: false, error: errMessage };
  }
}

export async function getPublicJobsAction(filters?: {
  search?: string;
  country?: string;
  trade?: string;
  status?: string;
  sortBy?: "newest" | "salary";
}) {
  try {
    const jobsList = await JobService.getAllJobs(filters);
    return { success: true, data: jobsList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch jobs.";
    return { success: false, error: errMessage };
  }
}

export async function getJobDetailsAction(slug: string) {
  try {
    const job = await JobService.getJobBySlug(slug);
    return { success: true, data: job };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch job details.";
    return { success: false, error: errMessage };
  }
}

export async function applyToJobAction(candidateId: string, jobId: string) {
  try {
    const application = await PipelineService.applyToJob(candidateId, jobId);
    return { success: true, data: application, message: "Application submitted successfully to Ghazi Overseas." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to submit job application.";
    return { success: false, error: errMessage };
  }
}
