import { test, expect } from "@playwright/test";

test.describe("Basic Landing Page", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads
    await expect(page).toHaveTitle(/Creator Pool/);

    // Check for main heading
    await expect(
      page.getByText(/Predict YouTube Video Performance/)
    ).toBeVisible();
  });

  test("should display creator pool logo", async ({ page }) => {
    await page.goto("/");

    // Check for logo in header
    await expect(page.getByRole("banner").getByText("Creator Pool")).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");

    // Check for navigation elements in header
    await expect(page.getByRole("banner").getByText("Explore Pools")).toBeVisible();
    await expect(page.getByRole("banner").getByText("Login")).toBeVisible();
    await expect(page.getByRole("banner").getByText("Sign Up")).toBeVisible();
  });
});
