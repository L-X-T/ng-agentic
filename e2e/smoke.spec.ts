import { expect, test } from '@playwright/test';

/**
 * Smoke test: verifies Playwright launches a browser and the app responds.
 * Intentionally minimal — it asserts the setup works, not app behavior.
 */
test('app loads and renders the root component', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle(/NG Agentic Engineering/);
  await expect(page.locator('app-root')).toBeVisible();
});
