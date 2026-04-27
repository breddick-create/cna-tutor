import { test, expect, Page } from "@playwright/test";

const BASE = "https://cna-tutor.vercel.app";

// Unique username per run so we don't collide on reruns
const username = `e2ecna${Date.now()}`;
const password = "TestPass123!";

async function fillAndSubmitSignUp(page: Page) {
  await page.goto(`${BASE}/sign-up`);
  await page.selectOption("#product", "cna");
  await page.fill("#full_name", "E2E CNA Test");
  await page.fill("#username", username);
  await page.fill("#cohort", "E2E Cohort");
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}

async function signIn(page: Page) {
  await page.goto(`${BASE}/sign-in`);
  await page.selectOption("#product", "cna");
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

test.describe("CNA student journey", () => {
  test("1. sign up creates account and redirects to sign-in", async ({ page }) => {
    await fillAndSubmitSignUp(page);
    await expect(page).toHaveURL(/sign-in/);
    const message = page.locator("text=/account is ready/i");
    await expect(message).toBeVisible({ timeout: 10_000 });
  });

  test("2. sign in redirects new CNA user to pretest", async ({ page }) => {
    // Account may already exist from test 1; create it if not
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await expect(page).toHaveURL(/\/pretest/, { timeout: 15_000 });
  });

  test("3. pretest intro page shows Start Pre-Test Now link", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/pretest/, { timeout: 15_000 });
    const startLink = page.getByRole("link", { name: /Start Pre-Test Now/i });
    await expect(startLink).toBeVisible();
  });

  test("4. complete pretest and land on results page", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/pretest/, { timeout: 15_000 });

    // Navigate to pretest start
    await page.getByRole("link", { name: /Start Pre-Test Now/i }).click();
    await expect(page).toHaveURL(/\/pretest\/start/, { timeout: 10_000 });

    // Select first answer for every question
    await selectFirstRadioPerFieldset(page);

    // Submit
    const submitBtn = page.getByRole("button", { name: /Finish pre-test/i });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Should redirect to results
    await expect(page).toHaveURL(/\/pretest\/results/, { timeout: 30_000 });
  });

  test("5. after pretest, dashboard shows readiness score", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/pretest/, { timeout: 15_000 });
    await page.getByRole("link", { name: /Start Pre-Test Now/i }).click();
    await page.waitForURL(/\/pretest\/start/, { timeout: 10_000 });
    await selectFirstRadioPerFieldset(page);
    await page.getByRole("button", { name: /Finish pre-test/i }).click();
    await page.waitForURL(/\/pretest\/results/, { timeout: 30_000 });

    // Navigate to dashboard
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // Dashboard should show some readiness metric
    const readinessHeading = page.getByText(/readiness/i).first();
    await expect(readinessHeading).toBeVisible({ timeout: 10_000 });
  });

  test("6. starting a lesson creates a session (URL contains session UUID)", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/pretest/, { timeout: 15_000 });
    await page.getByRole("link", { name: /Start Pre-Test Now/i }).click();
    await page.waitForURL(/\/pretest\/start/, { timeout: 10_000 });
    await selectFirstRadioPerFieldset(page);
    await page.getByRole("button", { name: /Finish pre-test/i }).click();
    await page.waitForURL(/\/pretest\/results/, { timeout: 30_000 });

    // Go to study page and start a lesson
    await page.goto(`${BASE}/study`);
    await expect(page).toHaveURL(/\/study$/, { timeout: 10_000 });

    // Find and click the primary lesson CTA
    const continueBtn = page
      .getByRole("link", { name: /Continue/i })
      .first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      // Fallback: look for any Start/Begin button
      await page.getByRole("button", { name: /(Start|Begin|Continue)/i }).first().click();
    }

    // Session URL pattern: /study/{uuid}
    await expect(page).toHaveURL(/\/study\/[0-9a-f-]{36}/, { timeout: 20_000 });
  });

  test("7. submitting a tutor answer advances the session", async ({ page }) => {
    await fillAndSubmitSignUp(page).catch(() => {});
    await signIn(page);
    await page.waitForURL(/\/pretest/, { timeout: 15_000 });
    await page.getByRole("link", { name: /Start Pre-Test Now/i }).click();
    await page.waitForURL(/\/pretest\/start/, { timeout: 10_000 });
    await selectFirstRadioPerFieldset(page);
    await page.getByRole("button", { name: /Finish pre-test/i }).click();
    await page.waitForURL(/\/pretest\/results/, { timeout: 30_000 });

    await page.goto(`${BASE}/study`);
    const continueBtn = page.getByRole("link", { name: /Continue/i }).first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await page.getByRole("button", { name: /(Start|Begin|Continue)/i }).first().click();
    }
    await page.waitForURL(/\/study\/[0-9a-f-]{36}/, { timeout: 20_000 });

    // The tutor session should show a question or prompt
    // Look for either a textarea (chat input) or radio options
    const textarea = page.locator('textarea').first();
    const radioInputs = page.locator('input[type="radio"]');

    const hasTextarea = await textarea.isVisible().catch(() => false);
    const hasRadio = await radioInputs.first().isVisible().catch(() => false);

    expect(hasTextarea || hasRadio).toBe(true);

    if (hasRadio) {
      await radioInputs.first().check();
      const submitBtn = page.getByRole("button", { name: /(Submit|Check|Continue)/i }).first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        // After submitting, tutor should respond — look for tutor feedback
        await expect(
          page.locator('[class*="tutor"], [data-role="tutor"], .prose, [class*="feedback"]').first()
        ).toBeVisible({ timeout: 20_000 });
      }
    } else if (hasTextarea) {
      await textarea.fill("The nurse aide should wash hands with soap and water for at least 20 seconds.");
      const sendBtn = page.getByRole("button", { name: /(Send|Submit)/i }).first();
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
        await page.waitForTimeout(5_000);
        // After submission, some response content should appear
        const responseContent = page.locator("p, [class*='message'], [class*='response']").nth(1);
        await expect(responseContent).toBeVisible({ timeout: 20_000 });
      }
    }
  });
});
