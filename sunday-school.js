(function(){
  const lessons = () => window.NLDG_SUNDAY_SCHOOL_API?.published?.() || [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const grid = document.querySelector('#sunday-school-grid');
  const empty = document.querySelector('#sunday-school-empty');
  const search = document.querySelector('#sunday-school-search');
  const filter = document.querySelector('#sunday-school-filter');

  function renderFilters(items){
    const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort();
    filter.innerHTML = '<option value="all">All categories</option>' + categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('');
  }

  function render(){
    const query = search.value.trim().toLowerCase();
    const category = filter.value;
    const items = lessons().filter(lesson => {
      const haystack = [lesson.title, lesson.description, lesson.category, lesson.series, ...(lesson.scripture || []), ...(lesson.audience || [])].join(' ').toLowerCase();
      return (!query || haystack.includes(query)) && (category === 'all' || lesson.category === category);
    });
    grid.innerHTML = items.map(lesson => `<article class="study-card"><p class="kicker">${esc(lesson.series || 'Sunday School')}</p><h2>${esc(lesson.title)}</h2><p>${esc(lesson.description || '')}</p><p><strong>Scripture:</strong> ${esc((lesson.scripture || []).join(', '))}</p><p><strong>Length:</strong> ${esc(lesson.duration || 45)} minutes</p><a class="button primary" href="sunday-school-lesson.html?id=${encodeURIComponent(lesson.id)}">Open Lesson</a></article>`).join('');
    empty.hidden = items.length > 0;
  }

  renderFilters(lessons());
  search.addEventListener('input', render);
  filter.addEventListener('change', render);
  render();
})();
