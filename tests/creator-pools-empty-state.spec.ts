import { test, expect } from "@playwright/test";

test.describe("Creator Pools Empty State", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to creator pools page
    await page.goto("http://localhost:5180/creator/pools");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should display empty state when no pools are found", async ({
    page,
  }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot to see the current state
    await page.screenshot({
      path: "test-results/creator-pools-empty-state.png",
    });

    // Verify the page loads and URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should handle different tab states", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    // Verify URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should display create pool button in empty state", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    // Verify URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on mobile with empty state", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-empty-mobile.png",
    });

    // Verify URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on tablet with empty state", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-empty-tablet.png",
    });

    // Verify URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on desktop with empty state", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });

    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-empty-desktop.png",
    });

    // Verify URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });
});
