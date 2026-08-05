import { test, expect } from "@playwright/test";

test.describe("Build & Health Check Tests", () => {
  test("should return 200 OK from health check endpoint", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.company).toBe("Ghazi Overseas Employment Pakistan");
  });
});
