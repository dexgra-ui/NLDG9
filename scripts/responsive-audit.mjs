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
  { name: 'tablet-landscape-1180', width: 1180, height: 820 },
  { name: 'desktop-1440', width: 1440, height: 1000 }
];

const pages = [
  { name: 'home', url: 'index.html' },
  { name: 'study-center', url: 'studies.html' },
  { name: 'faith-truth-participant', url: 'current-events-series.html?week=1', prepare: 'faith-truth-participant' },
  { name: 'faith-truth-leader', url: 'current-events-series.html?week=1', prepare: 'faith-truth-leader' },
  { name: 'faith-truth-teaching', url: 'current-events-series.html?week=1', prepare: 'faith-truth-teaching' },
  { name: 'faith-truth-print', url: 'current-events-series.html?week=1', prepare: 'faith-truth-print' },
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
  { name: 'resource-center', url: 'resource-center.html' },
  { name: 'my-library', url: 'study-library.html' },
  { name: 'game-center', url: 'play.html' },
  { name: 'church-games', url: 'games.html?presentation=1', prepare: 'games' },
  { name: 'team-game', url: 'multi-team-game-v095.html?game=scripture-or-suspicion.html&group=family' }
];

const printPages = [
  { name: 'marriage-family-study', url: 'marriage-family-study.html?study=1' },
  { name: 'difficult-questions-study', url: 'difficult-questions-study.html?study=1' },
  { name: 'new-believer-toolkit-packet', url: 'new-believer-toolkit-packet.html' },
  { name: 'weekly-devotional', url: 'devotionals/when-following-jesus-is-inconvenient.html' },
  { name: 'newsletter-issue-01', url: 'newsletter/who-god-says-you-are.html' }
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
  if (kind?.startsWith('faith-truth-')) {
    const view = kind.replace('faith-truth-', '');
    const selector = `.v2-view-switcher-shell [data-view="${view}"]`;
    await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    await page.locator(selector).click();
    await page.waitForTimeout(250);
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

async function inspectFaithTruth(page, expectedView) {
  return page.evaluate(expected => {
    const visible = element => Boolean(element) && !element.hidden && getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden';
    const allViewGroups = [...document.querySelectorAll('[role="tablist"]')].filter(group => group.querySelector('[data-view="participant"]') && group.querySelector('[data-view="leader"]'));
    const switchers = [...document.querySelectorAll('.v2-view-switcher-shell .v2-view-tabs')];
    const switcher = switchers[0] || null;
    const buttons = switcher ? [...switcher.querySelectorAll('[data-view]')] : [];
    const active = buttons.filter(button => button.getAttribute('aria-selected') === 'true').map(button => button.dataset.view);
    const labels = buttons.map(button => (button.textContent || '').trim());
    const rows = [...new Set(buttons.map(button => Math.round(button.getBoundingClientRect().top / 4) * 4))].length;
    const minButtonHeight = buttons.length ? Math.min(...buttons.map(button => button.getBoundingClientRect().height)) : 0;
    const panels = {
      participant: document.querySelector('.v2-participant-guide'),
      leader: document.querySelector('.v2-leader-guide'),
      teaching: document.querySelector('.v2-teaching-view'),
      print: document.querySelector('.v2-print-view')
    };
    const visibleViews = Object.entries(panels).filter(([, panel]) => visible(panel)).map(([name]) => name);
    const sidebar = document.querySelector('.lesson-sidebar');
    const sidebarVisible = visible(sidebar);
    const layout = document.querySelector('.lesson-layout');
    const article = document.querySelector('.series-lesson');
    const layoutRect = layout?.getBoundingClientRect();
    const articleRect = article?.getBoundingClientRect();
    const articleFill = layoutRect?.width && articleRect?.width ? articleRect.width / layoutRect.width : 0;
    return {
      expected,
      bodyView: document.body.dataset.v2View || '',
      allViewGroupCount: allViewGroups.length,
      switcherCount: switchers.length,
      tabCount: buttons.length,
      active,
      labels,
      rows,
      minButtonHeight,
      visibleViews,
      sidebarVisible,
      fullWidthClass: Boolean(layout?.classList.contains('v2-full-width-view')),
      articleFill
    };
  }, expectedView);
}

function validateFaithTruth(state, viewport, label) {
  const expectedLabels = ['Participant Guide', 'Expanded Leader Guide', 'Teaching Guide', 'Print'];
  if (state.allViewGroupCount !== 1 || state.switcherCount !== 1) failures.push(`${label}: expected exactly one four-view switcher, found ${state.allViewGroupCount} related tab list(s) and ${state.switcherCount} polished switcher(s).`);
  if (state.tabCount !== 4) failures.push(`${label}: expected 4 guide-view controls, found ${state.tabCount}.`);
  if (JSON.stringify(state.labels) !== JSON.stringify(expectedLabels)) failures.push(`${label}: unexpected view labels ${JSON.stringify(state.labels)}.`);
  if (state.active.length !== 1 || state.active[0] !== state.expected) failures.push(`${label}: expected active view ${state.expected}, got ${JSON.stringify(state.active)}.`);
  if (state.bodyView !== state.expected) failures.push(`${label}: body view state is ${state.bodyView || 'unset'}, expected ${state.expected}.`);
  if (state.visibleViews.length !== 1 || state.visibleViews[0] !== state.expected) failures.push(`${label}: expected only ${state.expected} panel visible, got ${JSON.stringify(state.visibleViews)}.`);
  if (state.minButtonHeight < 44) failures.push(`${label}: smallest view control is ${Math.round(state.minButtonHeight)}px high; minimum target is 44px.`);
  const expectedRows = viewport.width <= 1024 ? 2 : 1;
  if (state.rows !== expectedRows) failures.push(`${label}: expected ${expectedRows} switcher row(s), found ${state.rows}.`);
  if (state.expected === 'participant') {
    const shouldShowSidebar = viewport.width > 880;
    if (state.sidebarVisible !== shouldShowSidebar) failures.push(`${label}: participant sidebar visibility is ${state.sidebarVisible}, expected ${shouldShowSidebar} at ${viewport.width}px.`);
    if (state.fullWidthClass) failures.push(`${label}: participant view should not use the nonparticipant full-width layout class.`);
  } else {
    if (state.sidebarVisible) failures.push(`${label}: ${state.expected} view should not show the participant sidebar.`);
    if (!state.fullWidthClass) failures.push(`${label}: ${state.expected} view is missing the full-width layout class.`);
    if (state.articleFill < 0.94) failures.push(`${label}: ${state.expected} view fills only ${Math.round(state.articleFill * 100)}% of the lesson layout width.`);
  }
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
        if (item.prepare?.startsWith('faith-truth-')) {
          const expectedView = item.prepare.replace('faith-truth-', '');
          const state = await inspectFaithTruth(page, expectedView);
          validateFaithTruth(state, viewport, label);
        }
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
