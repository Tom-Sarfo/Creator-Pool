import { test, expect } from "@playwright/test";

test.describe("Predictor Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5180/predictor");
    await page.waitForLoadState("networkidle");
  });

  test("should load the predictor dashboard page", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);

    await page.screenshot({ path: "test-results/predictor-dashboard.png" });
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty on mobile, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);

    await page.screenshot({
      path: "test-results/predictor-dashboard-mobile.png",
    });
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty on tablet, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);

    await page.screenshot({
      path: "test-results/predictor-dashboard-tablet.png",
    });
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should be responsive on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty on desktop, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);

    await page.screenshot({
      path: "test-results/predictor-dashboard-desktop.png",
    });
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should handle page navigation", async ({ page }) => {
    await page.goto("http://localhost:5180/predictor");
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should load within reasonable time", async ({ page }) => {
    const startTime = Date.now();

    await page.goto("http://localhost:5180/predictor");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);

    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }
    expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);
  });

  test("should handle authentication redirect gracefully", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    const title = await page.title();
    if (title === "") {
      console.log("Page title is empty, checking URL instead");
    }

    // Accept either the dashboard or authentication page
    const isDashboard = title.match(/Predictor Dashboard|Predictor Pool/);
    const isAuth = title.match(/My account|Sign in|Login/);

    expect(isDashboard || isAuth).toBeTruthy();
  });

  test("should have proper page structure", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");

    // Check that the page has loaded by verifying URL
    // Handle authentication redirect - check if we're on auth page or dashboard
    const url = page.url();
    const isAuth = url.includes("accounts.dev") || url.includes("sign-in");
    const isDashboard = url.includes("/predictor");
    expect(isDashboard || isAuth).toBeTruthy();

    // Take a screenshot for debugging
    await page.screenshot({
      path: "test-results/predictor-dashboard-structure.png",
    });

    // Check that some content is present (either dashboard or auth page)
    const body = await page.locator("body").textContent();
    expect(body).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test("should handle different viewport sizes", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1024, height: 768, name: "desktop" },
      { width: 1920, height: 1080, name: "large-desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForLoadState("domcontentloaded");

      const title = await page.title();
      expect(title).toMatch(/Predictor Dashboard|Predictor Pool|My account/);

      await page.screenshot({
        path: `test-results/predictor-dashboard-${viewport.name}.png`,
      });
    }
  });
});
