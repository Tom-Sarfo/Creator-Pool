import { test, expect } from "@playwright/test";

test.describe("Creator Dashboard", () => {
  test("should display creator dashboard layout", async ({ page }) => {
    await page.goto("/creator");

    // Check that the page loads
    await expect(page).toHaveTitle(/Creator Dashboard - Creator Pool/);

    // Check for main heading
    await expect(page.getByText("Welcome back, Creator! 👋")).toBeVisible();

    // Check for stats cards
    await expect(page.getByText("Total Videos")).toBeVisible();
    await expect(page.getByText("Active Pools")).toBeVisible();
    await expect(page.getByText("Total Pledged")).toBeVisible();
    await expect(page.getByText("Total Earnings")).toBeVisible();
  });

  test("should display sidebar navigation on desktop", async ({ page }) => {
    await page.goto("/creator");

    // Check for sidebar navigation items
    await expect(page.getByText("Dashboard")).toBeVisible();
    await expect(page.getByText("Videos")).toBeVisible();
    await expect(page.getByText("Pools")).toBeVisible();
    await expect(page.getByText("Analytics")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
  });

  test("should navigate to videos page", async ({ page }) => {
    await page.goto("/creator");

    // Click on Videos link
    await page.getByText("Videos").click();

    // Check that we're on the videos page
    await expect(page).toHaveTitle(/Video Management - Creator Pool/);
    await expect(page.getByText("Video Management")).toBeVisible();
  });

  test("should navigate to pools page", async ({ page }) => {
    await page.goto("/creator");

    // Click on Pools link
    await page.getByText("Pools").click();

    // Check that we're on the pools page
    await expect(page).toHaveTitle(/Pool Management - Creator Pool/);
    await expect(page.getByText("Pool Management")).toBeVisible();
  });

  test("should navigate to analytics page", async ({ page }) => {
    await page.goto("/creator");

    // Click on Analytics link
    await page.getByText("Analytics").click();

    // Check that we're on the analytics page
    await expect(page).toHaveTitle(/Analytics - Creator Pool/);
    await expect(page.getByText("Analytics")).toBeVisible();
  });

  test("should navigate to settings page", async ({ page }) => {
    await page.goto("/creator");

    // Click on Settings link
    await page.getByText("Settings").click();

    // Check that we're on the settings page
    await expect(page).toHaveTitle(/Settings - Creator Pool/);
    await expect(page.getByText("Settings")).toBeVisible();
  });

  test("should display mobile menu button on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/creator");

    // Check for mobile menu button
    await expect(page.getByRole("button", { name: /menu/i })).toBeVisible();
  });

  test("should show quick action buttons", async ({ page }) => {
    await page.goto("/creator");

    // Check for quick action buttons
    await expect(page.getByText("🎬 Manage Videos")).toBeVisible();
    await expect(page.getByText("🎯 Create New Pool")).toBeVisible();
  });

  test("should display recent videos section", async ({ page }) => {
    await page.goto("/creator");

    // Check for recent videos section
    await expect(page.getByText("Recent Videos")).toBeVisible();
    await expect(page.getByText("View all")).toBeVisible();
  });

  test("should display active pools section", async ({ page }) => {
    await page.goto("/creator");

    // Check for active pools section
    await expect(page.getByText("Active Pools")).toBeVisible();
    await expect(page.getByText("View all")).toBeVisible();
  });
});
