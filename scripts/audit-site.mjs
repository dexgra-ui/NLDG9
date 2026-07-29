import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'site-audit-report.md');
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', '.cache', 'dist', 'coverage', 'tools']);
const EXCLUDED_FILES = new Set(['build-v0.9.0.html', 'builder.js', 'study-template.html', 'site-audit-report.md', 'scripts/accessibility-audit.mjs', 'scripts/responsive-audit.mjs', 'scripts/interactive-audit.mjs']);
const TEXT_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest']);
const ROUTE_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.pdf', '.zip']);

const errors = [];
const warnings = [];
const notes = [];

const slash = value => value.split(path.sep).join('/');
const relative = value => slash(path.relative(ROOT, value));

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function stripQueryAndHash(value) {
  return value.split('#')[0].split('?')[0];
}

function isIgnoredReference(value) {
  const trimmed = value.trim();
  return !trimmed || trimmed === '#' || trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.includes('${') || trimmed.includes('<%') || /^(?:https?:|mailto:|tel:|sms:|data:|blob:|javascript:|about:)/i.test(trimmed);
}

function resolveReference(sourceFile, reference) {
  let clean = stripQueryAndHash(reference.trim());
  if (isIgnoredReference(reference) || !clean) return null;
  try { clean = decodeURIComponent(clean); } catch {}
  if (clean.startsWith('/')) clean = clean.slice(1);
  const sourceDir = path.dirname(sourceFile);
  let resolved = clean.startsWith('./') || clean.startsWith('../')
    ? path.resolve(sourceDir, clean)
    : path.resolve(ROOT, clean);
  if (clean.endsWith('/')) resolved = path.join(resolved, 'index.html');
  return resolved;
}

function collectHtmlReferences(content) {
  const refs = [];
  const attributePattern = /\b(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
  let match;
  while ((match = attributePattern.exec(content))) refs.push(match[2]);
  return refs;
}

function collectScriptReferences(content) {
  const refs = [];
  const stringPattern = /(["'`])([^"'`\n]+?\.(?:html|js|mjs|css|json|webmanifest|png|jpe?g|webp|svg|ico|pdf|zip)(?:[?#][^"'`\n]*)?)\1/gi;
  let match;
  while ((match = stringPattern.exec(content))) refs.push(match[2]);
  return refs;
}

function collectInlineScriptReferences(content) {
  const refs = [];
  const scriptPattern = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptPattern.exec(content))) refs.push(...collectScriptReferences(match[1]));
  return refs;
}

function visibleHtmlText(content) {
  return content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function statusContextAllowed() {
  return false;
}

async function validateReferences(files, fileSet) {
  let checked = 0;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!TEXT_EXTENSIONS.has(ext)) continue;
    const content = await fs.readFile(file, 'utf8');
    const references = ext === '.html'
      ? [...collectHtmlReferences(content), ...collectInlineScriptReferences(content)]
      : collectScriptReferences(content);
    const unique = [...new Set(references)];
    for (const reference of unique) {
      const target = resolveReference(file, reference);
      if (!target) continue;
      const targetExt = path.extname(target).toLowerCase();
      if (targetExt && !ROUTE_EXTENSIONS.has(targetExt)) continue;
      checked += 1;
      if (!fileSet.has(path.normalize(target))) {
        errors.push(`Missing internal target: \`${relative(file)}\` → \`${reference}\``);
      }
    }

    if (ext === '.html') {
      const statusPattern = /\b(In Development|Coming Soon)\b/gi;
      let statusMatch;
      while ((statusMatch = statusPattern.exec(content))) {
        if (!statusContextAllowed(file, content, statusMatch.index)) {
          warnings.push(`Review status label \`${statusMatch[1]}\` in \`${relative(file)}\`.`);
        }
      }
      const visibleText = visibleHtmlText(content);
      const versions = [...visibleText.matchAll(/\b(?:Version|v)\s*\d+(?:\.\d+){1,3}\b/gi)].map(match => match[0]);
      for (const version of new Set(versions)) warnings.push(`Review visible version label \`${version}\` in \`${relative(file)}\`.`);
    }
  }
  notes.push(`Checked ${checked} unique internal file references across public HTML, JavaScript, styles, and data files.`);
}

async function validatePrimaryRoutes(fileSet) {
  const required = [
    'index.html','new-believers.html','studies.html','devotionals.html','articles.html',
    'resource-center.html','podcast.html','news.html','search.html','about.html','play.html',
    'site-map.html','study-library.html','dashboard.html','ministry-tools.html',
    'men-of-faith.html','women-of-faith.html','marriage-family.html','difficult-questions.html','leadership.html'
  ];
  for (const route of required) {
    if (!fileSet.has(path.join(ROOT, route))) errors.push(`Required primary route is missing: \`${route}\`.`);
  }
  notes.push(`Verified ${required.length} required primary and journey routes.`);
}

