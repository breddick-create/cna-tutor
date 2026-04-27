import { test, expect, Page } from "@playwright/test";

const BASE = "https://cna-tutor.vercel.app";

const username = `e2eccma${Date.now()}`;
const password = "TestPass123!";

async function fillAndSubmitSignUp(page: Page) {
  await page.goto(`${BASE}/sign-up`);
  await page.selectOption("#product", "ccma");
  await page.fill("#full_name", "E2E CCMA Test");
  await page.fill("#username", username);
  await page.fill("#cohort", "E2E Cohort");
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}

async function signIn(page: Page) {
  await page.goto(`${BASE}/sign-in`);
  await page.selectOption("#product", "ccma");
  await page.fill("#username", username);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}

async function selectFirstRadioPerFieldset(page: Page) {
  const fieldsets = await page.locator("fieldset").all();
  for (const fieldset of fieldsets) {
    const firstRadio = fieldset.locator('input[type="radio"]').first();
    await firstRadio.check();
  }
}

test.describe("CCMA student journey", () => {
  test("1. sign up creates account and redirects to sign-in", async ({ page }) => {
    await fillAndSubmitSignUp(page);
    await expect(page).toHaveURL(/sign-in/);
    const message = page.locator("text=/account is ready/i");
    await expect(message).toBeVisible({ timeout: 10_000 });
  });

  test("2. sign in redirects new CCMA user to ccma pretest", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await expect(page).toHaveURL(/\/ccma\/pretest/, { timeout: 15_000 });
  });

  test("3. ccma pretest page shows embedded assessment runner", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/ccma\/pretest/, { timeout: 15_000 });

    // The pretest runner is embedded on the page at #ccma-pretest-runner
    const runner = page.locator("#ccma-pretest-runner");
    await expect(runner).toBeVisible({ timeout: 10_000 });

    // Should have fieldsets with radio inputs
    const firstFieldset = page.locator("fieldset").first();
    await expect(firstFieldset).toBeVisible({ timeout: 10_000 });
  });

  test("4. complete ccma pretest and land on results page", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/ccma\/pretest/, { timeout: 15_000 });

    // Scroll to the embedded runner
    await page.evaluate(() => {
      const el = document.getElementById("ccma-pretest-runner");
      if (el) el.scrollIntoView();
    });

    // Select first answer for every question
    await selectFirstRadioPerFieldset(page);

    // Submit
    const submitBtn = page.getByRole("button", { name: /Finish pre-test/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Should redirect to results
    await expect(page).toHaveURL(/\/ccma\/pretest\/results/, { timeout: 30_000 });
  });

  test("5. after ccma pretest, dashboard shows readiness score", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/ccma\/pretest/, { timeout: 15_000 });
    await selectFirstRadioPerFieldset(page);
    await page.getByRole("button", { name: /Finish pre-test/i }).click();
    await page.waitForURL(/\/ccma\/pretest\/results/, { timeout: 30_000 });

    // Navigate to CCMA dashboard
    await page.goto(`${BASE}/ccma/dashboard`);
    await expect(page).toHaveURL(/\/ccma\/dashboard/, { timeout: 10_000 });
    const readinessHeading = page.getByText(/readiness/i).first();
    await expect(readinessHeading).toBeVisible({ timeout: 10_000 });
  });

  test("6. starting a ccma lesson creates a session (URL contains UUID)", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/ccma\/pretest/, { timeout: 15_000 });
    await selectFirstRadioPerFieldset(page);
    await page.getByRole("button", { name: /Finish pre-test/i }).click();
    await page.waitForURL(/\/ccma\/pretest\/results/, { timeout: 30_000 });

    // Go to CCMA study page
    await page.goto(`${BASE}/ccma/study`);
    await expect(page).toHaveURL(/\/ccma\/study$/, { timeout: 10_000 });

    const continueBtn = page.getByRole("link", { name: /Continue/i }).first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await page.getByRole("button", { name: /(Start|Begin|Continue)/i }).first().click();
    }

    // Session URL: /ccma/study/{uuid}
    await expect(page).toHaveURL(/\/ccma\/study\/[0-9a-f-]{36}/, { timeout: 20_000 });
  });
});
