import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const OUTPUT = path.resolve('interactive-audit-results');
const failures = [];
const completed = [];

const escapeMarkdown = value => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
const url = route => `${BASE_URL}/${route}`;
const requireTrue = (condition, message) => { if (!condition) throw new Error(message); };

async function runTest(name, action) {
  try {
    await action();
    completed.push(name);
    console.log(`PASS: ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.error(`FAIL: ${name}:`, error);
  }
}

async function waitForApp(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(250);
}

async function testStudyAndLibrary(context) {
  const page = await context.newPage();
  const title = 'Christ at the Center of the Home';
  await runTest('Study favorite, completion, notes, progress, and reload persistence', async () => {
    await page.goto(url('marriage-family-study.html?study=1'));
    await waitForApp(page);
    await page.waitForSelector('#favorite-study', { timeout: 15000 });
    await page.click('#favorite-study');
    await page.click('#complete-study');
    await page.fill('#study-notes-input', 'Interactive audit note for Marriage and Family Study 1.');
    await page.click('#save-study-notes');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(450);

    let state = await page.evaluate(() => JSON.parse(localStorage.getItem('nldg-study-state') || '{}')['family-christ-centered-home']);
    requireTrue(state?.favorite === true, 'Study favorite was not saved.');
    requireTrue(state?.completed === true, 'Study completion was not saved.');
    requireTrue(state?.notes?.includes('Interactive audit note'), 'Study notes were not saved.');
    requireTrue(state?.progress === 100, 'Completed study did not store 100% progress.');

    await page.reload();
    await waitForApp(page);
    await page.waitForSelector('#favorite-study');
    requireTrue((await page.textContent('#favorite-study')).includes('Favorited'), 'Favorite state did not survive reload.');
    requireTrue((await page.textContent('#complete-study')).includes('Incomplete'), 'Completion state did not survive reload.');
    requireTrue((await page.inputValue('#study-notes-input')).includes('Interactive audit note'), 'Study notes did not survive reload.');
  });

  await runTest('My Library favorite and completed filters synchronize with study state', async () => {
    await page.goto(url('study-library.html'));
    await waitForApp(page);
    await page.waitForSelector('#libraryGrid .library-card', { timeout: 15000 });
    const favoriteCount = Number(await page.textContent('#favoriteCount'));
    const completeCount = Number(await page.textContent('#completeCount'));
    requireTrue(favoriteCount >= 1, 'Library favorite count did not include the study-page favorite.');
    requireTrue(completeCount >= 1, 'Library completed count did not include the study-page completion.');

    await page.click('.library-filter[data-filter="favorites"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#libraryGrid .library-card', { hasText: title }).count() > 0, 'Favorited study was missing from the Favorites filter.');

    await page.click('.library-filter[data-filter="completed"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#libraryGrid .library-card', { hasText: title }).count() > 0, 'Completed study was missing from the Completed filter.');
  });

  await runTest('My Journey displays study-page favorites and completion', async () => {
    await page.goto(url('dashboard.html'));
    await waitForApp(page);
    await page.waitForSelector('#favorites-grid', { timeout: 15000 });
    requireTrue(await page.locator('#favorites-grid', { hasText: title }).count() > 0, 'My Journey did not display the study-page favorite.');
    requireTrue(await page.locator('#completed-grid', { hasText: title }).count() > 0, 'My Journey did not display the study-page completion.');
  });

  await runTest('Dashboard notes save and export', async () => {
    await page.goto(url('dashboard.html'));
    await waitForApp(page);
    await page.fill('#note-title', 'Interactive Audit Note');
    await page.fill('#note-journal', 'Saved from the automated interactive review.');
    await page.fill('#note-prayer', 'Lord, guide this ministry.');
    await page.click('#quick-note-form button[type="submit"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#notes-list', { hasText: 'Interactive Audit Note' }).count() > 0, 'Dashboard note did not appear after saving.');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('nldg-notes-v1') || '[]'));
    requireTrue(stored.some(note => note.title === 'Interactive Audit Note'), 'Dashboard note was not stored locally.');

    const downloadPromise = page.waitForEvent('download');
    await page.click('#export-notes');
    const download = await downloadPromise;
    requireTrue(download.suggestedFilename() === 'no-labels-personal-notes.txt', 'Notes export used an unexpected filename.');
  });

  await runTest('Continue-reading history preserves query-based study URLs', async () => {
    await page.goto(url('marriage-family-study.html?study=2'));
    await waitForApp(page);
    await page.waitForSelector('#favorite-study');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('nldg-last-study') || 'null'));
    requireTrue(saved?.url?.includes('marriage-family-study.html?study=2'), 'Continue-reading history lost the study query parameter.');
  });

  await page.close();
}

async function testSearchAndExplorers(context) {
  const page = await context.newPage();
  await runTest('Site Search and content-type filters', async () => {
    await page.goto(url('search.html'));
    await waitForApp(page);
    await page.waitForSelector('#site-search');
    await page.fill('#site-search', 'When God Feels Silent');
    await page.waitForTimeout(250);
    requireTrue(await page.locator('#search-results', { hasText: 'When God Feels Silent' }).count() > 0, 'Search did not find the new devotional.');
    await page.click('[data-type="devotionals"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#search-results', { hasText: 'When God Feels Silent' }).count() > 0, 'Devotional filter removed the matching devotional.');
    await page.click('[data-type="articles"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#search-results', { hasText: 'When God Feels Silent' }).count() === 0, 'Article filter incorrectly retained devotional content.');
  });

  await runTest('My Library search and collection filters', async () => {
    await page.goto(url('study-library.html'));
    await waitForApp(page);
    await page.fill('#librarySearch', 'Marriage & Family');
    await page.waitForTimeout(200);
    requireTrue(await page.locator('#libraryGrid .library-card').count() > 0, 'Library search returned no Marriage & Family content.');
    await page.click('.library-filter[data-filter="studies"]');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#libraryGrid .library-card').count() > 0, 'Studies filter returned no content.');
  });

  await runTest('Topic Explorer selection updates results', async () => {
    await page.goto(url('topics.html'));
    await waitForApp(page);
    await page.waitForSelector('#topic-grid [data-topic]', { timeout: 15000 });
    const button = page.locator('#topic-grid [data-topic]').first();
    const topic = await button.getAttribute('data-topic');
    await button.click();
    await page.waitForTimeout(150);
    requireTrue((await page.textContent('#topic-results-heading')).toLowerCase().includes(topic.toLowerCase()), 'Topic results heading did not update.');
    requireTrue(await page.locator('#topic-results .study-card').count() > 0, 'Selected topic returned no studies.');
  });

  await runTest('Scripture Explorer selection updates results', async () => {
    await page.goto(url('scripture-index.html'));
    await waitForApp(page);
    await page.waitForSelector('#book-grid [data-book]', { timeout: 15000 });
    const button = page.locator('#book-grid [data-book]').first();
    const book = await button.getAttribute('data-book');
    await button.click();
    await page.waitForTimeout(150);
    requireTrue((await page.textContent('#scripture-results-heading')).includes(book), 'Scripture results heading did not update.');
    requireTrue(await page.locator('#scripture-results .study-card').count() > 0, 'Selected Bible book returned no studies.');
  });

  await page.close();
}

async function testNewBelieverAndMentor(context) {
  const page = await context.newPage();
  await runTest('New Believer Step 10 completion, notes, persistence, and next steps', async () => {
    await page.goto(url('new-believer-step.html?step=10'));
    await waitForApp(page);
    await page.waitForSelector('.step-check');
    const checks = page.locator('.step-check');
    for (let index = 0; index < await checks.count(); index += 1) await checks.nth(index).check();
    await page.fill('#lessonNotes', 'Interactive audit New Believer note.');
    await page.click('#saveNotes');
    requireTrue(!(await page.isDisabled('#completeStep')), 'Step completion remained disabled after every checklist item was checked.');
    await page.click('#completeStep');
    requireTrue((await page.textContent('#lessonStatus')).includes('Your Next Steps'), 'Step 10 did not offer the completion next-steps page.');
    requireTrue((await page.getAttribute('#nextStep', 'href')) === 'new-believer-complete.html', 'Step 10 next link does not point to the completion page.');
    const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('nldg-new-believers-progress') || '[]'));
    requireTrue(progress.includes(10), 'Step 10 completion was not saved.');
    requireTrue((await page.evaluate(() => localStorage.getItem('nldg-new-believers-notes-10')))?.includes('Interactive audit'), 'Step 10 notes were not saved.');
    await page.reload();
    await waitForApp(page);
    requireTrue((await page.textContent('#completeStep')).includes('Completed'), 'Step 10 completion did not survive reload.');
  });

  await runTest('Mentor Session 1 checklist, completion, notes, and persistence', async () => {
    await page.goto(url('new-believer-mentor-session.html?session=1'));
    await waitForApp(page);
    await page.waitForSelector('.mentor-check');
    const checks = page.locator('.mentor-check');
    for (let index = 0; index < await checks.count(); index += 1) await checks.nth(index).check();
    await page.fill('#mentorNotes', 'Interactive audit mentor follow-up note.');
    await page.click('#saveMentorNotes');
    requireTrue(!(await page.isDisabled('#completeSession')), 'Mentor completion remained disabled after every checklist item was checked.');
    await page.click('#completeSession');
    const completedSessions = await page.evaluate(() => JSON.parse(localStorage.getItem('nldg-mentor-sessions-complete') || '[]'));
    requireTrue(completedSessions.includes(1), 'Mentor Session 1 completion was not saved.');
    requireTrue((await page.evaluate(() => localStorage.getItem('nldg-mentor-notes-1')))?.includes('Interactive audit'), 'Mentor notes were not saved.');
    await page.reload();
    await waitForApp(page);
    requireTrue((await page.textContent('#completeSession')).includes('Completed'), 'Mentor Session 1 completion did not survive reload.');
  });

  await page.close();
}

async function testGames(context) {
  const page = await context.newPage();
  page.on('dialog', dialog => dialog.accept());
  await runTest('Church game supports eight teams, scoring, undo, reset, and presentation layout', async () => {
    await page.goto(url('games.html?presentation=1'));
    await waitForApp(page);
    const introButton = page.locator('#startShowBtn');
    if (await introButton.count() && await introButton.isVisible()) await introButton.click();
    await page.click('#openTournamentBtn');
    await page.selectOption('#teamCount', '8');
    await page.dispatchEvent('#teamCount', 'change');
    await page.waitForTimeout(150);
    requireTrue(await page.locator('#teamNames input').count() === 8, 'Tournament setup did not create eight team-name fields.');
    await page.click('#beginTournamentBtn');
    await page.waitForTimeout(200);
    requireTrue(await page.locator('#dynamicScoreboard .team').count() === 8, 'Live scoreboard did not show eight teams.');
    requireTrue(!(await page.locator('#scorebar').evaluate(element => element.classList.contains('hidden'))), 'Scoreboard remained hidden after tournament start.');

    await page.locator('[data-score-team="0"][data-score-delta="100"]').click();
    requireTrue((await page.locator('#dynamicScoreboard .team').first().locator('.score').textContent()).trim() === '100', 'Adding 100 points did not update Team 1.');
    requireTrue(!(await page.isDisabled('#undoScoreBtn')), 'Undo remained disabled after a score change.');
    await page.click('#undoScoreBtn');
    requireTrue((await page.locator('#dynamicScoreboard .team').first().locator('.score').textContent()).trim() === '0', 'Undo did not restore the previous score.');

    await page.locator('[data-score-team="0"][data-score-delta="100"]').click();
    await page.click('#resetScoresBtn');
    await page.waitForTimeout(120);
    const scores = await page.locator('#dynamicScoreboard .score').allTextContents();
    requireTrue(scores.every(score => score.trim() === '0'), 'Reset Scores did not return every team to zero.');
    requireTrue((await page.viewportSize()).width >= 375, 'Presentation page did not load in the audit viewport.');
  });
  await page.close();
}

function section(title, items, empty) {
  return [`## ${title}`, '', ...(items.length ? items.map(item => `- ${escapeMarkdown(item)}`) : [empty]), ''];
}

async function writeReport() {
  await fs.mkdir(OUTPUT, { recursive: true });
  const report = [
    '# Interactive Feature Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Result: **${failures.length ? 'FAILED' : 'PASSED'}** with ${failures.length} failure(s).`,
    '',
    ...section('Failures', failures, 'No interactive feature failures were found.'),
    ...section('Checks completed', completed, 'No interactive checks were completed.')
  ].join('\n');
  await fs.writeFile(path.join(OUTPUT, 'interactive-audit-report.md'), report, 'utf8');
  console.log(report);
}

await fs.rm(OUTPUT, { recursive: true, force: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
await context.addInitScript(() => {
  if (!sessionStorage.getItem('nldg-interactive-audit-started')) {
    localStorage.clear();
    sessionStorage.setItem('nldg-interactive-audit-started', '1');
  }
});
try {
  await testStudyAndLibrary(context);
  await testSearchAndExplorers(context);
  await testNewBelieverAndMentor(context);
  await testGames(context);
} finally {
  await context.close();
  await browser.close();
}
await writeReport();
if (failures.length) process.exitCode = 1;
