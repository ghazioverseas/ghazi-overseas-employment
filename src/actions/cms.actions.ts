"use server";

import { CmsService } from "@/services/cms.service";

export async function getCmsSectionAction(sectionKey: string) {
  try {
    const data = await CmsService.getCmsSection(sectionKey);
    return { success: true, data };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch CMS section.";
    return { success: false, error: errMessage };
  }
}

export async function updateCmsSectionAction(sectionKey: string, title: string, subtitle: string, content: Record<string, unknown>) {
  try {
    await CmsService.updateCmsSection(sectionKey, title, subtitle, content);
    return { success: true, message: `CMS section ${sectionKey} updated successfully.` };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to update CMS section.";
    return { success: false, error: errMessage };
  }
}

export async function submitContactFormAction(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const record = await CmsService.submitContactForm(formData);
    return { success: true, data: record, message: "Thank you! Your message has been received by Ghazi Overseas Employment." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to submit contact form.";
    return { success: false, error: errMessage };
  }
}

export async function getAllContactSubmissionsAction() {
  try {
    const data = await CmsService.getAllContactSubmissions();
    return { success: true, data };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch inquiries.";
    return { success: false, error: errMessage };
  }
}

export async function replyToContactSubmissionAction(id: string, replyMessage: string) {
  try {
    const updated = await CmsService.replyToContactSubmission(id, replyMessage);
    return { success: true, data: updated, message: "Reply dispatched successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to reply.";
    return { success: false, error: errMessage };
  }
}

export async function createAnnouncementAction(formData: {
  title: string;
  content: string;
  targetAudience?: string;
  isImportant?: boolean;
}) {
  try {
    const ann = await CmsService.createAnnouncement(formData);
    return { success: true, data: ann, message: "Announcement published successfully." };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to publish announcement.";
    return { success: false, error: errMessage };
  }
}

export async function getAllAnnouncementsAction() {
  try {
    const announcementsList = await CmsService.getAllAnnouncements();
    return { success: true, data: announcementsList };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch announcements.";
    return { success: false, error: errMessage };
  }
}

export async function getUserNotificationsAction(userId: string) {
  try {
    const data = await CmsService.getUserNotifications(userId);
    return { success: true, data };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch notifications.";
    return { success: false, error: errMessage };
  }
}

export async function performGlobalSearchAction(queryStr: string) {
  try {
    const results = await CmsService.performGlobalSearch(queryStr);
    return { success: true, data: results };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to execute global search.";
    return { success: false, error: errMessage };
  }
}
