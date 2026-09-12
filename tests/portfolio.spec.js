const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

const homePath = "/View/home.html";
const pages = [
  "/View/home.html",
  "/View/Blog/index.html",
  "/View/Blog/designing-scalable-ios-architecture.html",
  "/View/Blog/swift-concurrency.html",
  "/View/Blog/ios-performance.html",
  "/View/Blog/swiftui-real-world.html",
  "/View/Blog/uikit-development-production.html",
  "/View/Blog/ios-interview-questions-answers.html",
  "/Projects/hind-pharma.html",
  "/Projects/swift-extension-toolkit.html"
];

test("all portfolio pages render without browser errors", async ({ page }) => {
  for (const path of pages) {
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toBeVisible();
    expect(errors, path).toEqual([]);
  }
});

test("all pages use the centralized theme contract", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path, { waitUntil: "networkidle" });
    const themeLink = page.locator('link[href*="theme.css"]');
    await expect(themeLink, path).toHaveCount(1);
    const themeVars = await page.evaluate(() => ({
      dark: getComputedStyle(document.documentElement).getPropertyValue("--theme-bg").trim(),
      brand: getComputedStyle(document.documentElement).getPropertyValue("--theme-brand").trim()
    }));
    expect(themeVars.dark, path).toBeTruthy();
    expect(themeVars.brand, path).toBeTruthy();
  }
});

test("homepage renders key content and local images", async ({ page }) => {
  await page.goto(homePath, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText("Building exceptional");
  await expect(page.locator("#projects")).toBeVisible();
  await expect(page.locator("#blog")).toBeVisible();
  const broken = await page.locator("img").evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src)
  );
  expect(broken).toEqual([]);
});

test("core recruiter actions and contact configuration are correct", async ({ page }) => {
  await page.goto(homePath, { waitUntil: "networkidle" });
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com/);
  await expect(page.getByRole("link", { name: /GitHub/ }).first()).toHaveAttribute("href", /github\.com/);
  await expect(page.getByRole("link", { name: /Download Resume/ })).toHaveAttribute("href", /Muhammed_Ayaz_Resume\.pdf/);
  await expect(page.locator(".availability-badge")).toBeVisible();
  const model = await page.evaluate(async () => (await fetch("../Models/portfolioModel.js")).text());
  expect(model).toContain('email: "ayaz.job2010@gmail.com"');
});

test("theme toggle persists and cycles correctly", async ({ page }) => {
  await page.goto(homePath, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("portfolioTheme", "dark"));
  await page.reload({ waitUntil: "networkidle" });
  const toggle = page.locator("#themeToggle");
  await toggle.click();
  await expect(page.locator("body")).toHaveClass(/light/);
  await toggle.click();
  await expect(page.locator("body")).not.toHaveClass(/light/);
});

test("blog search and filters work", async ({ page }) => {
  await page.goto(homePath, { waitUntil: "networkidle" });
  const search = page.locator("#blogSearch");
  await search.fill("Swift Concurrency");
  await expect(page.locator('[data-blog-card]').filter({ hasText: "Swift Concurrency" })).toBeVisible();
  await page.getByRole("button", { name: "Performance" }).click();
  await expect(page.locator('[data-blog-card][hidden]')).toHaveCount(6);
});

test("all pages pass serious accessibility smoke audit", async ({ page }) => {
  for (const path of pages) {
    await page.goto(path, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious, path).toEqual([]);
  }
});

test("all important local links resolve", async ({ page, request }) => {
  for (const path of pages) {
    await page.goto(path, { waitUntil: "networkidle" });
    const links = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((a) => a.getAttribute("href"))
        .filter((href) => href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("http") && !href.startsWith("javascript:"))
    );
    for (const href of [...new Set(links)]) {
      const response = await request.get(new URL(href, page.url()).toString());
      expect(response.status(), `${path} -> ${href}`).toBeLessThan(400);
    }
  }
});

test("mobile layout has no horizontal overflow and menu has no list artifacts", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of pages) {
    await page.goto(path, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);

    const menuToggle = page.locator("#mobileMenuToggle");
    if (await menuToggle.count()) {
      await expect(menuToggle).toBeVisible();
      await menuToggle.click();
      const menu = page.locator("#portfolioMobileMenu");
      await expect(menu).toHaveClass(/is-open/);
      await expect(menu.locator("li")).toHaveCount(0);
      await expect(menu.locator("a")).toHaveCount(await page.locator(".nav-links a").count());
      await page.mouse.click(8, 400);
      await expect(menu).not.toHaveClass(/is-open/);
      await menuToggle.click();
      await expect(menu).toHaveClass(/is-open/);
      await page.keyboard.press("Escape");
      await expect(menu).not.toHaveClass(/is-open/);
    }
  }
});

test("mobile content stays inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of pages) {
    await page.goto(path, { waitUntil: "networkidle" });
    const outOfBounds = await page.evaluate(() => {
      const width = document.documentElement.clientWidth;
      const selectors = "nav, main, section, .card, .project-panel, .blog-index-card, .article, .contact-form, footer";
      return [...document.querySelectorAll(selectors)]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.left < -1 || r.right > width + 1;
        })
        .map((el) => ({ tag: el.tagName, className: el.className }));
    });
    expect(outOfBounds, path).toEqual([]);
  }
});

test("homepage stays within basic performance budgets", async ({ page }) => {
  const start = Date.now();
  await page.goto(homePath, { waitUntil: "networkidle" });
  const loadMs = Date.now() - start;
  const transferBytes = await page.evaluate(() =>
    performance.getEntriesByType("resource").reduce((total, entry) => total + (entry.transferSize || 0), 0)
  );
  expect(loadMs).toBeLessThan(5000);
  expect(transferBytes).toBeLessThan(3_000_000);
});

test("homepage does not load remote company logos", async ({ page }) => {
  await page.goto(homePath, { waitUntil: "networkidle" });
  const remoteLogos = await page.locator(".company-logo").evaluateAll((items) =>
    items.filter((item) => item.tagName === "IMG" && item.src.startsWith("http")).length
  );
  expect(remoteLogos).toBe(0);
});


test("blog theme toggle works without double-binding", async ({ page }) => {
  await page.goto("/View/Blog/designing-scalable-ios-architecture.html", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("portfolioTheme", "dark"));
  await page.reload({ waitUntil: "networkidle" });
  const toggle = page.locator("#themeToggle");
  await expect(page.locator("body")).not.toHaveClass(/light/);
  await toggle.click();
  await expect(page.locator("body")).toHaveClass(/light/);
  await expect(page.locator("#themeLabel")).toHaveText("Light");
  await toggle.click();
  await expect(page.locator("body")).not.toHaveClass(/light/);
  await expect(page.locator("#themeLabel")).toHaveText("Dark");
});

test("blog scroll-to-top control stays above browser toolbar area", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/View/Blog/designing-scalable-ios-architecture.html", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 900));
  const position = await page.locator(".scroll-button--top").evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const nav = document.querySelector("nav")?.getBoundingClientRect();
    return { top: rect.top, bottom: getComputedStyle(el).bottom, navBottom: nav?.bottom ?? 0 };
  });
  expect(position.bottom).not.toBe("auto");
  expect(position.top).toBeGreaterThan(position.navBottom);
});
