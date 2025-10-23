import { test, expect } from "@playwright/test";

test.describe("Debug Page Elements", () => {
  test("should inspect what elements are available on creator dashboard", async ({
    page,
  }) => {
    // Navigate to creator dashboard
    await page.goto("http://localhost:5180/creator");
    await page.waitForLoadState("networkidle");

    // Wait a bit more for React to render
    await page.waitForTimeout(3000);

    // Take a screenshot to see what's actually there
    await page.screenshot({
      path: "test-results/debug-page.png",
      fullPage: true,
    });

    // Check what buttons are available
    const buttons = await page.locator("button").all();
    console.log(`Found ${buttons.length} buttons on the page`);

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button ${i}: "${text}" (visible: ${isVisible})`);
    }

    // Check for any text containing "Enable Pool"
    const enablePoolElements = await page.locator('text="Enable Pool"').all();
    console.log(
      `Found ${enablePoolElements.length} elements containing "Enable Pool"`
    );

    // Check for any text containing "Pool"
    const poolElements = await page.locator('text="Pool"').all();
    console.log(`Found ${poolElements.length} elements containing "Pool"`);

    // Check page title
    const title = await page.title();
    console.log(`Page title: "${title}"`);

    // Check if there are any videos or content
    const videoElements = await page
      .locator('[class*="video"], [class*="card"], [class*="item"]')
      .all();
    console.log(`Found ${videoElements.length} potential video/card elements`);

    // Just verify the page loads
    expect(title).toContain("Creator Dashboard");
  });
});
