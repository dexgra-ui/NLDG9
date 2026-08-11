import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axeSource = await fs.readFile(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const OUTPUT = path.resolve('accessibility-audit-results');

const pages = [
  { name: 'home', url: 'index.html' },
  { name: 'study-center', url: 'studies.html' },
  { name: 'men-of-faith', url: 'men-of-faith.html' },
  { name: 'women-of-faith', url: 'women-of-faith.html' },
  { name: 'marriage-family', url: 'marriage-family.html' },
  { name: 'marriage-family-study', url: 'marriage-family-study.html?study=1' },
  { name: 'difficult-questions', url: 'difficult-questions.html' },
  { name: 'difficult-questions-study', url: 'difficult-questions-study.html?study=1' },
  { name: 'new-believers', url: 'new-believers.html' },
  { name: 'devotionals', url: 'devotionals.html' },
  { name: 'weekly-devotional', url: 'devotionals/when-following-jesus-is-inconvenient.html' },
  { name: 'newsletter-archive', url: 'newsletter.html' },
  { name: 'newsletter-issue-01', url: 'newsletter/who-god-says-you-are.html' },
  { name: 'articles', url: 'articles.html' },
  { name: 'resource-center', url: 'resource-center.html' },
  { name: 'search', url: 'search.html' },
  { name: 'my-library', url: 'study-library.html' },
  { name: 'my-journey', url: 'dashboard.html' },
  { name: 'ministry-tools', url: 'ministry-tools.html' },
  { name: 'game-center', url: 'play.html' },
  { name: 'church-games', url: 'games.html?presentation=1', prepare: 'games' },
  { name: 'team-game', url: 'multi-team-game-v095.html?game=scripture-or-suspicion.html&group=family' }
];

const failures = [];
const warnings = [];
const completed = [];
const details = [];

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
      await page.waitForTimeout(250);
    }
  }
  await page.waitForTimeout(150);
}

function summarizeNodes(nodes) {
  return nodes.slice(0, 5).map(node => `${node.target.join(' ')}: ${node.failureSummary || node.html}`).join(' | ');
}

async function runAxe(page, label) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => window.axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    resultTypes: ['violations']
  }));

  for (const violation of result.violations) {
    const entry = `${label}: ${violation.id} (${violation.impact || 'unknown'}) — ${violation.help}. ${summarizeNodes(violation.nodes)}`;
    if (['critical', 'serious'].includes(violation.impact)) failures.push(entry);
    else warnings.push(entry);
  }
  details.push(`${label}: axe checked ${result.testEngine.version}; ${result.violations.length} violation group(s).`);
}

async function inspectStructure(page, label) {
  const result = await page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && !element.closest('[hidden], .hidden');
    };
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(element => ({
      level: Number(element.tagName.slice(1)),
      text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
    }));
    const jumps = [];
    headings.forEach((heading, index) => {
      if (index && heading.level > headings[index - 1].level + 1) jumps.push(`${headings[index - 1].level}→${heading.level} before “${heading.text}”`);
    });
    const h1s = headings.filter(heading => heading.level === 1);
    const imagesWithoutAlt = [...document.images].filter(image => !image.hasAttribute('alt')).map(image => image.src.split('/').pop());
    const positiveTabindex = [...document.querySelectorAll('[tabindex]')].filter(element => Number(element.getAttribute('tabindex')) > 0).map(element => element.outerHTML.slice(0, 120));
    const header = document.querySelector('.site-header');
    const main = document.querySelector('main');
    const skip = document.querySelector('.skip-link');
    const skipTarget = skip?.getAttribute('href')?.startsWith('#') ? document.querySelector(skip.getAttribute('href')) : null;
    const menu = header?.querySelector('.menu');
    const activeLinks = [...document.querySelectorAll('.site-header nav a.active, .section-navigation a.active')];
    return {
      h1Count: h1s.length,
      h1s,
      jumps,
      imagesWithoutAlt,
      positiveTabindex,
      standardPage: Boolean(header && main),
      skipPresent: Boolean(skip),
      skipTargetPresent: Boolean(skipTarget),
      menuPresent: Boolean(menu),
      menuControls: menu?.getAttribute('aria-controls') || '',
      menuExpanded: menu?.getAttribute('aria-expanded') || '',
      activeWithoutCurrent: activeLinks.filter(link => link.getAttribute('aria-current') !== 'page').map(link => (link.textContent || '').trim())
    };
  });

  if (result.h1Count === 0) warnings.push(`${label}: no visible H1 heading was found.`);
  if (result.h1Count > 1) failures.push(`${label}: ${result.h1Count} visible H1 headings were found.`);
  if (result.jumps.length) warnings.push(`${label}: heading-level jumps found: ${result.jumps.join('; ')}.`);
  if (result.imagesWithoutAlt.length) failures.push(`${label}: images without alt attributes: ${result.imagesWithoutAlt.join(', ')}.`);
  if (result.positiveTabindex.length) failures.push(`${label}: positive tabindex values found: ${result.positiveTabindex.join(' | ')}.`);
  if (result.standardPage && (!result.skipPresent || !result.skipTargetPresent)) failures.push(`${label}: skip link or its main-content target is missing.`);
  if (result.menuPresent && (!result.menuControls || !['true', 'false'].includes(result.menuExpanded))) failures.push(`${label}: menu button is missing aria-controls or a valid aria-expanded state.`);
  if (result.activeWithoutCurrent.length) warnings.push(`${label}: active navigation links without aria-current="page": ${result.activeWithoutCurrent.join(', ')}.`);
  completed.push(`${label}: structure, headings, images, skip link, menu state, and navigation state checked.`);
}

