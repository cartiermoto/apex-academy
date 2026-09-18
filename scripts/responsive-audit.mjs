import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2] ?? ".";
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

/** Minimum comfortable tap target. Apple says 44pt, Material says 48dp. */
const TAP_MIN = Number(process.env.TAP_MIN ?? 44);

const DEVICES = [
  {
    name: "iphone14",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "pixel7",
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  },
  {
    name: "ipad-portrait",
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  },
  {
    name: "ipad-landscape",
    viewport: { width: 1180, height: 820 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "desktop",
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  },
  {
    name: "small-android",
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
];

const problems = [];

async function audit(page, label, device) {
  // Page-level horizontal overflow is the objective test.
  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return {
      scrollWidth: d.scrollWidth,
      clientWidth: d.clientWidth,
      bodyScroll: document.body.scrollWidth,
    };
  });

  if (overflow.scrollWidth > overflow.clientWidth + 1) {
    const culprits = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      const out = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right <= limit + 1 && r.left >= -1) continue;
        // ignore elements living inside their own horizontal scroller
        let p = el.parentElement,
          scrolled = false;
        while (p) {
          const ov = getComputedStyle(p).overflowX;
          if (ov === "auto" || ov === "scroll" || ov === "hidden") {
            scrolled = true;
            break;
          }
          p = p.parentElement;
        }
        if (scrolled) continue;
        out.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
      return out.slice(0, 8);
    });
    problems.push({
      device: device.name,
      view: label,
      type: "horizontal-overflow",
      ...overflow,
      culprits,
    });
  }

  // Tap targets that are too small on touch devices.
  if (device.hasTouch) {
    const small = await page.evaluate((min) => {
      const out = [];
      // Inline glossary terms are exempt (WCAG 2.5.8 "inline" exception): they sit
      // inside a sentence and get a larger invisible hit area via .term::after.
      for (const el of document.querySelectorAll(
        "button:not(.term), a[href], input, textarea",
      )) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.height < min || r.width < min) {
          out.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || "").trim().slice(0, 28),
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      }
      return out.slice(0, 8);
    }, TAP_MIN);
    if (small.length) {
      problems.push({ device: device.name, view: label, type: "small-tap-target", small });
    }
  }

  await page.screenshot({
    path: `${OUT}/${device.name}--${label}.png`,
    fullPage: false,
  });
}

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});

for (const device of DEVICES) {
  const context = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    isMobile: device.isMobile ?? false,
    hasTouch: device.hasTouch ?? false,
    userAgent: device.userAgent,
    colorScheme: "light",
  });

  await context.request.post(`${BASE}/api/auth/login`, {
    data: { password: "apex" },
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + String(e).slice(0, 160)));

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await audit(page, "home", device);
  await page.evaluate(() => document.getElementById("modulos")?.scrollIntoView());
  await page.waitForTimeout(250);
  await audit(page, "home-modules", device);

  await page.goto(`${BASE}/m/m01/variables`, { waitUntil: "networkidle" });
  await audit(page, "lesson-theory", device);

  // Glossary tooltip: open it (tap/click works everywhere) and make sure the
  // popover stays fully on screen.
  const term = page.locator("button.term").first();
  if (await term.count()) {
    await term.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -120));
    await page.waitForTimeout(200);
    await term.click();
    await page.waitForTimeout(350);
    const tip = await page.evaluate(() => {
      const el = document.querySelector('[role="tooltip"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        vw: window.innerWidth,
        vh: window.innerHeight,
      };
    });
    if (!tip) {
      problems.push({ device: device.name, view: "tooltip", type: "tooltip-did-not-open" });
    } else if (tip.left < 0 || tip.right > tip.vw || tip.top < 0 || tip.bottom > tip.vh) {
      problems.push({ device: device.name, view: "tooltip", type: "tooltip-off-screen", ...tip });
    }
    await audit(page, "tooltip", device);
    await page.keyboard.press("Escape");
  } else {
    problems.push({ device: device.name, view: "tooltip", type: "no-glossary-term-found" });
  }

  // Scroll to the first diagram and capture it.
  const fig = page.locator("figure").first();
  if (await fig.count()) {
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await audit(page, "lesson-diagram", device);
  }

  // Quiz tab
  await page.getByRole("button", { name: /^Quiz$/ }).first().click();
  await page.waitForTimeout(350);
  await audit(page, "lesson-quiz", device);

  // Exercise tab (the mobile editor is the risky one)
  await page.getByRole("button", { name: /Ejercicio|Exercise/ }).first().click();
  await page.waitForTimeout(350);
  const ta = page.locator("textarea").first();
  if (await ta.count()) {
    await ta.scrollIntoViewIfNeeded();
    await ta.click();
    await ta.fill("String accountName = 'Northwind Trading';\nInteger contactCount = 12;");
    await page.waitForTimeout(250);
  }
  await audit(page, "lesson-exercise", device);

  // A long code line: does it scroll inside its own box?
  if (await ta.count()) {
    await ta.fill(
      "String reallyLongLine = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';",
    );
    await page.waitForTimeout(250);
    await audit(page, "lesson-longline", device);
  }

  // Checkpoint: three diagrams + big code block
  await page.goto(`${BASE}/m/m01/checkpoint`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(300);
  await audit(page, "checkpoint", device);

  // Challenge card page
  await page.goto(`${BASE}/c/c1`, { waitUntil: "networkidle" });
  await audit(page, "challenge", device);

  // Mobile drawer
  if (device.viewport.width < 1024) {
    await page.goto(`${BASE}/m/m01/variables`, { waitUntil: "networkidle" });
    const burger = page.getByRole("button", { name: "Menu" });
    if (await burger.count()) {
      await burger.click();
      await page.waitForTimeout(400);
      await audit(page, "drawer", device);
    }
  }

  // Dark mode, one page
  await context.close();

  const dark = await browser.newContext({
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    isMobile: device.isMobile ?? false,
    hasTouch: device.hasTouch ?? false,
    userAgent: device.userAgent,
    colorScheme: "dark",
  });
  await dark.request.post(`${BASE}/api/auth/login`, { data: { password: "apex" } });
  const dpage = await dark.newPage();
  await dpage.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await audit(dpage, "home-dark", device);
  await dpage.evaluate(() => document.getElementById("modulos")?.scrollIntoView());
  await dpage.waitForTimeout(250);
  await audit(dpage, "home-dark-modules", device);
  await dpage.goto(`${BASE}/m/m01/colecciones`, { waitUntil: "networkidle" });
  const dfig = dpage.locator("figure").first();
  if (await dfig.count()) {
    await dfig.scrollIntoViewIfNeeded();
    await dpage.waitForTimeout(250);
  }
  await audit(dpage, "dark", device);
  await dark.close();

  if (consoleErrors.length) {
    problems.push({ device: device.name, type: "console-errors", consoleErrors });
  }
}

await browser.close();

console.log(JSON.stringify({ problemCount: problems.length, problems }, null, 2));
