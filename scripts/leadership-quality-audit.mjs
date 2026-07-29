import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSource = await fs.readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const OUTPUT = path.resolve('leadership-quality-results');

const failures = [];
const warnings = [];
const completed = [];
const browserErrors = [];

const expectedStudies = [
  'Called Before Positioned',
  'Character Before Influence',
  'Leading Like Jesus',
  'Wisdom, Decisions, and Discernment',
  'Teaching Scripture Faithfully',
  'Building Healthy Teams',
  'Conflict, Correction, and Reconciliation',
  'Power, Accountability, and Boundaries',
  'Leading Through Change, Pressure, and Weariness',
  'Multiplying Leaders and Finishing Faithfully'
];

const viewports = [
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'small-laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 1000 }
];

const url = route => `${BASE_URL}/${route}`;
const escapeMarkdown = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');

function pass(message) {
  completed.push(message);
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function requireTrue(condition, message) {
  if (!condition) throw new Error(message);
}

async function runTest(name, task) {
  try {
    await task();
    pass(name);
  } catch (error) {
    fail(`${name}: ${error.message}`);
  }
}

async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(250);
}

async function inspectOverflow(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const viewport = root.clientWidth;
    const width = Math.max(root.scrollWidth, body?.scrollWidth || 0);
    const outside = [...document.querySelectorAll('body *')]
      .filter(element => {
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
        if (element.closest('[hidden], .hidden, [aria-hidden="true"]')) return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return false;
        return !['auto', 'scroll'].includes(style.overflowX) && (rect.right > viewport + 3 || rect.left < -3);
      })
      .slice(0, 8)
      .map(element => `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}.${String(element.className || '').trim().replace(/\s+/g, '.').slice(0, 70)}`);
    return { viewport, width, outside };
  });
}

async function runAxe(page, label) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    resultTypes: ['violations']
  }));
  for (const violation of result.violations) {
    const targets = violation.nodes.slice(0, 4).map(node => node.target.join(' ')).join(', ');
    const message = `${label}: ${violation.id} (${violation.impact || 'unknown'}) at ${targets}`;
    if (['critical', 'serious'].includes(violation.impact)) fail(message);
    else warn(message);
  }
  pass(`${label}: axe-core checked ${result.violations.length} violation group(s)`);
}

await fs.rm(OUTPUT, { recursive: true, force: true });
await fs.mkdir(OUTPUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));
page.on('console', message => {
  if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
});

