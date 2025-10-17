import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should display the main hero section", async ({ page }) => {
    await page.goto("/");

    // Check for main headline
    await expect(
      page.getByRole("heading", { name: /predict youtube video performance/i })
    ).toBeVisible();

    // Check for CTA buttons
    await expect(
      page.getByRole("button", { name: /get started/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /explore pools/i })
    ).toBeVisible();
  });

  test("should display how it works section", async ({ page }) => {
    await page.goto("/");

    // Check for section title
    await expect(
      page.getByRole("heading", { name: /how creator pool works/i })
    ).toBeVisible();

    // Check for the three steps
    await expect(page.getByText(/creators create pools/i)).toBeVisible();
    await expect(page.getByText(/fans make predictions/i)).toBeVisible();
    await expect(page.getByText(/earn rewards/i)).toBeVisible();
  });

  test("should display statistics section", async ({ page }) => {
    await page.goto("/");

    // Check for key statistics
    await expect(page.getByText(/10k\+/i)).toBeVisible();
    await expect(page.getByText(/500\+/i)).toBeVisible();
    await expect(page.getByText(/\$2m\+/i)).toBeVisible();
    await expect(page.getByText(/85%/i)).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check that main elements are still visible
    await expect(
      page.getByRole("heading", { name: /predict youtube video performance/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /get started/i })
    ).toBeVisible();
  });
});
