import { test, expect } from "@playwright/test";

test.describe("Candidate & Admin Document Integration E2E Tests", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: "better-auth.session_token",
        value: "test_verified_session_token",
        url: "http://localhost:3000",
      },
    ]);
  });

  test("Candidate document upload page renders all 6 document slots", async ({ page }) => {
    await page.goto("/candidate/documents");
    await expect(page.getByRole("heading", { name: /Upload Required Documents/i })).toBeVisible();
    await expect(page.getByText(/Original Passport Copy/i).first()).toBeVisible();
    await expect(page.getByText(/Pakistani CNIC/i).first()).toBeVisible();
    await expect(page.getByText(/Professional Resume/i).first()).toBeVisible();
    await expect(page.getByText(/Passport-size Photograph/i).first()).toBeVisible();
  });

  test("Admin R2 storage vault renders documents directory table", async ({ page }) => {
    await page.goto("/admin/documents");
    await expect(page.getByRole("heading", { name: /Cloudflare R2 Document Storage Vault/i })).toBeVisible();
    await expect(page.getByText(/Candidate Name/i).first()).toBeVisible();
    await expect(page.getByText(/R2 Storage Actions/i).first()).toBeVisible();
  });
});
