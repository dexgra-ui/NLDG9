(function(){
  const series=window.NLDG_CURRENT_EVENTS_SERIES;
  if(!series)return;

  const defaultCoaching=[
    {situation:'The discussion becomes political or partisan',guidance:'Return to the biblical text and ask what obedience to Jesus requires from every participant, not only from people outside the room.'},
    {situation:'Someone speaks with certainty beyond the text',guidance:'Affirm conviction while distinguishing what Scripture clearly says from interpretation, application, prediction, or personal opinion.'},
    {situation:'The group becomes focused on winning an argument',guidance:'Redirect toward discipleship: truth should form character, love of neighbor, humility, repentance, and faithful action.'}
  ];

  const defaultReflection=[
    'Where might my own preferences be shaping the way I teach this subject?',
    'What part of this lesson do I need to practice before I ask others to practice it?',
    'How can I keep Jesus at the center rather than turning the lesson into a culture-war debate?'
  ];

  function lessonTitle(week){
    return series.lessons.find(item=>item.week===week)?.title||`Week ${week}`;
  }

  function resources(week){
    const list=[];
    if(week>1) list.push({label:'Previous Study',title:lessonTitle(week-1),detail:`Week ${week-1} prepares the biblical foundation leading into this lesson.`});
    if(week<42) list.push({label:'Next Study',title:lessonTitle(week+1),detail:`Week ${week+1} continues the journey with another area of faithful Christian discernment.`});
    list.push({label:'Series Practice',title:'Read the text in context',detail:'Return to the primary passage during the week and ask what it reveals about God, people, and faithful obedience.'});
    return list;
  }

  function buildTimelines(config){
    const core=config.sections.slice(0,5).map(item=>item.heading);
    return {
      '45 minutes':['Welcome and opening question · 5','Read the primary passage · 8',`${core.slice(0,2).join(' + ')} · 12`,'Focused discussion · 12','Challenge and prayer · 8'],
      '60 minutes':['Welcome and opening question · 7','Read and observe the primary passages · 10',`${core.slice(0,3).join(' + ')} · 18`,'Discussion and application · 18','Challenge and prayer · 7'],
      '90 minutes':['Welcome and opening question · 10','Read and observe all primary passages · 15','Biblical and historical background · 15',`${core.slice(0,4).join(' + ')} · 20`,'Case study or full discussion · 20','Application, commitment, and prayer · 10']
    };
  }

  function buildOutline(config){
    return config.sections.filter(item=>!['challenge','clarity','practice'].includes(item.type)).slice(0,6).map((item,index)=>({
      point:`${index+1}. ${item.heading}`,
      notes:item.leaderNote||item.content
    }));
  }

  function apply(config){
    const lesson=series.lessons.find(item=>item.week===config.week);
    if(!lesson)return;
    Object.assign(lesson,{
      version:'2.0.0',
      curriculumStatus:'revised curriculum',
      title:config.title||lesson.title,
      shortTitle:config.shortTitle||config.title||lesson.shortTitle||lesson.title,
      summary:config.summary,
      scripture:config.scripture,
      memoryVerse:config.memoryVerse||config.scripture[0],
      bigIdea:config.bigIdea,
      objectives:config.objectives,
      openingQuestion:config.openingQuestion,
      sections:config.sections.map(item=>({heading:item.heading,type:item.type,content:item.content})),
      questions:config.questions,
      prayer:config.prayer,
      resourceConnections:config.resourceConnections||resources(config.week),
      leaderGuide:{
        purpose:config.leaderPurpose||`Help participants understand ${config.title||lesson.title} through Scripture, keep Jesus at the center, and choose a faithful response that can be practiced in daily life.`,
        preparation:config.preparation||[
          `Read ${config.scripture.join(', ')} in context before teaching.`,
          'Identify which claims in the lesson come directly from Scripture and which are interpretation or application.',
          'Prepare one ordinary example that helps the group understand the issue without turning the class into a debate.',
          'Pray for humility, clarity, compassion, courage, and a willingness to be corrected.'
        ],
        prayerFocus:config.prayerFocus||'Pray that truth will produce Christlike character, wise discernment, love of neighbor, and faithful action.',
        leaderReminder:config.leaderReminder||'The goal is not to win an argument. The goal is to help people follow Jesus faithfully.',
        background:config.background,
        theology:config.theology,
        worldview:config.worldview,
        timelines:config.timelines||buildTimelines(config),
        outline:config.outline||buildOutline(config),
        difficultQuestions:config.difficultQuestions,
        coaching:[...defaultCoaching,...(config.coaching||[])],
        misunderstandings:config.misunderstandings,
        ministryApplications:config.ministryApplications,
        leaderReflection:[...defaultReflection,...(config.leaderReflection||[])]
      }
    });
  }

  window.NLDG_APPLY_CURRENT_EVENTS_V2=apply;
})();
