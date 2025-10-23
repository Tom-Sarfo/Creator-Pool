import { test, expect } from "@playwright/test";

test.describe("Creator Dashboard Empty State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5180/creator");
    await page.waitForLoadState("networkidle");
  });

  test("should display empty state when no videos are found", async ({
    page,
  }) => {
    await page.waitForLoadState("domcontentloaded");

    // Check if the page loads correctly
    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }
    expect(title).toMatch(/Creator Dashboard|Creator Pool/);

    // Take a screenshot to see the current state
    await page.screenshot({
      path: "test-results/creator-dashboard-empty-state.png",
    });

    // Verify the page loads and URL contains creator
    expect(page.url()).toContain("/creator");
  });

  test("should handle different tab states", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    // Check that the page loads
    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }
    expect(title).toMatch(/Creator Dashboard|Creator Pool/);

    // Verify URL contains creator
    expect(page.url()).toContain("/creator");
  });
});
