import { test, expect } from "@playwright/test";

test.describe("Phase 4 — Jobs, Recruitment Pipeline & CMS E2E Tests", () => {
  test("should render Public Jobs Directory and filter controls", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.getByRole("heading", { name: /Explore Verified Jobs Overseas/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search job title, company, or trade/i)).toBeVisible();
  });

  test("should render Job Details page with benefits checklist and Apply button", async ({ page }) => {
    await page.goto("/jobs/heavy-duty-driver-saudi-arabia");
    await expect(page.getByRole("heading", { name: /Heavy Duty Truck Driver/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Apply For This Job/i })).toBeVisible();
  });

  test("should render Public Contact page with inquiry form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /Contact Ghazi Overseas/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Submit Official Message/i })).toBeVisible();
  });

  test("should render Admin Jobs Management Console", async ({ page }) => {
    await page.goto("/admin/jobs");
    await expect(page.getByRole("heading", { name: /Job Management Console/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Post New Job Vacancy/i })).toBeVisible();
  });

  test("should render Admin 9-Stage Recruitment Pipeline Board", async ({ page }) => {
    await page.goto("/admin/pipeline");
    await expect(page.getByRole("heading", { name: /9-Stage Recruitment Pipeline Board/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Interview/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Flight Ticket/i }).first()).toBeVisible();
  });

  test("should render Admin Website CMS Manager", async ({ page }) => {
    await page.goto("/admin/cms");
    await expect(page.getByRole("heading", { name: /Website CMS Content Manager/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Hero Banner/i })).toBeVisible();
  });

  test("should render Admin Contact Inquiries Console", async ({ page }) => {
    await page.goto("/admin/contacts");
    await expect(page.getByRole("heading", { name: /Public Website Inquiries Console/i })).toBeVisible();
  });

  test("should render Admin Announcements Console", async ({ page }) => {
    await page.goto("/admin/announcements");
    await expect(page.getByRole("heading", { name: /Agency Announcements Console/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Publish Announcement/i })).toBeVisible();
  });

  test("should render Candidate 9-Stage Pipeline Tracker", async ({ page }) => {
    await page.goto("/candidate/tracker");
    await expect(page.getByRole("heading", { name: /Recruitment Pipeline Tracker/i })).toBeVisible();
    await expect(page.getByText(/9-Stage Recruitment Progression Timeline/i)).toBeVisible();
  });
});
