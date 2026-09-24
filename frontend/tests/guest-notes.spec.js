import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("guest user can create and persist a note", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: /new note/i }).click();

  await expect(page).toHaveURL(/\/create/);

  await page.getByLabel(/title/i).fill("Playwright Test Note");

  await page
    .getByLabel(/content/i)
    .fill("This note was created automatically by Playwright.");

  await page.getByRole("button", { name: /create note/i }).click();

  await expect(page).toHaveURL("/");

  await expect(
    page.getByText("Playwright Test Note", { exact: true })
  ).toBeVisible();

  // Refresh the browser
  await page.reload();

  // Verify the guest note still exists
  await expect(
    page.getByText("Playwright Test Note", { exact: true })
  ).toBeVisible();
});