async function validateLegacyRoutes(fileSet) {
  const resourcesPath = path.join(ROOT, 'resources.html');
  if (!fileSet.has(resourcesPath)) {
    errors.push('Legacy route `resources.html` is missing instead of redirecting to `resource-center.html`.');
    return;
  }
  const content = await fs.readFile(resourcesPath, 'utf8');
  if (!/resource-center\.html/.test(content) || !/(?:http-equiv=["']refresh|location\.replace)/i.test(content)) {
    errors.push('Legacy route `resources.html` does not contain a working redirect to `resource-center.html`.');
  } else {
    notes.push('Confirmed the legacy Resources route redirects to the Resource Center.');
  }
}

async function validateQueryHistory(fileSet) {
  const scriptPath = path.join(ROOT, 'script.js');
  if (!fileSet.has(scriptPath)) {
    errors.push('`script.js` is missing, so query-based history preservation could not be checked.');
    return;
  }
  const content = await fs.readFile(scriptPath, 'utf8');
  const checks = [
    ['current page query is retained', /pageWithQuery\s*=\s*page\s*\+\s*location\.search/],
    ['library matching includes the query string', /item\.url\s*===\s*pageWithQuery/],
    ['saved study history includes the current query string', /location\.pathname\.split\([^)]*\)\.pop\(\)\s*\+\s*location\.search/]
  ];
  for (const [label, pattern] of checks) {
    if (!pattern.test(content)) errors.push(`Query-based history audit failed: ${label}.`);
  }
  if (checks.every(([, pattern]) => pattern.test(content))) notes.push('Confirmed query-based study pages preserve full URLs in matching and saved history.');
}

async function validateSequence(fileSet, fileName, label) {
  const dataPath = path.join(ROOT, fileName);
  if (!fileSet.has(dataPath)) {
    errors.push(`${label} data file is missing: \`${fileName}\`.`);
    return;
  }
  const content = await fs.readFile(dataPath, 'utf8');
  const slugs = new Set([...content.matchAll(/slug:\s*["']([^"']+)["']/g)].map(match => match[1]));
  const previous = [...content.matchAll(/previous:\s*["']([^"']+)["']/g)].map(match => match[1]);
  const next = [...content.matchAll(/next:\s*["']([^"']+)["']/g)].map(match => match[1]);
  for (const slug of [...previous, ...next]) {
    if (!slugs.has(slug)) errors.push(`${label} sequence points to missing study slug: \`${slug}\`.`);
  }
  notes.push(`Verified ${previous.length + next.length} ${label} previous/next references.`);
}

async function validateStudySequences(fileSet) {
  await validateSequence(fileSet,'marriage-family-data.js','Marriage & Family');
  await validateSequence(fileSet,'difficult-questions-data.js','Difficult Questions');
  await validateSequence(fileSet,'leadership-data.js','Leadership');

  const devotionalDataPath = path.join(ROOT, 'devotional-data.js');
  if (fileSet.has(devotionalDataPath)) {
    const content = await fs.readFile(devotionalDataPath, 'utf8');
    const ids = [...content.matchAll(/\bid:\s*["']([^"']+)["']/g)].map(match => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) errors.push(`Duplicate devotional IDs: ${[...new Set(duplicates)].join(', ')}.`);
    notes.push(`Verified ${ids.length} unique devotional IDs used by circular previous/next navigation.`);
  }
}

function reportSection(title, items, emptyMessage) {
  const lines = [`## ${title}`, ''];
  if (!items.length) lines.push(emptyMessage);
  else lines.push(...items.map(item => `- ${item}`));
  lines.push('');
  return lines;
}

async function main() {
  const allFiles = await walk(ROOT);
  const files = allFiles.filter(file => !EXCLUDED_FILES.has(relative(file)));
  const fileSet = new Set(allFiles.map(file => path.normalize(file)));
  await validatePrimaryRoutes(fileSet);
  await validateReferences(files, fileSet);
  await validateLegacyRoutes(fileSet);
  await validateQueryHistory(fileSet);
  await validateStudySequences(fileSet);

  const timestamp = new Date().toISOString();
  const report = [
    '# Site Link and Content-State Audit',
    '',
    `Generated: ${timestamp}`,
    '',
    `Result: **${errors.length ? 'FAILED' : 'PASSED'}** with ${errors.length} error(s) and ${warnings.length} warning(s).`,
    '',
    ...reportSection('Errors', errors, 'No broken internal targets or required-route failures were found.'),
    ...reportSection('Warnings for editorial review', warnings, 'No stale status or visible version labels were found.'),
    ...reportSection('Checks completed', notes, 'No checks were recorded.')
  ].join('\n');

  await fs.writeFile(REPORT_PATH, report, 'utf8');
  console.log(report);
  if (errors.length) process.exitCode = 1;
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
