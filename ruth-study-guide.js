(function(){
  const s=window.NLDG_BOOK_STUDY;
  if(!s)return;
  Object.assign(s,{
    description:'A five-lesson study of faithful love, providence, and redemption',
    themeLabel:'Central Theme',
    theme:'God’s faithful love meets people in emptiness and draws ordinary acts of faithfulness into His larger redemptive story.',
    purpose:'A five-lesson study of faithful love, providence, and redemption',
    background:'Ruth begins with famine, displacement, bereavement, and an uncertain return. It ends with restored family and a place in the lineage of David. Between those points, God’s providence is often quiet: expressed through costly loyalty, honest work, protective generosity, lawful redemption, and community.',
    seriesGuideBlocks:[
      {
        title:'Series Overview',
        paragraphs:[
          'Ruth begins with famine, displacement, bereavement, and an uncertain return. It ends with restored family and a place in the lineage of David. Between those points, God’s providence is often quiet: expressed through costly loyalty, honest work, protective generosity, lawful redemption, and community.',
          'This study does not treat suffering as simple or claim every tragedy was directly caused to produce a later blessing. It invites participants to notice how God meets people in grief and works through ordinary obedience without minimizing pain.'
        ]
      },
      {
        title:'Series Goals',
        items:[
          'Read Ruth in historical, covenant, and literary context.',
          'Make room for honest grief without confusing lament with faithlessness.',
          'Recognize dignity, courage, and responsibility in Ruth, Naomi, and Boaz.',
          'Examine how God’s people protect and include vulnerable persons.',
          'Understand the family redeemer within Israel’s responsibilities.',
          'See how Ruth’s story leads toward David and Jesus without forcing every detail into an allegory.'
        ]
      },
      {
        title:'Leader Preparation',
        text:'Read all four chapters. Be gentle with people carrying grief, infertility, widowhood, displacement, poverty, exclusion, workplace mistreatment, or family instability. Do not use Ruth’s loyalty to pressure anyone to remain in an abusive relationship. Name leaders’ responsibility for safety. Read chapter 3 without sensationalism: its moral emphasis is Ruth’s courage and Boaz’s integrity.'
      },
      {
        title:'Recommended Rhythm',
        text:'Allow 60–75 minutes per lesson: opening and prayer, Scripture reading, teaching movements, discussion, personal examination, and weekly practice.'
      },
      {
        title:'Key Scriptures',
        text:'Ruth 1:16–17; 2:12; 3:10–11; 4:14–17; Matthew 1:5–6'
      }
    ],
    seriesPrayer:'Faithful God, teach us to lament honestly, love courageously, protect the vulnerable, and trust Your presence in ordinary faithfulness. Draw our lives into Your redeeming purposes through Jesus Christ. Amen.'
  });
  const exactGoals={
    1:'To honor Naomi’s grief, understand Ruth’s covenant-like commitment, and see how a new chapter may begin before circumstances feel resolved.',
    2:'To connect gleaning with God’s law, appreciate Ruth’s initiative, and examine Boaz’s duty to provide dignity and safety.',
    3:'To read the threshing-floor scene carefully and learn from Ruth’s courage and Boaz’s honorable response.',
    4:'To understand the legal process at Bethlehem’s gate and see how Boaz’s costly commitment illuminates Christ’s greater redemption.',
    5:'To celebrate restoration without erasing loss and trace Ruth’s place in the line of David and Jesus.'
  };
  s.lessons.forEach(lesson=>{if(exactGoals[lesson.number])lesson.goal=exactGoals[lesson.number];});
})();