async function testKeyboardMenu(page, label) {
  const menu = page.locator('.site-header .menu');
  if (!(await menu.count()) || !(await menu.isVisible())) return;
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(120);
  const expanded = await menu.getAttribute('aria-expanded');
  const active = await page.evaluate(() => ({
    tag: document.activeElement?.tagName?.toLowerCase() || '',
    insideNav: Boolean(document.activeElement?.closest('.site-header nav'))
  }));
  if (expanded !== 'true') failures.push(`${label}: keyboard activation did not open the mobile menu.`);
  if (!active.insideNav) warnings.push(`${label}: focus did not move into the mobile navigation after opening.`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(80);
  const closed = await menu.getAttribute('aria-expanded');
  const returned = await page.evaluate(() => document.activeElement === document.querySelector('.site-header .menu'));
  if (closed !== 'false') failures.push(`${label}: Escape did not close the mobile menu.`);
  if (!returned) warnings.push(`${label}: focus did not return to the menu button after Escape.`);
  completed.push(`${label}: keyboard menu open, focus movement, Escape close, and focus return checked.`);
}

async function testFocusVisibility(page, label) {
  await page.evaluate(() => document.activeElement?.blur());
  let checked = 0;
  let visibleCount = 0;
  for (let step = 0; step < 12; step += 1) {
    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const element = document.activeElement;
      if (!element || element === document.body) return null;
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent || element.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 70),
        visible: style.outlineStyle !== 'none' || style.boxShadow !== 'none' || style.borderColor !== 'rgba(0, 0, 0, 0)'
      };
    });
    if (!state) continue;
    checked += 1;
    if (state.visible) visibleCount += 1;
    if (checked >= 6) break;
  }
  if (!checked) failures.push(`${label}: keyboard Tab did not reach any focusable controls.`);
  else if (!visibleCount) failures.push(`${label}: no visible focus indicator was detected on the first ${checked} keyboard stops.`);
  else completed.push(`${label}: visible focus detected on ${visibleCount} of the first ${checked} keyboard stops.`);
}

async function auditDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const item of pages) {
    const label = item.name;
    try {
      const response = await page.goto(`${BASE_URL}/${item.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) {
        failures.push(`${label}: returned HTTP ${response?.status() ?? 'no response'}.`);
        continue;
      }
      await preparePage(page, item.prepare);
      await runAxe(page, label);
      await inspectStructure(page, label);
      await testFocusVisibility(page, label);
    } catch (error) {
      failures.push(`${label}: ${error.message}`);
    }
  }
  await context.close();
}

async function auditMobileKeyboard(browser) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const item of pages.filter(entry => !['church-games', 'team-game'].includes(entry.name))) {
    const label = `${item.name} mobile menu`;
    try {
      const response = await page.goto(`${BASE_URL}/${item.url}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      if (!response || response.status() >= 400) continue;
      await preparePage(page, item.prepare);
      await testKeyboardMenu(page, label);
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
    '# Accessibility Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Result: **${failures.length ? 'FAILED' : 'PASSED'}** with ${failures.length} failure(s) and ${warnings.length} warning(s).`,
    '',
    ...section('Failures', failures, 'No serious automated accessibility failures were found.'),
    ...section('Warnings for review', warnings, 'No moderate accessibility warnings were found.'),
    ...section('Checks completed', completed, 'No accessibility checks were completed.'),
    ...section('Technical details', details, 'No axe-core details were recorded.')
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT, 'accessibility-audit-report.md'), report, 'utf8');
  console.log(report);
}

await ensureOutput();
const browser = await chromium.launch({ headless: true });
try {
  await auditDesktop(browser);
  await auditMobileKeyboard(browser);
} finally {
  await browser.close();
}
await writeReport();
if (failures.length) process.exitCode = 1;
