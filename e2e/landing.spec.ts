import { test, expect } from "@playwright/test";

test.describe("Landing Page E2E Tests", () => {
  test("should render home page with Ghazi Overseas branding and OEP license", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ghazi Overseas Employment/i);
    await expect(page.getByText(/GHAZI/i).first()).toBeVisible();
    await expect(page.getByText(/O.E.P LIC No. 2636\/KARACHI/i).first()).toBeVisible();
  });

  test("should display primary candidate application call to action buttons", async ({ page }) => {
    await page.goto("/");
    const applyButton = page.getByRole("link", { name: /Apply Now/i }).first();
    await expect(applyButton).toBeVisible();
  });

  test("should display 4 feature cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Secure Document Upload/i).first()).toBeVisible();
    await expect(page.getByText(/Application Tracking/i).first()).toBeVisible();
    await expect(page.getByText(/Fast Approval/i).first()).toBeVisible();
    await expect(page.getByText(/Licensed Recruitment/i).first()).toBeVisible();
  });
});
