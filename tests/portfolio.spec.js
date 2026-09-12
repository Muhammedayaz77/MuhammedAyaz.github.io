const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

const homePath = "/View/home.html";

test("homepage renders without browser console errors", async ({ page }) => {
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(homePath, { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText("Building exceptional");
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#blog")).toBeVisible();
    expect(errors).toEqual([]);
});

test("local images load successfully", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const broken = await page.locator("img").evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
    expect(broken).toEqual([]);
});

test("core recruiter actions are present", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com/);
    await expect(page.getByRole("link", { name: /GitHub/ }).first()).toHaveAttribute("href", /github\.com/);
    await expect(page.getByRole("link", { name: /Download Resume/ })).toHaveAttribute("href", /Muhammed_Ayaz_Resume\.pdf/);
    await expect(page.locator(".availability-badge")).toBeVisible();
});

test("theme toggle cycles without throwing", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const toggle = page.locator("#themeToggle");
    await toggle.click();
    await toggle.click();
    await toggle.click();
    await expect(toggle).toBeVisible();
});

test("blog search and filters work", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const search = page.locator("#blogSearch");
    await search.fill("Swift Concurrency");
    await expect(page.locator('[data-blog-card]').filter({ hasText: "Swift Concurrency" })).toBeVisible();
    await page.getByRole("button", { name: "Performance" }).click();
    await expect(page.locator('[data-blog-card][hidden]')).toHaveCount(6);
});

test("homepage passes accessibility smoke audit", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact));
    expect(serious).toEqual([]);
});

test("important local links resolve", async ({ page, request }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const links = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((a) => a.getAttribute("href")).filter((href) => href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("http")));
    for (const href of [...new Set(links)]) {
        const response = await request.get(new URL(href, page.url()).toString());
        expect(response.status(), href).toBeLessThan(400);
    }
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(homePath, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator("#mobileMenuToggle")).toBeVisible();
    await page.locator("#mobileMenuToggle").click();
    await expect(page.locator("#portfolioMobileMenu")).toHaveClass(/is-open/);
    await page.locator("body").click({ position: { x: 10, y: 400 } });
    await expect(page.locator("#portfolioMobileMenu")).not.toHaveClass(/is-open/);
});

test("homepage stays within basic performance budgets", async ({ page }) => {
    const start = Date.now();
    await page.goto(homePath, { waitUntil: "networkidle" });
    const loadMs = Date.now() - start;
    const transferBytes = await page.evaluate(() => performance.getEntriesByType("resource").reduce((total, entry) => total + (entry.transferSize || 0), 0));
    expect(loadMs).toBeLessThan(5000);
    expect(transferBytes).toBeLessThan(3_000_000);
});

test("contact configuration uses the intended destination without exposing it in the page", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const model = await page.evaluate(async () => {
        const response = await fetch("../Models/portfolioModel.js");
        return response.text();
    });
    expect(model).toContain('email: "ayaz.job2010@gmail.com"');
    await expect(page.locator("#contactForm")).toBeVisible();
});

test("homepage does not load remote company logos", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    const remoteLogos = await page.locator(".company-logo").evaluateAll((items) => items.filter((item) => item.tagName === "IMG" && item.src.startsWith("http")).length);
    expect(remoteLogos).toBe(0);
});

test("critical external links are present and correctly formed", async ({ page }) => {
    await page.goto(homePath, { waitUntil: "networkidle" });
    await expect(page.locator('a[href^="https://github.com/Muhammedayaz77/"]').first()).toHaveAttribute("href", /github\.com/);
    await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute("href", /linkedin\.com/);
    await expect(page.locator('a[href$=".pdf"]').first()).toHaveAttribute("href", /Muhammed_Ayaz_Resume\.pdf/);
});
