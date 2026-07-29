import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const OUTPUT = path.resolve('responsive-audit-results');

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'small-laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 1000 }
];

const pages = [
  { name: 'home', url: 'index.html' },
  { name: 'study-center', url: 'studies.html' },
  { name: 'men-of-faith', url: 'men-of-faith.html' },
  { name: 'women-of-faith', url: 'women-of-faith.html' },
  { name: 'marriage-family', url: 'marriage-family.html' },
  { name: 'marriage-family-study', url: 'marriage-family-study.html?study=1' },
  { name: 'new-believers', url: 'new-believers.html' },
  { name: 'devotionals', url: 'devotionals.html' },
  { name: 'when-god-feels-silent', url: 'devotional.html?id=when-god-feels-silent' },
  { name: 'resource-center', url: 'resource-center.html' },
  { name: 'my-library', url: 'study-library.html' },
  { name: 'game-center', url: 'play.html' },
  { name: 'church-games', url: 'games.html?presentation=1', prepare: 'games' },
  { name: 'team-game', url: 'multi-team-game-v095.html?game=scripture-or-suspicion.html&group=family' }
];

const printPages = [
  { name: 'marriage-family-study', url: 'marriage-family-study.html?study=1' },
  { name: 'new-believer-toolkit-packet', url: 'new-believer-toolkit-packet.html' },
  { name: 'when-god-feels-silent', url: 'devotional.html?id=when-god-feels-silent' }
];

const failures = [];
const warnings = [];
const completed = [];

const escapeMarkdown = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');

async function ensureOutput() {
  await fs.rm(OUTPUT, { recursive: true, force: true });
  await fs.mkdir(OUTPUT, { recursive: true });
}

async function preparePage(page, kind) {
  await page.waitForLoadState('networkidle').catch(() => {});
  if (kind === 'games') {
    const start = page.locator('#startShowBtn');
    if (await start.count()) {
      await start.click().catch(() => {});
      await page.waitForTimeout(350);
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const viewportWidth = root.clientWidth;
    const documentWidth = Math.max(root.scrollWidth, body?.scrollWidth || 0);
    const overflow = documentWidth > viewportWidth + 2;

    const outside = [...document.querySelectorAll('body *')]
      .filter(element => {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
        if (element.closest('[hidden], .hidden, [aria-hidden="true"]')) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return false;
        const scrollable = ['auto', 'scroll'].includes(style.overflowX);
        return !scrollable && (rect.right > viewportWidth + 3 || rect.left < -3);
      })
      .slice(0, 12)
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || '',
          className: typeof element.className === 'string' ? element.className.slice(0, 90) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        };
      });

    const clipped = [...document.querySelectorAll('button, a, h1, h2, h3, label, strong')]
      .filter(element => {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        if (element.closest('[hidden], .hidden, .sr-only')) return false;
        const hasText = (element.textContent || '').trim().length > 0;
        if (!hasText) return false;
        const overflowX = ['hidden', 'clip'].includes(style.overflowX);
        const overflowY = ['hidden', 'clip'].includes(style.overflowY);
        const clippedHorizontally = overflowX && element.scrollWidth > element.clientWidth + 3;
        const clippedVertically = overflowY && element.scrollHeight > element.clientHeight + 3;
        const noWrapOverflow = style.whiteSpace === 'nowrap' && element.scrollWidth > element.clientWidth + 3;
        const intentionalEllipsis = style.textOverflow === 'ellipsis';
        return !intentionalEllipsis && (clippedHorizontally || clippedVertically || noWrapOverflow);
      })
      .slice(0, 12)
      .map(element => ({
        tag: element.tagName.toLowerCase(),
        id: element.id || '',
        className: typeof element.className === 'string' ? element.className.slice(0, 90) : '',
        text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
      }));

    return { viewportWidth, documentWidth, overflow, outside, clipped };
  });
}

async function auditResponsive(browser) {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const item of pages) {
      const destination = `${BASE_URL}/${item.url}`;
      const label = `${item.name} at ${viewport.width}px`;
      try {
        const response = await page.goto(destination, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (!response || response.status() >= 400) {
          failures.push(`${label}: returned HTTP ${response?.status() ?? 'no response'}.`);
          continue;
        }
        await preparePage(page, item.prepare);
        const layout = await inspectLayout(page);
        const directory = path.join(OUTPUT, viewport.name);
        await fs.mkdir(directory, { recursive: true });
        await page.screenshot({ path: path.join(directory, `${item.name}.png`), fullPage: true });

        if (layout.overflow) {
          failures.push(`${label}: document width ${layout.documentWidth}px exceeds viewport ${layout.viewportWidth}px. Offenders: ${JSON.stringify(layout.outside)}`);
        }
        if (layout.clipped.length) {
          warnings.push(`${label}: possible clipped text in ${JSON.stringify(layout.clipped)}.`);
        }
        completed.push(`${label}: screenshot captured${layout.overflow ? ' with overflow' : ' without horizontal document overflow'}.`);
      } catch (error) {
        failures.push(`${label}: ${error.message}`);
      }
    }
    await context.close();
  }
}

async function auditChurchDisplay(browser) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const item of pages.filter(entry => entry.prepare === 'games' || entry.name === 'team-game')) {
    const label = `${item.name} at 1920×1080 church display`;
    try {
      const response = await page.goto(`${BASE_URL}/${item.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) {
        failures.push(`${label}: returned HTTP ${response?.status() ?? 'no response'}.`);
        continue;
      }
      await preparePage(page, item.prepare);
      const layout = await inspectLayout(page);
      const directory = path.join(OUTPUT, 'church-display-1920');
      await fs.mkdir(directory, { recursive: true });
      await page.screenshot({ path: path.join(directory, `${item.name}.png`), fullPage: true });
      if (layout.overflow) failures.push(`${label}: horizontal document overflow detected.`);
      completed.push(`${label}: screenshot captured.`);
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  await context.close();
}

async function auditPrint(browser) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await context.newPage();
  const directory = path.join(OUTPUT, 'print');
  await fs.mkdir(directory, { recursive: true });
  for (const item of printPages) {
    const label = `${item.name} print layout`;
    try {
      const response = await page.goto(`${BASE_URL}/${item.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      if (!response || response.status() >= 400) {
        failures.push(`${label}: returned HTTP ${response?.status() ?? 'no response'}.`);
        continue;
      }
      await page.emulateMedia({ media: 'print' });
      await page.pdf({ path: path.join(directory, `${item.name}.pdf`), format: 'Letter', printBackground: true, margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' } });
      completed.push(`${label}: PDF generated.`);
      await page.emulateMedia({ media: 'screen' });
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  await context.close();
}

function section(title, items, empty) {
  return [`## ${title}`, '', ...(items.length ? items.map(item => `- ${escapeMarkdown(item)}`) : [empty]), ''];
}

async function writeReport() {
  const report = [
    '# Responsive Visual Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Result: **${failures.length ? 'FAILED' : 'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,
    '',
    ...section('Failures', failures, 'No navigation failures or horizontal document overflow were detected.'),
    ...section('Warnings for visual review', warnings, 'No likely text clipping was detected by the automated check.'),
    ...section('Completed captures', completed, 'No pages were captured.')
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT, 'responsive-audit-report.md'), report, 'utf8');
  console.log(report);
}

await ensureOutput();
const browser = await chromium.launch({ headless: true });
try {
  await auditResponsive(browser);
  await auditChurchDisplay(browser);
  await auditPrint(browser);
} finally {
  await browser.close();
}
await writeReport();
if (failures.length) process.exitCode = 1;
