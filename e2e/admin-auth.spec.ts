import { test, expect } from "@playwright/test";

test.describe("Dedicated Admin Login & Protection System", () => {
  // Override global test-auth header for unauthenticated login tests
  test.use({ extraHTTPHeaders: {} });

  test("should render Admin Login page with ADMIN PORTAL branding and Candidate Login link", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByText(/ADMIN PORTAL/i).first()).toBeVisible();
    await expect(page.getByText(/Secure Administrative Access/i)).toBeVisible();
    
    // Candidate Login link
    const candidateLink = page.getByRole("link", { name: /Candidate Login/i }).first();
    await expect(candidateLink).toBeVisible();
  });

  test("should display Administrator link on Candidate Login page", async ({ page }) => {
    await page.goto("/login");
    const adminLink = page.getByRole("link", { name: /Admin Login/i }).first();
    await expect(adminLink).toBeVisible();
    await adminLink.click();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("should redirect unauthenticated users visiting /admin/dashboard to /admin/login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("should allow Super Admin login with valid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("#admin-email", "admin@ghazioverseas.com");
    await page.fill("#admin-password", "Admin@12345");
    await page.click("button[type='submit']");
    
    // Successfully redirects to /admin/dashboard
    await page.waitForURL(/\/admin\/dashboard/);
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });
});
