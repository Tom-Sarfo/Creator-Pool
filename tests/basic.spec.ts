import { test, expect } from "@playwright/test";

test.describe("Basic Landing Page", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Check that the page loads
    await expect(page).toHaveTitle(/Creator Pool/);

    // Check for main heading
    await expect(
      page.getByText(/Predict YouTube Video Performance/)
    ).toBeVisible();
  });

  test("should display creator pool logo", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Check for logo
    await expect(page.getByText("Creator Pool")).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("http://localhost:5173");

    // Check for navigation elements
    await expect(page.getByText("Explore Pools")).toBeVisible();
    await expect(page.getByText("Login")).toBeVisible();
    await expect(page.getByText("Sign Up")).toBeVisible();
  });
});
