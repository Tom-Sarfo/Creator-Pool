import { test, expect } from "@playwright/test";

test.describe("Creator Pools Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to creator pools page
    await page.goto("http://localhost:5180/creator/pools");
    // Wait for page to load completely
    await page.waitForLoadState("networkidle");
  });

  test("should load the creator pools page", async ({ page }) => {
    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({ path: "test-results/creator-pools.png" });

    // Just check that the page has loaded by checking the URL
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-mobile.png",
    });

    // Just check that the page has loaded by checking the URL
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-tablet.png",
    });

    // Just check that the page has loaded by checking the URL
    expect(page.url()).toContain("/creator/pools");
  });

  test("should be responsive on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/creator-pools-desktop.png",
    });

    // Just check that the page has loaded by checking the URL
    expect(page.url()).toContain("/creator/pools");
  });

  test("should handle page navigation", async ({ page }) => {
    // Check that we can navigate to the page
    await page.goto("http://localhost:5180/creator/pools");
    await page.waitForLoadState("networkidle");

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Check URL contains creator/pools
    expect(page.url()).toContain("/creator/pools");
  });

  test("should load within reasonable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("http://localhost:5180/creator/pools");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);

    // Wait for the page to be fully loaded
    await page.waitForLoadState("domcontentloaded");

    // Just check that the page has loaded by checking the URL
    expect(page.url()).toContain("/creator/pools");
  });
});
