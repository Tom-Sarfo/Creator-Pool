import { test, expect } from "@playwright/test";

test.describe("Predictor Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to predictor dashboard
    await page.goto("/predictor");
  });

  test("should display predictor dashboard layout", async ({ page }) => {
    // Check for main heading
    await expect(page.getByText("Predictor Dashboard")).toBeVisible();

    // Check for sidebar navigation
    await expect(page.getByText("Dashboard")).toBeVisible();
    await expect(page.getByText("Active Pools")).toBeVisible();
    await expect(page.getByText("My Predictions")).toBeVisible();
    await expect(page.getByText("Wallet")).toBeVisible();
    await expect(page.getByText("Profile")).toBeVisible();
  });

  test("should display welcome section", async ({ page }) => {
    // Check for welcome message
    await expect(page.getByText("Welcome back, Predictor! 🎯")).toBeVisible();

    // Check for description
    await expect(
      page.getByText("Ready to make your next prediction?")
    ).toBeVisible();
  });

  test("should display stats cards", async ({ page }) => {
    // Check for stats cards
    await expect(page.getByText("Total Predictions")).toBeVisible();
    await expect(page.getByText("Win Rate")).toBeVisible();
    await expect(page.getByText("Total Earnings")).toBeVisible();
    await expect(page.getByText("Active Predictions")).toBeVisible();
  });

  test("should display quick actions", async ({ page }) => {
    // Check for quick action buttons
    await expect(page.getByText("Browse Active Pools")).toBeVisible();
    await expect(page.getByText("View My Predictions")).toBeVisible();
    await expect(page.getByText("Manage Wallet")).toBeVisible();
  });

  test("should display recent pools section", async ({ page }) => {
    // Check for recent pools heading
    await expect(page.getByText("Recent Pools")).toBeVisible();

    // Check for pool items
    await expect(page.getByText("TechReviewer")).toBeVisible();
    await expect(page.getByText("GamingPro")).toBeVisible();
  });

  test("should display performance insights", async ({ page }) => {
    // Check for performance insights section
    await expect(page.getByText("Performance Insights")).toBeVisible();

    // Check for accuracy by category
    await expect(
      page.getByText("Prediction Accuracy by Category")
    ).toBeVisible();
    await expect(page.getByText("Tech Reviews")).toBeVisible();
    await expect(page.getByText("Gaming Content")).toBeVisible();
  });

  test("should navigate to active pools page", async ({ page }) => {
    // Click on Active Pools in sidebar
    await page.getByText("Active Pools").click();

    // Should navigate to pools page
    await expect(page).toHaveURL("/predictor/pools");
    await expect(page.getByText("Active Pools")).toBeVisible();
  });

  test("should navigate to predictions page", async ({ page }) => {
    // Click on My Predictions in sidebar
    await page.getByText("My Predictions").click();

    // Should navigate to predictions page
    await expect(page).toHaveURL("/predictor/predictions");
    await expect(page.getByText("My Predictions")).toBeVisible();
  });

  test("should navigate to wallet page", async ({ page }) => {
    // Click on Wallet in sidebar
    await page.getByText("Wallet").click();

    // Should navigate to wallet page
    await expect(page).toHaveURL("/predictor/wallet");
    await expect(page.getByText("Wallet")).toBeVisible();
  });

  test("should navigate to profile page", async ({ page }) => {
    // Click on Profile in sidebar
    await page.getByText("Profile").click();

    // Should navigate to profile page
    await expect(page).toHaveURL("/predictor/profile");
    await expect(page.getByText("Profile")).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check for mobile menu button
    await expect(
      page.locator("button").filter({ hasText: /menu/i })
    ).toBeVisible();

    // Check that sidebar is hidden by default
    await expect(page.getByText("Dashboard")).not.toBeVisible();
  });
});
