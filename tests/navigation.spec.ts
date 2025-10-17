import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to sign up page", async ({ page }) => {
    await page.goto("/");

    // Click sign up button
    await page.getByRole("button", { name: /sign up/i }).click();

    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*sign.*up.*/);
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    // Click login button
    await page.getByRole("button", { name: /login/i }).click();

    // Should navigate to login page
    await expect(page).toHaveURL(/.*login.*/);
  });

  test("should navigate to explore pools", async ({ page }) => {
    await page.goto("/");

    // Click explore pools button
    await page.getByRole("button", { name: /explore pools/i }).click();

    // Should navigate to pools page
    await expect(page).toHaveURL(/.*pools.*/);
  });
});
