(function(){
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const id = new URLSearchParams(location.search).get('id');
  const lesson = window.NLDG_SUNDAY_SCHOOL_API?.byId?.(id);
  const root = document.querySelector('#lesson-root');
  if(!lesson || lesson.status !== 'published'){
    root.innerHTML = '<section class="section"><h1>Lesson not found</h1><p>This lesson is not published yet.</p><a class="button primary" href="sunday-school.html">Return to Sunday School Lessons</a></section>';
    return;
  }
  document.title = `${lesson.title} | No Labels, Designed by God`;
  root.innerHTML = `<section class="page-hero"><p class="kicker">${esc(lesson.series || 'Sunday School Lesson')}</p><h1>${esc(lesson.title)}</h1><p class="lead">${esc(lesson.description || '')}</p><p><strong>Scripture:</strong> ${esc((lesson.scripture || []).join(', '))}</p></section><section class="section lesson-content">${(lesson.sections || []).map(section => `<article><h2>${esc(section.heading)}</h2>${(section.content || []).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</article>`).join('')}${lesson.questions?.length ? `<article><h2>Discussion Questions</h2><ol>${lesson.questions.map(question => `<li>${esc(question)}</li>`).join('')}</ol></article>` : ''}${lesson.prayer ? `<article><h2>Closing Prayer</h2><p>${esc(lesson.prayer)}</p></article>` : ''}</section>`;
})();
