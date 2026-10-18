import { expect, test, type Page } from "@playwright/test";

/**
 * Changing chapter should replace the article and nothing else. A marker is
 * put on the sidebar once; if the sidebar were rebuilt, the marker would go.
 */
const courses = [
  // Moving up the list: opening the new lesson's parts pushes later rows down and
  // leaves everything above where it was, so the sidebar's scroll should not move.
  { name: "Oxidise", path: "/learn/rust-dsa/", from: "heaps", to: "binary-search" },
  { name: "Filter Coffee", path: "/learn/java-collections/", from: "linkedlist", to: "arraylist" },
  { name: "The Switch", path: "/learn/js-to-ts/", from: "your-first-types", to: "why-switch" },
  { name: "Off the Syllabus", path: "/learn/off-the-syllabus/", from: "typing-a-url", to: "core-web-vitals" },
];

const sidebarLink = (page: Page, slug: string) =>
  page.locator(`aside nav[aria-label="Chapters"] a[href$="/${slug}/"]`);

/** Open a page and wait for it to hydrate, so a setup step is not undone by the page waking up. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(400);
}

async function mark(page: Page) {
  await page.evaluate(() => {
    document.querySelector("aside.chapters-aside")?.setAttribute("data-e2e-mounted", "1");
  });
}

for (const course of courses) {
  test.describe(course.name, () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("the sidebar survives a chapter change, with its scroll", async ({ page }) => {
      await open(page, `${course.path}${course.from}/`);
      await mark(page);

      const body = page.locator(".chapters-body");
      // Scroll the sidebar's own list, then the page, so a reset of either would show.
      await body.evaluate((el) => {
        el.scrollTop = 40;
      });
      await sidebarLink(page, course.to).scrollIntoViewIfNeeded();
      const before = await body.evaluate((el) => el.scrollTop);
      await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));

      await sidebarLink(page, course.to).click();
      await page.waitForURL(`**/${course.to}/`);

      await expect(page.locator("h1#lesson-title")).toBeVisible();
      // Same DOM nodes: nothing was rebuilt.
      await expect(page.locator("aside.chapters-aside")).toHaveAttribute("data-e2e-mounted", "1");
      expect(await body.evaluate((el) => el.scrollTop)).toBe(before);

      // The highlight moved.
      await expect(page.locator(`aside a[aria-current="page"][href$="/${course.to}/"]`)).toHaveCount(1);
      await expect(sidebarLink(page, course.from)).not.toHaveAttribute("aria-current", "page");

      // The new title is near the top of the viewport, under the sticky header.
      const box = await page.locator("h1#lesson-title").boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThan(60);
      expect(box!.y).toBeLessThan(450);

      // Focus moved to the heading, and the live region says the title.
      await expect(page.locator("h1#lesson-title")).toBeFocused();
      const title = (await page.locator("h1#lesson-title").innerText()).trim();
      await expect(page.locator("p[role=status].sr-only")).toHaveText(title);
    });

    test("back and forward work and keep the shell", async ({ page }) => {
      await open(page, `${course.path}${course.from}/`);
      await mark(page);
      await sidebarLink(page, course.to).click();
      await page.waitForURL(`**/${course.to}/`);
      await page.goBack();
      await page.waitForURL(`**/${course.from}/`);
      await expect(page.locator("aside.chapters-aside")).toHaveAttribute("data-e2e-mounted", "1");
      await page.goForward();
      await page.waitForURL(`**/${course.to}/`);
      await expect(page.locator("aside.chapters-aside")).toHaveAttribute("data-e2e-mounted", "1");
    });
  });
}

test.describe("scroll and anchors", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("a sub-item anchor in the sidebar lands on its section", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    const part = page.locator('aside nav[aria-label="Chapters"] ol ol a').nth(2);
    const href = await part.getAttribute("href");
    await part.click();
    await page.waitForTimeout(900);
    const top = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, href!.slice(1));
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(300);
  });

  test("a direct link to a section opens at that section", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    const id = await page.locator('aside nav[aria-label="Chapters"] ol ol a').nth(3).getAttribute("href");
    await page.goto("/");
    await page.goto(`/learn/rust-dsa/binary-search/${id}`);
    await page.waitForTimeout(1500);
    const top = await page.evaluate((i) => document.getElementById(i)!.getBoundingClientRect().top, id!.slice(1));
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(300);
  });

  test("Next lesson uses the same behaviour", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    await mark(page);
    await page.locator('nav[aria-label="Previous and next lesson"] a[rel=next]').click();
    await expect(page.locator("h1#lesson-title")).toBeFocused();
    await expect(page.locator("aside.chapters-aside")).toHaveAttribute("data-e2e-mounted", "1");
    const box = await page.locator("h1#lesson-title").boundingBox();
    expect(box!.y).toBeLessThan(450);
  });

  test("a fresh load does not take focus", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    await expect(page.locator("h1#lesson-title")).not.toBeFocused();
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the drawer closes on choosing a chapter, and the page does not overflow", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    await page.getByRole("button", { name: /chapters/i }).first().click();
    const dialog = page.getByRole("dialog", { name: "Course chapters" });
    await expect(dialog).toBeVisible();
    await dialog.locator('a[href$="/heaps/"]').first().click();
    await page.waitForURL("**/heaps/");
    await expect(dialog).toBeHidden();
    await expect(page.locator("h1#lesson-title")).toBeFocused();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Not left with the page locked.
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("the article does not animate in", async ({ page }) => {
    await open(page, "/learn/rust-dsa/binary-search/");
    await sidebarLink(page, "heaps").click();
    await page.waitForURL("**/heaps/");
    const animated = await page.evaluate(() => document.querySelector("article.lesson-article")!.getAnimations().length);
    expect(animated).toBe(0);
  });
});
