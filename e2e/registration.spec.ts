import { expect, test } from '@playwright/test';

/**
 * End-to-end happy path for the registration prototype: fill every field with valid
 * data, submit, and assert the collected form result is logged to the console
 * (there is no backend yet).
 */
test('register logs the submitted form result to the console', async ({ page }) => {
  const loggedResults: Record<string, unknown>[] = [];

  page.on('console', async (message) => {
    if (!message.text().includes('Registration form result')) {
      return;
    }

    const args = await Promise.all(message.args().map((arg) => arg.jsonValue()));
    const result = args.find((value): value is Record<string, unknown> => typeof value === 'object' && value !== null);

    if (result) {
      loggedResults.push(result);
    }
  });

  await page.goto('/register');

  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Last name').fill('Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByLabel('Password', { exact: true }).fill('supersecret');
  await page.getByLabel('Confirm password').fill('supersecret');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect
    .poll(() => loggedResults.at(-1))
    .toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      password: 'supersecret',
      confirmPassword: 'supersecret',
    });
});
