const { test, expect } = require("@playwright/test");
const { AxeBuilder } = require("@axe-core/playwright");

const homePath = "/MuhammedAyaz.github.io/View/home.html";

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
