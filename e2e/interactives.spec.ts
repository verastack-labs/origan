import { expect, test, type Page } from "@playwright/test";

/**
 * Every stepper behaves the same way: Next and Back move one step, the arrow
 * keys do too, the step is announced in a polite live region, nothing spills
 * off a phone, and with no script the block shows its steps as a list.
 */
const steppers = [
  { name: "Binary search", url: "/learn/rust-dsa/binary-search/", label: "Step through a binary search" },
  { name: "Breadth-first search", url: "/learn/rust-dsa/bfs-dfs/", label: "Step through a breadth-first search" },
  { name: "Heap push", url: "/learn/rust-dsa/heaps/", label: "Step through pushing a value onto a heap" },
  { name: "ArrayList growth", url: "/learn/java-collections/arraylist/", label: "Step through an ArrayList growing" },
  { name: "HashMap puts", url: "/learn/java-collections/hashset-and-hashmap/", label: "Step through putting keys into a hash map" },
  { name: "URL journey", url: "/learn/off-the-syllabus/typing-a-url/", label: "Step through what happens when you type a URL" },
];

async function open(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

for (const s of steppers) {
  test.describe(s.name, () => {
    test("steps with the buttons and the arrow keys, and says where it is", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await open(page, s.url);
      const block = page.getByRole("region", { name: s.label });
      await block.scrollIntoViewIfNeeded();
      const status = block.locator(".js-only.notation");
      await expect(status).toHaveText(/Step 1 of \d+/);

      await block.getByRole("button", { name: /^Next/ }).click();
      await expect(status).toHaveText(/Step 2 of \d+/);
      await block.getByRole("button", { name: /^Next/ }).press("ArrowRight");
      await expect(status).toHaveText(/Step 3 of \d+/);
      await block.getByRole("button", { name: /^Next/ }).press("ArrowLeft");
      await expect(status).toHaveText(/Step 2 of \d+/);
      await block.getByRole("button", { name: /^Back/ }).click();
      await expect(status).toHaveText(/Step 1 of \d+/);
      // Back at the start does nothing. The button is aria-disabled, not disabled, so focus is never dropped.
      await block.getByRole("button", { name: /^Back/ }).click({ force: true });
      await expect(status).toHaveText(/Step 1 of \d+/);

      // The live region is polite and carries the caption.
      const live = block.locator("[aria-live=polite]").first();
      await expect(live).toHaveAttribute("aria-atomic", "true");
      expect((await live.innerText()).length).toBeGreaterThan(20);
    });

    test("runs to the end, then starts again", async ({ page }) => {
      await open(page, s.url);
      const block = page.getByRole("region", { name: s.label });
      await block.scrollIntoViewIfNeeded();
      const total = Number(((await block.locator(".js-only.notation").textContent()) ?? "").match(/of (\d+)/)?.[1]);
      for (let i = 1; i < total; i++) await block.getByRole("button", { name: /^Next/ }).click();
      await expect(block.locator(".js-only.notation")).toHaveText(new RegExp(`Step ${total} of ${total}`));
      await block.getByRole("button", { name: /^Start again/ }).click();
      await expect(block.locator(".js-only.notation")).toHaveText(new RegExp(`Step 1 of ${total}`));
    });

    test("fits a 390px phone, with the block as wide as the page", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open(page, s.url);
      const block = page.getByRole("region", { name: s.label });
      await block.scrollIntoViewIfNeeded();
      for (let i = 0; i < 4; i++) await block.getByRole("button", { name: /^(Next|Start again)/ }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      const box = await block.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    });

    test("without script, lists every step and hides the controls", async ({ browser }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(s.url);
      const block = page.getByRole("region", { name: s.label });
      await expect(block.locator("ol.no-js-only")).toBeVisible();
      await expect(block.locator("ol.no-js-only > li").first()).toBeVisible();
      expect(await block.locator("ol.no-js-only > li").count()).toBeGreaterThan(2);
      // The controls are in the markup but hidden, so they are not in the accessibility tree either.
      await expect(block.locator(".js-only").first()).toBeHidden();
      await expect(block.getByRole("button", { name: /^Next/ })).toHaveCount(0);
      await context.close();
    });
  });
}

test.describe("the binary search stepper's target", () => {
  test("hunting for a number that is missing ends where lo meets hi", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    const block = page.getByRole("region", { name: "Step through a binary search" });
    await block.scrollIntoViewIfNeeded();
    await block.getByRole("button", { name: "40", exact: true }).click();
    await expect(block.locator(".js-only.notation")).toHaveText(/Step 1 of 6/);
    for (let i = 0; i < 5; i++) await block.getByRole("button", { name: /^Next/ }).click();
    await expect(block.locator("[aria-live=polite]").first()).toContainText("40 is not in the row");
    await expect(block.locator("[aria-live=polite]").first()).toContainText("between 38 and 45");
  });
});

