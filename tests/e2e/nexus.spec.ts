import { expect, test, type Page } from "@playwright/test";

const VERIFIED_KEY = "metsuwuki_onboarding_verified_v1";

async function mockApis(page: Page, uniqueVisitors = 245) {
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === "/api/analytics/summary") {
      await route.fulfill({ json: { ok: true, data: { uniqueVisitors, daily: [] } } });
      return;
    }
    if (url.pathname === "/api/guestbook" && request.method() === "GET") {
      const profile = url.searchParams.get("profile") ?? "metsuki";
      await route.fulfill({ json: { ok: true, data: { entries: [{ id: profile, name: profile === "mika" ? "Mika visitor" : "Metsuki visitor", message: `${profile} message`, avatar: "profile", created_at: "2026-10-19T12:00:00.000Z" }], nextCursor: null } } });
      return;
    }
    if (url.pathname === "/api/guestbook" && request.method() === "POST") {
      const body = request.postDataJSON() as { profile: string; name: string; message: string; avatar: string };
      await route.fulfill({ status: 201, json: { ok: true, data: { entry: { id: crypto.randomUUID(), ...body, created_at: new Date().toISOString() } } } });
      return;
    }
    await route.fulfill({ status: 202, json: { ok: true, data: { accepted: true } } });
  });
}

async function passOnboarding(page: Page) {
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

async function openVerified(page: Page, path: string) {
  await page.addInitScript((key) => sessionStorage.setItem(key, "true"), VERIFIED_KEY);
  await page.goto(path);
}

async function returnToSelector(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole("button", { name: /Open menu|Открыть меню/ }).click();
  await page.getByRole("link", { name: /Choose (another )?profile/ }).click();
}

test.describe("dual portfolio routing", () => {
  test.beforeEach(async ({ page }) => mockApis(page));

  test("onboarding opens the accessible identity selector", async ({ page }) => {
    await page.goto("/");
    await passOnboarding(page);
    await expect(page.getByRole("heading", { name: /WHOSE WORLD WILL YOU ENTER/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Открыть профиль Metsuki Kagami" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Открыть профиль Mika Kagami" })).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus-visible")).toBeVisible();
  });

  test("opens the complete Metsuki portfolio and its real application carousel", async ({ page }) => {
    await openVerified(page, "/metsuki");
    await expect(page.getByRole("heading", { level: 1 })).toHaveAttribute("class", /hero-title--warp/);
    await expect(page.getByText("MetsUwUki", { exact: true }).first()).toBeVisible();
    const carousel = page.getByRole("region", { name: /Applications|Приложения/ });
    const viewport = carousel.locator(".applications-depth-carousel__viewport");
    await viewport.focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await expect(carousel.locator(".applications-depth-carousel__item.is-active").getByRole("heading", { name: "EXE Analyzer" })).toBeVisible();
    await expect(carousel.locator(".app-reflective-card")).toHaveCount(3);
  });

  test("opens Mika through the identical portfolio structure with honest coming-soon cards", async ({ page }) => {
    await openVerified(page, "/mika");
    await expect(page.locator(".hero-section")).toBeVisible();
    await expect(page.getByText("Mika Kagami", { exact: true }).first()).toBeVisible();
    await expect(page.locator(".destination-grid")).toBeVisible();
    await expect(page.locator(".guestbook-layout")).toBeVisible();
    const carousel = page.getByRole("region", { name: /Creative projects|Творческие проекты/ });
    await expect(carousel.locator(".app-reflective-card")).toHaveCount(3);
    await expect(carousel.getByText("COMING SOON").first()).toBeVisible();
    await expect(page.locator(".site-footer__socials a")).toHaveCount(1);
    await expect(page.locator(".site-footer__socials a")).toHaveAttribute("href", "https://t.me/MikaKagami_XIX");
  });

  test("switches profiles without repeating onboarding and keeps one visitor total", async ({ page, isMobile }) => {
    await openVerified(page, "/metsuki");
    await expect(page.getByRole("img", { name: /Unique visitors: 245/i })).toBeVisible();
    await returnToSelector(page, isMobile);
    await expect(page.getByRole("dialog", { name: /Подтверди/ })).toHaveCount(0);
    await expect(page.getByText("245", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Открыть профиль Mika Kagami" }).click();
    await expect(page.getByRole("img", { name: /Unique visitors: 245/i })).toBeVisible();
  });

  test("keeps the profile guestbooks separated", async ({ page, isMobile }) => {
    await openVerified(page, "/metsuki");
    await expect(page.getByText("metsuki message", { exact: true })).toBeVisible();
    await expect(page.getByText("mika message", { exact: true })).toHaveCount(0);
    await returnToSelector(page, isMobile);
    await page.getByRole("link", { name: "Открыть профиль Mika Kagami" }).click();
    await expect(page.getByText("mika message", { exact: true })).toBeVisible();
    await expect(page.getByText("metsuki message", { exact: true })).toHaveCount(0);
  });

  test("supports direct profile loads and has no horizontal mobile overflow", async ({ page, isMobile }) => {
    await page.goto("/mika");
    await passOnboarding(page);
    await expect(page.locator(".hero-section")).toBeVisible();
    if (isMobile) {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("K✦GAMI Nexus remains intact", () => {
  test.beforeEach(async ({ page }) => {
    await mockApis(page);
    await openVerified(page, "/gta5rp");
  });

  test("has working navigation and a real recruitment destination", async ({ page, isMobile }) => {
    await expect(page.getByRole("heading", { name: /K.*GAMI/i, level: 1 })).toBeVisible();
    if (isMobile) await page.getByRole("button", { name: "Открыть меню" }).click();
    await page.getByRole("link", { name: "Информация" }).click();
    await expect(page.locator("#kg-information")).toBeInViewport();
    await expect(page.getByRole("link", { name: /Перейти в Discord/i })).toHaveAttribute("href", /^https:\/\/discord\.gg\//);
  });

  test("depth carousel supports keyboard input and reduced motion", async ({ page }) => {
    const carousel = page.getByRole("region", { name: "Направления участия" });
    const viewport = carousel.locator(".depth-carousel__viewport");
    await viewport.focus();
    await page.keyboard.press("ArrowRight");
    await expect(carousel.getByText("Сообщество", { exact: true }).last()).toBeVisible();
    if (test.info().project.name === "reduced-motion") expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  });
});
