window.NLDG_SUNDAY_SCHOOL_LESSONS = [
  /*
  Add recovered lessons here using this structure:
  {
    id: 'lesson-slug',
    title: 'Lesson title',
    description: 'One-sentence summary.',
    scripture: ['Book 1:1-10'],
    category: 'Christian Living',
    series: 'Sunday School Lessons',
    audience: ['Adults', 'Small Groups'],
    duration: 45,
    status: 'draft',
    publishedAt: '2026-07-24',
    sections: [
      {heading: 'Opening', content: ['Paragraph or teaching point.']},
      {heading: 'Explore the Text', content: ['Paragraph or teaching point.']},
      {heading: 'Application', content: ['Paragraph or teaching point.']}
    ],
    questions: ['Discussion question'],
    prayer: 'Closing prayer prompt.'
  }
  */
];

window.NLDG_SUNDAY_SCHOOL_API = {
  all: () => [...window.NLDG_SUNDAY_SCHOOL_LESSONS],
  published: () => window.NLDG_SUNDAY_SCHOOL_LESSONS.filter(lesson => lesson.status === 'published'),
  byId: id => window.NLDG_SUNDAY_SCHOOL_LESSONS.find(lesson => lesson.id === id)
};
