import { test, expect } from "@playwright/test";

test.describe("Authentication Pages E2E Tests", () => {
  test("should render Login page with email and password inputs", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Sign In/i })).toBeVisible();
    await expect(page.getByLabel(/Email Address/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
  });

  test("should render Candidate Registration page with Pakistani CNIC field", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /Candidate Registration/i })).toBeVisible();
    await expect(page.getByLabel(/CNIC Number/i)).toBeVisible();
    await expect(page.getByLabel(/Mobile Phone/i)).toBeVisible();
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=Forgot Password?");
    await expect(page).toHaveURL(/\/forgot-password/);
  });
});
