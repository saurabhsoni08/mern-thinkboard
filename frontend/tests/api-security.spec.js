import { test, expect } from "@playwright/test";

test("API security prevents users from accessing each other's notes", async ({
  playwright,
}) => {
  const timestamp = Date.now();

  const apiURL = "http://localhost:5001";

  const userA = {
    name: `API User A ${timestamp}`,
    email: `api.user.a.${timestamp}@example.com`,
    password: "Playwright123!",
  };

  const userB = {
    name: `API User B ${timestamp}`,
    email: `api.user.b.${timestamp}@example.com`,
    password: "Playwright123!",
  };

  const userAContext = await playwright.request.newContext({
    baseURL: apiURL,
  });

  const userBContext = await playwright.request.newContext({
    baseURL: apiURL,
  });

  const anonymousContext = await playwright.request.newContext({
    baseURL: apiURL,
  });

  try {
    // =========================================================
    // 1. REGISTER USER A
    // =========================================================

    const registerA = await userAContext.post("/api/auth/register", {
      data: userA,
    });

    console.log("Register A:", registerA.status());
    console.log("Register A body:", await registerA.text());

    expect(registerA.status()).toBe(201);

    // =========================================================
    // 2. USER A CREATES NOTE
    // =========================================================

    const createA = await userAContext.post("/api/notes", {
      data: {
        title: `API Private Note A ${timestamp}`,
        content: "This note belongs only to User A.",
      },
    });

    console.log("Create A:", createA.status());
    console.log("Create A body:", await createA.text());

    expect(createA.status()).toBe(201);

    const noteA = await createA.json();

    expect(noteA._id).toBeTruthy();
    expect(noteA.userId).toBeTruthy();

    // =========================================================
    // 3. USER A CAN READ OWN NOTE
    // =========================================================

    const getA = await userAContext.get(`/api/notes/${noteA._id}`);

    expect(getA.status()).toBe(200);

    // =========================================================
    // 4. REGISTER USER B
    // =========================================================

    const registerB = await userBContext.post("/api/auth/register", {
      data: userB,
    });

    console.log("Register B:", registerB.status());
    console.log("Register B body:", await registerB.text());

    expect(registerB.status()).toBe(201);

    // =========================================================
    // 5. USER B CANNOT READ USER A'S NOTE
    // =========================================================

    const getAAsB = await userBContext.get(`/api/notes/${noteA._id}`);

    expect(getAAsB.status()).toBe(404);

    // =========================================================
    // 6. USER B CANNOT UPDATE USER A'S NOTE
    // =========================================================

    const updateAAsB = await userBContext.put(`/api/notes/${noteA._id}`, {
      data: {
        title: "Unauthorized Update",
        content: "User B must not change User A's note.",
      },
    });

    expect(updateAAsB.status()).toBe(404);

    // =========================================================
    // 7. USER B CANNOT DELETE USER A'S NOTE
    // =========================================================

    const deleteAAsB = await userBContext.delete(`/api/notes/${noteA._id}`);

    expect(deleteAAsB.status()).toBe(404);

    // =========================================================
    // 8. USER A'S NOTE STILL EXISTS
    // =========================================================

    const verifyA = await userAContext.get(`/api/notes/${noteA._id}`);

    expect(verifyA.status()).toBe(200);

    // =========================================================
    // 9. USER B CREATES OWN NOTE
    // =========================================================

    const createB = await userBContext.post("/api/notes", {
      data: {
        title: `API Private Note B ${timestamp}`,
        content: "This note belongs only to User B.",
      },
    });

    console.log("Create B:", createB.status());
    console.log("Create B body:", await createB.text());

    expect(createB.status()).toBe(201);

    const noteB = await createB.json();

    expect(noteB._id).toBeTruthy();
    expect(noteB.userId).toBeTruthy();

    // =========================================================
    // 10. USER B CAN READ OWN NOTE
    // =========================================================

    const getB = await userBContext.get(`/api/notes/${noteB._id}`);

    expect(getB.status()).toBe(200);

    // =========================================================
    // 11. USER A CANNOT READ USER B'S NOTE
    // =========================================================

    const getBAsA = await userAContext.get(`/api/notes/${noteB._id}`);

    expect(getBAsA.status()).toBe(404);

    // =========================================================
    // 12. USER A CANNOT UPDATE USER B'S NOTE
    // =========================================================

    const updateBAsA = await userAContext.put(`/api/notes/${noteB._id}`, {
      data: {
        title: "Unauthorized Update",
        content: "User A must not change User B's note.",
      },
    });

    expect(updateBAsA.status()).toBe(404);

    // =========================================================
    // 13. USER A CANNOT DELETE USER B'S NOTE
    // =========================================================

    const deleteBAsA = await userAContext.delete(`/api/notes/${noteB._id}`);

    expect(deleteBAsA.status()).toBe(404);

    // =========================================================
    // 14. NO AUTHENTICATION = 401
    // =========================================================

    const anonymousRequest = await anonymousContext.get("/api/notes");

    expect(anonymousRequest.status()).toBe(401);

    // =========================================================
    // 15. USER B CAN UPDATE OWN NOTE
    // =========================================================

    const updateB = await userBContext.put(`/api/notes/${noteB._id}`, {
      data: {
        title: `Updated B Note ${timestamp}`,
        content: "User B can update their own note.",
      },
    });

    expect(updateB.status()).toBe(200);

    // =========================================================
    // 16. USER B CAN DELETE OWN NOTE
    // =========================================================

    const deleteB = await userBContext.delete(`/api/notes/${noteB._id}`);

    expect(deleteB.status()).toBe(200);

    // =========================================================
    // 17. DELETED NOTE RETURNS 404
    // =========================================================

    const verifyDeletedB = await userBContext.get(
      `/api/notes/${noteB._id}`
    );

    expect(verifyDeletedB.status()).toBe(404);
  } finally {
    await userAContext.dispose();
    await userBContext.dispose();
    await anonymousContext.dispose();
  }
});