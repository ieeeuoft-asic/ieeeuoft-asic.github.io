import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const routes = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "contact", path: "/contact/" },
  { name: "posts", path: "/posts/" },
  { name: "post-simproc", path: "/blog/simproc-tinytapeout/" },
];

const screenshotDir = path.join(__dirname, "__screenshots__");

test.beforeAll(() => {
  fs.mkdirSync(screenshotDir, { recursive: true });
});

for (const route of routes) {
  test(`visual: ${route.name}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto(route.path, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const step = window.innerHeight * 0.8;
      let y = 0;
      const max = document.body.scrollHeight;
      while (y < max) {
        window.scrollTo(0, y);
        await delay(120);
        y += step;
      }
      window.scrollTo(0, 0);
      await delay(300);
    });
    await page.waitForTimeout(500);

    expect(errors, `console errors on ${route.path}`).toEqual([]);

    const slug = `${route.name}-${testInfo.project.name}`;
    await page.screenshot({
      path: path.join(screenshotDir, `${slug}.png`),
      fullPage: true,
    });

    await expect(page.locator(".asic-masthead")).toBeVisible();
    await expect(page.locator(".asic-footer")).toBeVisible();
  });
}
