window.NLDG_SUNDAY_SCHOOL_LESSONS = [
  {
    id: 'creation-and-the-fall-of-man',
    sourceId: '1YAMpjPNGCRkld_UJNtCRb3MIMzxiy0B8PuBKzhB-xJQ',
    sourceUrl: 'https://docs.google.com/document/d/1YAMpjPNGCRkld_UJNtCRb3MIMzxiy0B8PuBKzhB-xJQ/edit?usp=drivesdk',
    sourceModifiedTime: '2023-12-01T16:15:16.687Z',
    title: 'Creation and the Fall of Man',
    description: 'Explore Genesis 1–3, creation, human responsibility, disobedience, consequences, and God’s promise of redemption.',
    scripture: ['Genesis 1–3'],
    category: 'Foundations',
    series: 'Sunday School Lessons',
    audience: ['Adults', 'Small Groups'],
    duration: 45,
    status: 'published',
    publishedAt: '2026-07-24',
    contentType: 'sunday-school',
    sections: [
      {
        heading: 'Objective',
        content: ['By the end of this lesson, students should be able to discuss the Genesis narratives of creation and the Fall, understand the major themes, and consider how different traditions interpret these passages.']
      },
      {
        heading: 'Introduction to Genesis',
        content: ['Genesis is the first book of the Christian Bible and the Jewish Torah. It establishes many of the religious, moral, and cosmological ideas developed throughout Scripture.']
      },
      {
        heading: 'Genesis 1: The Creation of the World',
        content: ['God creates the world in six days and rests on the seventh. Creation progresses from light, sky, land, and vegetation to the sun, moon, stars, animals, and humanity.']
      },
      {
        heading: 'Genesis 2: The Garden of Eden',
        content: ['Adam is formed from dust and Eve from Adam’s side. They are placed in the Garden of Eden and may eat from every tree except the tree of the knowledge of good and evil.']
      },
      {
        heading: 'Genesis 3: The Fall',
        content: ['The serpent persuades Eve to eat the forbidden fruit, and she shares it with Adam. Their disobedience brings shame, separation, hard labor, and death into human experience, yet God also gives a promise of redemption.']
      },
      {
        heading: 'Activities and Reflection',
        content: ['Discuss obedience, disobedience, and consequences. Consider writing a one-page response about how creation and the Fall shape your understanding of personal responsibility. Reflect on what these chapters teach about humanity, moral choices, and our relationship with God.']
      }
    ],
    questions: [
      'What do Genesis 1–3 teach us about God, humanity, and creation?',
      'How do Adam and Eve’s choices illustrate personal responsibility?',
      'What consequences followed their disobedience?',
      'Where do you see God’s promise of redemption in the account?',
      'How should these chapters shape the choices we make today?'
    ],
    prayer: 'Ask God for wisdom to recognize His design, accept responsibility for your choices, and trust His redemptive grace.'
  },
  {
    id: 'cultivating-the-fruit-of-the-spirit',
    sourceId: '13MDwvVdJMojeXZnvjgOyemEaXjmBdpNoZBYYSD6CHAI',
    sourceUrl: 'https://docs.google.com/document/d/13MDwvVdJMojeXZnvjgOyemEaXjmBdpNoZBYYSD6CHAI/edit?usp=drivesdk',
    sourceModifiedTime: '2023-11-11T00:34:45.655Z',
    title: 'Cultivating the Fruit of the Spirit',
    description: 'Learn the nine qualities of the Fruit of the Spirit and practice applying them in everyday relationships.',
    scripture: ['Galatians 5:22–23'],
    category: 'Christian Living',
    series: 'Sunday School Lessons',
    audience: ['Adults', 'Small Groups'],
    duration: 55,
    status: 'published',
    publishedAt: '2026-07-24',
    contentType: 'sunday-school',
    sections: [
      {
        heading: 'Objective',
        content: ['Understand the Fruit of the Spirit, explore the meaning of each quality, and identify practical ways to demonstrate these qualities in daily life.']
      },
      {
        heading: 'Opening',
        content: ['Ask the group what comes to mind when they hear the phrase “Fruit of the Spirit.” Read Galatians 5:22–23 aloud and discuss why these qualities matter in the life of a believer.']
      },
      {
        heading: 'Explore the Fruit',
        content: ['The Fruit of the Spirit includes love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control. Divide into small groups and assign each group one quality. Have them find Scripture examples and explain how that quality can be practiced.']
      },
      {
        heading: 'Reflect and Apply',
        content: ['Choose one quality you want God to develop more fully in your life. Write down one specific action that would demonstrate it in your family, workplace, church, or community.']
      },
      {
        heading: 'Conclusion',
        content: ['Review the nine qualities and discuss how the Holy Spirit changes both our character and the way we treat others. Encourage each person to practice the quality they selected during the coming week.']
      }
    ],
    questions: [
      'Which quality of the Fruit of the Spirit comes most naturally to you?',
      'Which quality is most difficult for you to practice consistently?',
      'How does the Fruit of the Spirit affect our relationships with other people?',
      'What practical action can you take this week to cultivate one of these qualities?',
      'How is spiritual fruit different from simply trying to improve ourselves?'
    ],
    prayer: 'Ask the Holy Spirit to shape your character and help you display love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.'
  }
];

window.NLDG_SUNDAY_SCHOOL_API = {
  all: () => [...window.NLDG_SUNDAY_SCHOOL_LESSONS],
  published: () => window.NLDG_SUNDAY_SCHOOL_LESSONS.filter(lesson => lesson.status === 'published'),
  byId: id => window.NLDG_SUNDAY_SCHOOL_LESSONS.find(lesson => lesson.id === id)
};