try {
  await runTest('Leadership Center exposes the complete ten-study journey', async () => {
    const response = await page.goto(url('leadership.html'));
    requireTrue(response && response.status() < 400, `Leadership Center returned HTTP ${response?.status() ?? 'no response'}`);
    await waitForApp(page);
    requireTrue(await page.locator('h1').count() === 1, 'Leadership Center must have exactly one H1');
    requireTrue(await page.locator('.ld-study-card').count() === 10, 'Leadership Center must show ten study cards');
    for (let number = 1; number <= 10; number += 1) {
      requireTrue(await page.locator(`a[href="leadership-study.html?study=${number}"]`).count() > 0, `Study ${number} link is missing`);
    }
  });

  await runTest('Leadership data API contains ten ordered studies', async () => {
    await page.goto(url('leadership-study.html?study=1'));
    await waitForApp(page);
    const data = await page.evaluate(() => window.NLDG_LEADERSHIP_API.all().map(study => ({
      number: study.number,
      title: study.title,
      slug: study.slug,
      previous: study.previous || null,
      next: study.next || null
    })));
    requireTrue(data.length === 10, `Expected ten studies, found ${data.length}`);
    data.forEach((study, index) => {
      requireTrue(study.number === index + 1, `Study order breaks at position ${index + 1}`);
      requireTrue(study.title === expectedStudies[index], `Unexpected title for Study ${index + 1}: ${study.title}`);
      requireTrue(Boolean(study.slug), `Study ${index + 1} has no slug`);
      if (index === 0) requireTrue(study.previous === null, 'Study 1 should not have a previous study');
      if (index > 0) requireTrue(Boolean(study.previous), `Study ${index + 1} is missing previous navigation`);
      if (index < 9) requireTrue(Boolean(study.next), `Study ${index + 1} is missing next navigation`);
      if (index === 9) requireTrue(study.next === null, 'Study 10 should not have a next study');
    });
  });

  for (let number = 1; number <= 10; number += 1) {
    await runTest(`Study ${number} renders content and correct sequence controls`, async () => {
      const response = await page.goto(url(`leadership-study.html?study=${number}`));
      requireTrue(response && response.status() < 400, `Study ${number} returned HTTP ${response?.status() ?? 'no response'}`);
      await waitForApp(page);
      requireTrue(await page.locator('body[data-study-page]').count() === 1, `Study ${number} did not set its study identity`);
      requireTrue((await page.locator('h1').textContent())?.trim() === expectedStudies[number - 1], `Study ${number} title is incorrect`);
      requireTrue((await page.locator('.study-label').textContent())?.includes(`Study ${number} of 10`), `Study ${number} position label is incorrect`);
      requireTrue(await page.locator('.ld-block').count() >= 8, `Study ${number} has too few content sections`);
      requireTrue(await page.locator('.ld-reflection-fields textarea').count() > 0, `Study ${number} has no reflection fields`);
      requireTrue(await page.locator('.ld-reflection-fields label textarea').count() === await page.locator('.ld-reflection-fields textarea').count(), `Study ${number} reflection fields are not properly labeled`);
      requireTrue(await page.getByRole('button', { name: 'Print Study' }).count() === 1, `Study ${number} print control is missing`);
      requireTrue(!(await page.locator('main').textContent()).includes('Loading study'), `Study ${number} remained in its loading state`);
      if (number === 1) {
        requireTrue(await page.locator('a[href="leadership.html"]').filter({ hasText: 'Journey Home' }).count() === 1, 'Study 1 journey-home link is missing');
      } else {
        requireTrue(await page.locator(`a[href="leadership-study.html?study=${number - 1}"]`).count() > 0, `Study ${number} previous link is incorrect`);
      }
      if (number < 10) {
        requireTrue(await page.locator(`a[href="leadership-study.html?study=${number + 1}"]`).count() > 0, `Study ${number} next link is incorrect`);
      } else {
        requireTrue((await page.locator('main').textContent()).includes('Journey completion'), 'Study 10 completion section is missing');
      }
    });
  }

  await runTest('Favorites, completion, progress, and private notes survive reload', async () => {
    await page.goto(url('index.html'));
    await page.evaluate(() => localStorage.clear());
    await page.goto(url('leadership-study.html?study=1'));
    await waitForApp(page);
    await page.locator('#favorite-study').click();
    await page.locator('#complete-study').click();
    await page.locator('#study-notes-input').fill('Leadership quality review note.');
    await page.locator('#save-study-notes').click();
    requireTrue((await page.locator('#notes-status').textContent())?.includes('Notes saved'), 'Notes did not report a saved state');
    await page.reload();
    await waitForApp(page);
    requireTrue(await page.locator('#favorite-study').getAttribute('aria-pressed') === 'true', 'Favorite state did not survive reload');
    requireTrue((await page.locator('#study-progress-label').textContent())?.trim() === 'Completed', 'Completion state did not survive reload');
    requireTrue(await page.locator('#study-notes-input').inputValue() === 'Leadership quality review note.', 'Private notes did not survive reload');
  });

  await runTest('Leadership appears in the searchable study library', async () => {
    await page.goto(url('studies.html'));
    await waitForApp(page);
    await page.locator('#study-search').fill('Called Before Positioned');
    await page.waitForTimeout(250);
    const result = page.locator('a[href="leadership-study.html?study=1"]');
    requireTrue(await result.count() > 0, 'Study 1 did not appear in study search');
    requireTrue(await result.first().isVisible(), 'Study 1 search result was not visible');
  });

  for (const viewport of viewports) {
    for (const route of ['leadership.html', 'leadership-study.html?study=1', 'leadership-study.html?study=10']) {
      await runTest(`${route} fits ${viewport.name}`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(url(route));
        await waitForApp(page);
        const layout = await inspectOverflow(page);
        requireTrue(layout.width <= layout.viewport + 2, `Document width ${layout.width}px exceeds ${layout.viewport}px viewport; ${layout.outside.join(', ')}`);
        requireTrue(layout.outside.length === 0, `Elements extend outside the viewport: ${layout.outside.join(', ')}`);
      });
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of ['leadership.html', 'leadership-study.html?study=1', 'leadership-study.html?study=8', 'leadership-study.html?study=10']) {
    await page.goto(url(route));
    await waitForApp(page);
    await runAxe(page, route);
  }

  for (const number of [1, 10]) {
    await runTest(`Study ${number} produces a printable PDF`, async () => {
      await page.goto(url(`leadership-study.html?study=${number}`));
      await waitForApp(page);
      await page.emulateMedia({ media: 'print' });
      const destination = path.join(OUTPUT, `leadership-study-${number}.pdf`);
      await page.pdf({ path: destination, format: 'Letter', printBackground: true });
      const stat = await fs.stat(destination);
      requireTrue(stat.size > 10000, `Printed PDF is unexpectedly small at ${stat.size} bytes`);
      await page.emulateMedia({ media: 'screen' });
    });
  }
} finally {
  await context.close();
  await browser.close();
}

if (browserErrors.length) {
  browserErrors.forEach(error => warn(error));
}

const section = (title, items, empty) => [
  `## ${title}`,
  '',
  ...(items.length ? items.map(item => `- ${escapeMarkdown(item)}`) : [empty]),
  ''
];

const report = [
  '# Leadership Quality Audit',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `Result: **${failures.length ? 'FAILED' : 'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,
  '',
  ...section('Failures', failures, 'No Leadership quality failures were found.'),
  ...section('Warnings for review', warnings, 'No Leadership quality warnings were found.'),
  ...section('Checks completed', completed, 'No Leadership quality checks were completed.'),
  '## Artifacts',
  '',
  '- `leadership-study-1.pdf`',
  '- `leadership-study-10.pdf`',
  ''
].join('\n');

await fs.writeFile(path.join(OUTPUT, 'leadership-quality-report.md'), report, 'utf8');
console.log(report);
if (failures.length) process.exitCode = 1;
