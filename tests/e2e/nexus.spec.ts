import { expect, test } from "@playwright/test";

async function passOnboarding(page: import("@playwright/test").Page) {
  const gate = page.getByRole("dialog", { name: /Подтверди/ });
  await expect(gate).toBeVisible();
  await expect(page.locator(".site-access-layer")).toHaveAttribute("aria-hidden", "true");
  const slider = gate.getByRole("slider");
  const target = await slider.getAttribute("data-target");
  if (!target) throw new Error("Onboarding target is missing");
  await slider.fill(target);
  await gate.getByRole("button", { name: "Submit" }).click();
  await expect(gate).toBeHidden();
  await expect(page.locator(".site-access-layer")).toHaveAttribute("aria-hidden", "false");
}

test.describe("K✦GAMI Nexus", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/gta5rp");
    await passOnboarding(page);
  });

  test("has working navigation and a real recruitment destination", async ({ page, isMobile }) => {
    await expect(page.getByRole("heading", { name: /K.*GAMI/i, level: 1 })).toBeVisible();
    if (isMobile) {
      await page.getByRole("button", { name: "Открыть меню" }).click();
    }
    await page.getByRole("link", { name: "Информация" }).click();
    await expect(page.locator("#kg-information")).toBeInViewport();
    const join = page.getByRole("link", { name: /Перейти в Discord/i });
    await expect(join).toHaveAttribute("href", /^https:\/\/discord\.gg\//);
  });

  test("depth carousel supports keyboard input", async ({ page }) => {
    const carousel = page.getByRole("region", { name: "Направления участия" });
    const viewport = carousel.locator(".depth-carousel__viewport");
    await viewport.focus();
    await page.keyboard.press("ArrowRight");
    await expect(carousel.getByText("Сообщество", { exact: true }).last()).toBeVisible();
  });

  test("keeps focus indicators and reduced motion contract", async ({ page }) => {
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toBeVisible();
    const reduced = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (test.info().project.name === "reduced-motion") expect(reduced).toBe(true);
  });
});

test.describe("applications carousel", () => {
  test("selects compact reflective application cards with the keyboard", async ({ page }) => {
    await page.route("http://localhost:8787/api/**", async (route) => {
      const url = route.request().url();
      if (url.includes("analytics/summary")) {
        await route.fulfill({ json: { ok: true, data: { uniqueVisitors: 0, daily: [] } } });
      } else if (url.includes("guestbook")) {
        await route.fulfill({ json: { ok: true, data: { entries: [], nextCursor: null } } });
      } else {
        await route.fulfill({ status: 202, json: { ok: true, data: { accepted: true } } });
      }
    });
    await page.goto("/metsuki");
    await passOnboarding(page);
    const carousel = page.getByRole("region", { name: /Applications|Приложения/ });
    const selector = carousel.locator(".applications-depth-carousel__viewport");
    await selector.focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await expect(carousel.locator(".applications-depth-carousel__item.is-active").getByRole("heading", { name: "EXE Analyzer" })).toBeVisible();
    await expect(carousel.locator(".app-reflective-card")).toHaveCount(3);
  });
});

test.describe("identity selector", () => {
  test("offers both profiles after verification", async ({ page }) => {
    await page.goto("/");
    await passOnboarding(page);
    await expect(page.getByRole("link", { name: "Открыть профиль Metsuki Kagami" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Открыть профиль Mika Kagami" })).toBeVisible();
  });

  test("opens Mika without repeating onboarding", async ({ page }) => {
    await page.goto("/");
    await passOnboarding(page);
    await page.getByRole("link", { name: "Открыть профиль Mika Kagami" }).click();
    await expect(page).toHaveURL(/\/mika$/);
    await expect(page.getByRole("heading", { name: /Mika\s*Kagami/i })).toBeVisible();
    await expect(page.getByRole("dialog", { name: /Подтверди/ })).toHaveCount(0);
  });
});
