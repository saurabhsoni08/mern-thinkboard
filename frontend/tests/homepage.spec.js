import { test, expect } from "@playwright/test";

test("NotesLab homepage loads successfully", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("NotesLab");

  await expect(
    page.getByText("NotesLab", { exact: true }).first()
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /new note/i })
  ).toBeVisible();
});