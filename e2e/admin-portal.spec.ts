import { test, expect } from "@playwright/test";

test.describe("Admin Portal Pages E2E Tests", () => {
  test.beforeEach(async ({ context }) => {
    // Set admin authenticated session cookie to bypass middleware redirect
    await context.addCookies([
      {
        name: "better-auth.session_token",
        value: "test_admin_verified_session_token",
        url: "http://localhost:3000",
      },
    ]);
  });

  test("should render Admin Dashboard with 8 summary metric cards", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page.getByText(/Admin Intelligence Control Center|Admin Control Center/i).first()).toBeVisible();
    await expect(page.getByText(/Total Candidates/i).first()).toBeVisible();
    await expect(page.getByText(/Pending Applications/i).first()).toBeVisible();
    await expect(page.getByText(/Approved Applications/i).first()).toBeVisible();
    await expect(page.getByText(/R2 Storage Used/i).first()).toBeVisible();
  });

  test("should render Application Management directory", async ({ page }) => {
    await page.goto("/admin/applications");
    await expect(page.getByRole("heading", { name: /Application Management Directory/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Search by Name, CNIC, Passport/i)).toBeVisible();
  });

  test("should render Application Detail page with administrative decision actions", async ({ page }) => {
    await page.goto("/admin/applications/cand_1");
    await expect(page.getByRole("heading", { name: /Full Candidate Profile/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Approve Application/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Reject Application/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Return for Correction/i })).toBeVisible();
  });

  test("should render Payment Verification queue page", async ({ page }) => {
    await page.goto("/admin/payments");
    await expect(page.getByRole("heading", { name: /Payment Verification Queue/i })).toBeVisible();
  });

  test("should render R2 Document Storage Vault page", async ({ page }) => {
    await page.goto("/admin/documents");
    await expect(page.getByRole("heading", { name: /Cloudflare R2 Document Storage Vault/i })).toBeVisible();
  });

  test("should render Admin Settings page with payment method toggles", async ({ page }) => {
    await page.goto("/admin/settings");
    await expect(page.getByRole("heading", { name: /Admin Portal Settings & Feature Controls/i })).toBeVisible();
    await expect(page.getByLabel(/Enable Mandatory Application Submission Fee/i)).toBeVisible();
  });

  test("should render Admin Users page", async ({ page }) => {
    await page.goto("/admin/admins");
    await expect(page.getByRole("heading", { name: /Admin User Management & RBAC Roles/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Create Admin Account/i })).toBeVisible();
  });

  test("should render System Audit Log Explorer", async ({ page }) => {
    await page.goto("/admin/logs");
    await expect(page.getByRole("heading", { name: /System Audit Log Explorer/i })).toBeVisible();
  });

  test("should render Recruitment Analytics & Charts page", async ({ page }) => {
    await page.goto("/admin/analytics");
    await expect(page.getByRole("heading", { name: /Recruitment Analytics & Trend Intelligence/i })).toBeVisible();
    await expect(page.getByText(/Top Candidate Trade Professions/i).first()).toBeVisible();
  });
});
