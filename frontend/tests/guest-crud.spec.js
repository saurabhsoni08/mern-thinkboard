import { test, expect } from "@playwright/test";

test.use({
  reducedMotion: "reduce",
  actionTimeout: 10000,
});

test(
  "guest user can create, edit, persist, and delete a note",
  async ({ page }) => {
  const originalTitle = "Playwright CRUD Test";
  const originalContent = "This note is created by Playwright.";

  const updatedTitle = "Updated Playwright Note";
  const updatedContent =
    "This note was successfully edited by Playwright.";

  // --------------------------------------------------
  // 1. Open NotesLab
  // --------------------------------------------------

  await page.goto("/");

  // --------------------------------------------------
  // 2. Create a guest note
  // --------------------------------------------------

  await page.getByRole("link", { name: /new note/i }).click();

  await expect(page).toHaveURL(/\/create/);

  await page.getByLabel(/title/i).fill(originalTitle);

  await page
    .getByLabel(/content/i)
    .fill(originalContent);

  await page
    .getByRole("button", { name: /create note/i })
    .click();

  // --------------------------------------------------
  // 3. Verify note appears on homepage
  // --------------------------------------------------

  await expect(page).toHaveURL("/");

  await expect(
    page.getByText(originalTitle, { exact: true })
  ).toBeVisible({
    timeout: 15000,
  });

  // --------------------------------------------------
  // 4. Refresh and verify persistence
  // --------------------------------------------------

  await page.reload();

  await expect(
    page.getByText(originalTitle, { exact: true })
  ).toBeVisible({
    timeout: 15000,
  });

  // --------------------------------------------------
  // 5. Open the note
  // --------------------------------------------------

  const noteTitle = page.getByText(originalTitle, {
    exact: true,
  });

  await expect(noteTitle).toBeVisible({
    timeout: 15000,
  });

  await noteTitle.click({
    force: true,
  });

  await expect(page).toHaveURL(/\/note\/.+/, {
    timeout: 10000,
  });

  // --------------------------------------------------
  // 6. Edit the note
  // --------------------------------------------------

  const titleInput = page.getByLabel(/title/i);
  const contentInput = page.getByLabel(/content/i);

  await expect(titleInput).toBeVisible({
    timeout: 10000,
  });

  await expect(contentInput).toBeVisible({
    timeout: 10000,
  });

  await titleInput.fill(updatedTitle, {
    force: true,
  });

  await contentInput.fill(updatedContent, {
    force: true,
  });

  const saveButton = page.getByRole("button", {
    name: "Save Changes",
    exact: true,
  });

  await expect(saveButton).toBeVisible({
    timeout: 10000,
  });

  await expect(saveButton).toBeEnabled();

  await saveButton.click({
    force: true,
  });

  // --------------------------------------------------
  // 7. Verify we returned to homepage
  // --------------------------------------------------

  await expect(page).toHaveURL("/");

  await expect(
    page.getByText(updatedTitle, { exact: true })
  ).toBeVisible({
    timeout: 15000,
  });

  // Old title should no longer exist
  await expect(
    page.getByText(originalTitle, { exact: true })
  ).toHaveCount(0);

  // --------------------------------------------------
  // 8. Refresh and verify edited note persists
  // --------------------------------------------------

  await page.reload();

  await expect(
    page.getByText(updatedTitle, { exact: true })
  ).toBeVisible({
    timeout: 15000,
  });

  // --------------------------------------------------
  // 9. Open the edited note again
  // --------------------------------------------------

  await page
    .getByText(updatedTitle, { exact: true })
    .click({
      force: true,
    });

  await expect(page).toHaveURL(/\/note\/.+/, {
    timeout: 10000,
  });

  // --------------------------------------------------
  // 10. Verify edited content
  // --------------------------------------------------

  await expect(
    page.getByLabel(/title/i)
  ).toHaveValue(updatedTitle);

  await expect(
    page.getByLabel(/content/i)
  ).toHaveValue(updatedContent);

// --------------------------------------------------
// 11. Delete the note
// --------------------------------------------------

const deleteButton = page.getByTestId("delete-note-button");

await expect(deleteButton).toBeVisible({
  timeout: 10000,
});

await deleteButton.click({
  force: true,
});

// --------------------------------------------------
// 12. Confirm deletion
// --------------------------------------------------

const deleteDialog = page.getByTestId("delete-note-dialog");

await expect(deleteDialog).toBeVisible({
  timeout: 10000,
});

const confirmDeleteButton = page.getByTestId(
  "confirm-delete-button"
);

await expect(confirmDeleteButton).toBeVisible({
  timeout: 10000,
});

await expect(confirmDeleteButton).toBeEnabled();

await confirmDeleteButton.click({
  force: true,
});

 // --------------------------------------------------
// 13. Verify note is gone
// --------------------------------------------------

await expect(page).toHaveURL("/");

await expect(
  page.getByText(updatedTitle, { exact: true })
).toHaveCount(0);

// --------------------------------------------------
// 14. Refresh and make sure it stays deleted
// --------------------------------------------------

await page.reload();

await expect(
  page.getByText(updatedTitle, { exact: true })
).toHaveCount(0);
});