import { test, expect } from "@playwright/test";

test.describe("Candidate Portal Pages E2E Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    // Set authenticated session cookie to bypass middleware redirect
    await context.addCookies([
      {
        name: "better-auth.session_token",
        value: "test_verified_session_token",
        domain: "localhost",
        path: "/",
      },
    ]);
  });

  test("should render Candidate Dashboard page", async ({ page }) => {
    await page.goto("/candidate/dashboard");
    await expect(page.getByText(/Welcome to Candidate Portal/i).first()).toBeVisible();
    await expect(page.getByText(/Application Status/i).first()).toBeVisible();
    await expect(page.getByText(/Documents Uploaded/i).first()).toBeVisible();
    await expect(page.getByText(/Payment Status/i).first()).toBeVisible();
  });

  test("should render Upload Documents page", async ({ page }) => {
    await page.goto("/candidate/documents");
    await expect(page.getByRole("heading", { name: /Upload Required Documents/i })).toBeVisible();
    await expect(page.getByText(/Original Passport Copy/i).first()).toBeVisible();
  });

  test("should render Application Review page with dynamic payment instructions", async ({ page }) => {
    await page.goto("/candidate/application");
    await expect(page.getByRole("heading", { name: /My Candidate Application/i })).toBeVisible();
    await expect(page.getByText(/Meezan Bank Limited/i).first()).toBeVisible();
    await expect(page.getByText(/EasyPaisa Mobile Wallet/i).first()).toBeVisible();
    await expect(page.getByText(/JazzCash Mobile Wallet/i).first()).toBeVisible();
  });

  test("should render Payment Verification page", async ({ page }) => {
    await page.goto("/candidate/payment");
    await expect(page.getByRole("heading", { name: /Application Fee Payment Verification/i })).toBeVisible();
    await expect(page.getByLabel(/Transaction Reference ID/i)).toBeVisible();
  });

  test("should render Candidate Tracker 6-step timeline", async ({ page }) => {
    await page.goto("/candidate/tracker");
    await expect(page.getByRole("heading", { name: /Application Status Tracker/i })).toBeVisible();
    await expect(page.getByText(/1. Registration Complete/i)).toBeVisible();
    await expect(page.getByText(/6. Application Approved/i)).toBeVisible();
  });
});
