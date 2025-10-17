import { test, expect } from "@playwright/test";

test.describe("Authentication Setup", () => {
  test("should display sign up page", async ({ page }) => {
    await page.goto("/signup");

    // Check that the page loads
    await expect(page).toHaveTitle(/Sign Up - Creator Pool/);

    // Check for Creator Pool branding
    await expect(page.getByText("Creator Pool")).toBeVisible();

    // Check for sign up form (Clerk component)
    await expect(page.getByText("Create your account")).toBeVisible();
  });

  test("should display login page", async ({ page }) => {
    await page.goto("/login");

    // Check that the page loads
    await expect(page).toHaveTitle(/Sign In - Creator Pool/);

    // Check for Creator Pool branding
    await expect(page.getByText("Creator Pool")).toBeVisible();

    // Check for sign in form (Clerk component)
    await expect(page.getByText("Sign in to your account")).toBeVisible();
  });

  test("should display pools page", async ({ page }) => {
    await page.goto("/pools");

    // Check that the page loads
    await expect(page).toHaveTitle(/Active Pools - Creator Pool/);

    // Check for Creator Pool branding
    await expect(page.getByText("Creator Pool")).toBeVisible();

    // Check for main content
    await expect(page.getByText("Active Pools")).toBeVisible();
  });

  test("should display dashboard page", async ({ page }) => {
    await page.goto("/dashboard");

    // Check that the page loads
    await expect(page).toHaveTitle(/Dashboard - Creator Pool/);

    // Check for Creator Pool branding
    await expect(page.getByText("Creator Pool")).toBeVisible();
  });
});
