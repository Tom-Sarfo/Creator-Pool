import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display sign up form", async ({ page }) => {
    await page.goto("/signup");

    // Check for form elements
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /password/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
  });

  test("should display login form", async ({ page }) => {
    await page.goto("/login");

    // Check for form elements
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: /password/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should allow role selection for creators", async ({ page }) => {
    await page.goto("/signup");

    // Check for role selection
    await expect(page.getByRole("radio", { name: /creator/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /predictor/i })).toBeVisible();
  });

  test("should validate form inputs", async ({ page }) => {
    await page.goto("/signup");

    // Try to submit empty form
    await page.getByRole("button", { name: /sign up/i }).click();

    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });
});
