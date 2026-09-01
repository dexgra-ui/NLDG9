import fs from 'node:fs';
import vm from 'node:vm';
import { spanishOldTestamentBooks } from './spanish-old-testament-manifest.mjs';

const errors = [];
const exists = path => fs.existsSync(path);
const read = path => fs.readFileSync(path, 'utf8');
const fail = message => errors.push(message);

const loadSeries = (...files) => {
  const context = { window: {} };
  vm.createContext(context);
  for (const file of files) vm.runInContext(read(file), context, { filename: file });
  return context.window.NLDG_BOOK_STUDY;
};

const requiredLessonFields = [
  'title', 'scripture', 'question', 'truth', 'goal', 'opening', 'context',
  'examination', 'challenge', 'caution', 'prayer'
];

if (spanishOldTestamentBooks.length !== 39) {
  fail(`Old Testament manifest must contain 39 books; found ${spanishOldTestamentBooks.length}.`);
}

for (const field of ['key', 'englishStem', 'spanishSlug', 'englishPage', 'spanishPage']) {
  const values = spanishOldTestamentBooks.map(book => book[field]);
  if (new Set(values).size !== values.length) fail(`Old Testament manifest has duplicate ${field} values.`);
}

const published = spanishOldTestamentBooks.filter(book => book.status === 'published');
const prepared = spanishOldTestamentBooks.filter(book => book.status === 'prepared');
const ruth = spanishOldTestamentBooks.find(book => book.key === 'ruth');
if (ruth?.status !== 'published') fail('Ruth must remain identified as a published Spanish Old Testament book.');
if (published.length + prepared.length !== 39) fail('Every Old Testament book status must be published or prepared.');

for (const book of spanishOldTestamentBooks) {
  if (!/^[a-z0-9-]+$/.test(book.spanishSlug) || !book.spanishSlug.endsWith('-estudio')) {
    fail(`${book.label}: Spanish slug must be ASCII-safe and end in -estudio.`);
  }
  for (const file of [book.englishData, book.englishGuide, book.englishPage]) {
    if (!exists(file)) fail(`${book.label}: missing canonical English resource ${file}.`);
  }
}

if (!exists('nldg-i18n.js')) fail('Missing bilingual route registry nldg-i18n.js.');
if (!exists('es/estudios-biblicos.html')) fail('Missing Spanish study library es/estudios-biblicos.html.');
if (!exists('book-study-series.js')) fail('Missing shared book-study renderer.');
if (!exists('book-study-series-es.js')) fail('Missing Spanish book-study adapter.');

const i18n = exists('nldg-i18n.js') ? read('nldg-i18n.js') : '';
const hub = exists('es/estudios-biblicos.html') ? read('es/estudios-biblicos.html') : '';

for (const book of spanishOldTestamentBooks) {
  const hasData = exists(book.spanishData);
  const hasPage = exists(book.spanishPage);
  const routePair = `'${book.englishPage}':'${book.spanishPage}'`;
  const hubLink = `href="${book.spanishSlug}.html"`;

  if (book.status === 'prepared' && !hasData && !hasPage) {
    if (i18n.includes(routePair)) fail(`${book.label}: do not register the Spanish route before its reviewed files exist.`);
    if (hub.includes(hubLink)) fail(`${book.label}: do not publish the Spanish library card before review is complete.`);
    continue;
  }

  if (hasData !== hasPage) {
    fail(`${book.label}: Spanish data and page must be added together.`);
    continue;
  }
  if (!hasData || !hasPage) {
    fail(`${book.label}: status is ${book.status}, but the Spanish study is missing.`);
    continue;
  }
  if (!exists(book.englishData) || !exists(book.englishGuide)) continue;

  const english = loadSeries(book.englishData, book.englishGuide);
  const spanish = loadSeries(book.spanishData);
  if (!english || !spanish) {
    fail(`${book.label}: unable to load English and Spanish study data.`);
    continue;
  }
  if (spanish.slug !== book.spanishSlug) fail(`${book.label}: Spanish data slug must be ${book.spanishSlug}.`);
  if (spanish.book !== book.spanishBook) fail(`${book.label}: Spanish book name must be ${book.spanishBook}.`);
  if (spanish.scriptureStandard !== 'Nueva Traducción Viviente (NTV)') {
    fail(`${book.label}: Spanish study must declare Nueva Traducción Viviente (NTV).`);
  }
  if (spanish.lessons?.length !== english.lessons?.length) {
    fail(`${book.label}: Spanish lesson count must match English.`);
  }

  for (let index = 0; index < Math.min(english.lessons?.length || 0, spanish.lessons?.length || 0); index++) {
    const source = english.lessons[index];
    const translation = spanish.lessons[index];
    const label = `${book.label} lesson ${index + 1}`;
    if (translation.number !== source.number) fail(`${label}: lesson number mismatch.`);
    for (const field of requiredLessonFields) {
      if (!String(translation[field] || '').trim()) fail(`${label}: missing Spanish ${field}.`);
    }
    for (const field of ['supporting', 'teaching', 'questions']) {
      if (!Array.isArray(translation[field])) fail(`${label}: Spanish ${field} must be an array.`);
      else if (translation[field].length !== (source[field]?.length || 0)) fail(`${label}: Spanish ${field} count must match English.`);
    }
  }

  const page = read(book.spanishPage);
  for (const marker of [
    '<html lang="es"',
    `https://nolabelsdesignedbygod.org/es/${book.spanishSlug}.html`,
    `hreflang="en" href="https://nolabelsdesignedbygod.org/${book.englishPage}"`,
    `../${book.spanishData}`,
    '../book-study-series.js',
    '../book-study-series-es.js',
    '../nldg-i18n.js'
  ]) {
    if (!page.includes(marker)) fail(`${book.label}: Spanish page is missing ${JSON.stringify(marker)}.`);
  }
  if (!i18n.includes(routePair)) fail(`${book.label}: reviewed Spanish route pair is missing.`);
  if (!hub.includes(hubLink)) fail(`${book.label}: reviewed Spanish library card is missing.`);
}

if (errors.length) {
  console.error('Spanish Old Testament preparation audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Spanish Old Testament preparation audit passed.');
console.log(`39 English source studies verified; ${published.length} published; ${prepared.length} prepared for reviewed Spanish conversion.`);
