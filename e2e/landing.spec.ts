import { test, expect } from "@playwright/test";

test.describe("Landing Page E2E Tests", () => {
  test("should render home page with Ghazi Overseas branding and government license", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ghazi Overseas Employment Pakistan/);
    await expect(page.getByText(/Ghazi Overseas Employment/i).first()).toBeVisible();
    await expect(page.getByText(/License # OPEP-1234/i).first()).toBeVisible();
  });

  test("should display primary candidate application call to actions", async ({ page }) => {
    await page.goto("/");
    const applyButton = page.getByRole("link", { name: /Apply Now|Start Candidate Application/i }).first();
    await expect(applyButton).toBeVisible();
  });
});
