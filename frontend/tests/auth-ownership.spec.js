import { test, expect } from "@playwright/test";

test("users can only see their own notes", async ({ browser }) => {
  const timestamp = Date.now();

  const apiURL = "http://localhost:5001";

  const userA = {
    name: `Playwright User A ${timestamp}`,
    email: `playwright.user.a.${timestamp}@example.com`,
    password: "Playwright123!",
  };

  const userB = {
    name: `Playwright User B ${timestamp}`,
    email: `playwright.user.b.${timestamp}@example.com`,
    password: "Playwright123!",
  };

  const userANote = `Private Note A ${timestamp}`;
  const userBNote = `Private Note B ${timestamp}`;

  // =========================================================
  // CREATE TWO COMPLETELY ISOLATED BROWSER CONTEXTS
  // =========================================================

  const userAContext = await browser.newContext();
  const userBContext = await browser.newContext();

  const userAPage = await userAContext.newPage();
  const userBPage = await userBContext.newPage();

  try {
    // =========================================================
    // 1. REGISTER USER A
    // =========================================================

    const registerA = await userAContext.request.post(
      `${apiURL}/api/auth/register`,
      {
        data: userA,
      }
    );

    const registerAStatus = registerA.status();
    const registerABody = await registerA.json();

    console.log("User A registration:", registerAStatus);
    console.log("User A:", registerABody);

    expect(registerAStatus).toBe(201);
    expect(registerABody.user).toBeTruthy();
    expect(registerABody.user.id).toBeTruthy();

    const userAId = registerABody.user.id;

    // =========================================================
    // 2. USER A CREATES NOTE
    // =========================================================

    const createA = await userAContext.request.post(
      `${apiURL}/api/notes`,
      {
        data: {
          title: userANote,
          content: "This note belongs only to User A.",
        },
      }
    );

    const createAStatus = createA.status();
    const noteA = await createA.json();

    console.log("User A note creation:", createAStatus);
    console.log("User A note:", noteA);

    expect(createAStatus).toBe(201);
    expect(noteA._id).toBeTruthy();
    expect(noteA.userId).toBe(userAId);
    expect(noteA.title).toBe(userANote);

    // =========================================================
    // 3. USER A CAN ACCESS OWN NOTE THROUGH API
    // =========================================================

    const getOwnA = await userAContext.request.get(
      `${apiURL}/api/notes/${noteA._id}`
    );

    expect(getOwnA.status()).toBe(200);

    const ownANote = await getOwnA.json();

    expect(ownANote._id).toBe(noteA._id);
    expect(ownANote.userId).toBe(userAId);

    // =========================================================
    // 4. USER A OPENS HOME PAGE
    // =========================================================

    await userAPage.goto("/");

    // Wait for the application itself to be ready.
    await expect(
      userAPage.getByRole("link", { name: /new note/i })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 5. USER A CAN SEE ONLY USER A'S NOTE
    // =========================================================

    await expect(
      userAPage.getByText(userANote, { exact: true })
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(
      userAPage.getByText(userBNote, { exact: true })
    ).not.toBeVisible();

    // =========================================================
    // 6. REGISTER USER B IN A SEPARATE CONTEXT
    // =========================================================

    const registerB = await userBContext.request.post(
      `${apiURL}/api/auth/register`,
      {
        data: userB,
      }
    );

    const registerBStatus = registerB.status();
    const registerBBody = await registerB.json();

    console.log("User B registration:", registerBStatus);
    console.log("User B:", registerBBody);

    expect(registerBStatus).toBe(201);
    expect(registerBBody.user).toBeTruthy();
    expect(registerBBody.user.id).toBeTruthy();

    const userBId = registerBBody.user.id;

    // =========================================================
    // 7. USER B CREATES OWN NOTE
    // =========================================================

    const createB = await userBContext.request.post(
      `${apiURL}/api/notes`,
      {
        data: {
          title: userBNote,
          content: "This note belongs only to User B.",
        },
      }
    );

    const createBStatus = createB.status();
    const noteB = await createB.json();

    console.log("User B note creation:", createBStatus);
    console.log("User B note:", noteB);

    expect(createBStatus).toBe(201);
    expect(noteB._id).toBeTruthy();
    expect(noteB.userId).toBe(userBId);
    expect(noteB.title).toBe(userBNote);

    // =========================================================
    // 8. USER B CAN ACCESS OWN NOTE THROUGH API
    // =========================================================

    const getOwnB = await userBContext.request.get(
      `${apiURL}/api/notes/${noteB._id}`
    );

    expect(getOwnB.status()).toBe(200);

    const ownBNote = await getOwnB.json();

    expect(ownBNote._id).toBe(noteB._id);
    expect(ownBNote.userId).toBe(userBId);

    // =========================================================
    // 9. USER B CANNOT ACCESS USER A'S NOTE
    // =========================================================

    const bAccessA = await userBContext.request.get(
      `${apiURL}/api/notes/${noteA._id}`
    );

    expect(bAccessA.status()).toBe(404);

    // =========================================================
    // 10. USER A CANNOT ACCESS USER B'S NOTE
    // =========================================================

    const aAccessB = await userAContext.request.get(
      `${apiURL}/api/notes/${noteB._id}`
    );

    expect(aAccessB.status()).toBe(404);

    // =========================================================
    // 11. USER B OPENS HOME PAGE
    // =========================================================

    await userBPage.goto("/");

    await expect(
      userBPage.getByRole("link", { name: /new note/i })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 12. USER B CAN SEE B'S NOTE
    // =========================================================

    await expect(
      userBPage.getByText(userBNote, { exact: true })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 13. USER B MUST NOT SEE A'S NOTE
    // =========================================================

    await expect(
      userBPage.getByText(userANote, { exact: true })
    ).not.toBeVisible({
      timeout: 5000,
    });

    // =========================================================
    // 14. USER A REFRESHES HOME PAGE
    // =========================================================

    await userAPage.reload();

    await expect(
      userAPage.getByRole("link", { name: /new note/i })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 15. USER A STILL SEES A'S NOTE AFTER REFRESH
    // =========================================================

    await expect(
      userAPage.getByText(userANote, { exact: true })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 16. USER A STILL CANNOT SEE B'S NOTE
    // =========================================================

    await expect(
      userAPage.getByText(userBNote, { exact: true })
    ).not.toBeVisible({
      timeout: 5000,
    });

    // =========================================================
    // 17. USER B REFRESHES HOME PAGE
    // =========================================================

    await userBPage.reload();

    await expect(
      userBPage.getByRole("link", { name: /new note/i })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 18. USER B STILL SEES B'S NOTE AFTER REFRESH
    // =========================================================

    await expect(
      userBPage.getByText(userBNote, { exact: true })
    ).toBeVisible({
      timeout: 15000,
    });

    // =========================================================
    // 19. USER B STILL CANNOT SEE A'S NOTE
    // =========================================================

    await expect(
      userBPage.getByText(userANote, { exact: true })
    ).not.toBeVisible({
      timeout: 5000,
    });

    // =========================================================
    // 20. VERIFY NOTE OWNERSHIP DIRECTLY
    // =========================================================

    expect(noteA.userId).toBe(userAId);
    expect(noteB.userId).toBe(userBId);

    expect(noteA.userId).not.toBe(noteB.userId);

    console.log("========================================");
    console.log("AUTH OWNERSHIP TEST PASSED");
    console.log("========================================");
    console.log("User A ID:", userAId);
    console.log("User B ID:", userBId);
    console.log("User A Note:", noteA._id);
    console.log("User B Note:", noteB._id);
    console.log("========================================");
  } finally {
    await userAContext.close();
    await userBContext.close();
  }
});