test.describe("the heap stepper's value", () => {
  test("pushing 60 stops at once, and 5 climbs three levels", async ({ page }) => {
    await open(page, "/learn/rust-dsa/heaps/");
    const block = page.getByRole("region", { name: "Step through pushing a value onto a heap" });
    await block.scrollIntoViewIfNeeded();
    await block.getByRole("button", { name: "60", exact: true }).click();
    await expect(block.locator(".js-only.notation")).toHaveText(/of 3$/);
    await block.getByRole("button", { name: "5", exact: true }).click();
    await expect(block.locator(".js-only.notation")).toHaveText(/of 6$/);
  });
});

test.describe("Core Web Vitals demos", () => {
  test("a late ad moves the button, and reserving the space stops it", async ({ page }) => {
    await open(page, "/learn/off-the-syllabus/core-web-vitals/");
    const demo = page.getByRole("region", { name: "Layout shift demo" });
    await demo.scrollIntoViewIfNeeded();
    const live = demo.locator("[aria-live=polite]");
    await demo.getByRole("button", { name: "Load the page" }).click();
    await expect(live).toContainText("pushed everything below it down by 102 pixels", { timeout: 4000 });
    await expect(live).toContainText("needs improvement");

    await demo.getByRole("button", { name: /Reserve the space/ }).click();
    await demo.getByRole("button", { name: "Load the page" }).click();
    await expect(live).toContainText("Nothing moved", { timeout: 4000 });
    await expect(live).toContainText("0.00");
  });

  test("a blocking press is slow to draw and a yielding press is quick", async ({ page }) => {
    await open(page, "/learn/off-the-syllabus/core-web-vitals/");
    const demo = page.getByRole("region", { name: "Slow tap demo" });
    await demo.scrollIntoViewIfNeeded();
    await demo.getByRole("button", { name: /^Save/ }).click();
    await expect(demo.getByText("not pressed yet")).toHaveCount(1);
    await demo.getByRole("button", { name: /Yield to the browser/ }).click();
    await demo.getByRole("button", { name: /^(Saved|Save)/ }).click();
    await expect(demo.getByText("not pressed yet")).toHaveCount(0, { timeout: 5000 });
    const text = await demo.locator("p[aria-live]").innerText();
    const [blocking, yielding] = [...text.matchAll(/(\d+) ms/g)].map((m) => Number(m[1]));
    expect(blocking).toBeGreaterThan(500);
    expect(yielding).toBeLessThan(200);
  });
});

test.describe("the other article blocks", () => {
  test("the phone shows the 100vh box too tall with the bar shown, and fitting with it hidden", async ({ page }) => {
    await open(page, "/learn/off-the-syllabus/svh-on-phones/");
    const demo = page.getByRole("region", { name: "Phone viewport demo" });
    await demo.scrollIntoViewIfNeeded();
    await expect(demo).toContainText("56px too tall");
    await demo.getByRole("button", { name: "Hidden" }).click();
    await expect(demo).toContainText("fits exactly");
    await expect(demo).toContainText("56px of room spare");
  });

  test("the JSON-LD block flips between the page and its labels", async ({ page }) => {
    await open(page, "/learn/off-the-syllabus/json-ld/");
    const lens = page.getByRole("region", { name: "The same page, two ways" });
    await lens.scrollIntoViewIfNeeded();
    await expect(lens).toContainText("By VeraStack Labs");
    await lens.getByRole("button", { name: "What a search engine reads" }).click();
    await expect(lens).toContainText('"@type"');
    await expect(lens).toContainText("what kind of thing this is");
  });

  test("the request builder writes the curl command and the request text", async ({ page }) => {
    await open(page, "/learn/off-the-syllabus/api-clients/");
    const block = page.getByRole("region", { name: "Build a request" });
    await block.scrollIntoViewIfNeeded();
    await block.getByRole("button", { name: "GET", exact: true }).click();
    await block.getByLabel("Address").fill("https://api.github.com/zen");
    await block.getByLabel("One header").selectOption("none");
    await expect(block).toContainText("curl https://api.github.com/zen");
    await expect(block).toContainText("GET /zen HTTP/1.1");
    await expect(block).toContainText("Host: api.github.com");
    await block.getByLabel("Address").fill("nonsense");
    await expect(block).toContainText("Type a complete address");
  });
});
