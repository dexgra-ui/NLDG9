(()=>{
  const series=window.NLDG_CROSS_EMPTY_TOMB;
  if(!series?.lessons)return;
  const songs={
    1:{title:'The Servant King',artist:'Graham Kendrick',why:'Jesus is Lord and Teacher, yet He takes the servant’s place and washes His disciples’ feet. This song holds kingship and humble service together, matching John 13 and the call to love one another as Jesus has loved us.'},
    2:{title:'Thy Will',artist:'Hillary Scott & The Scott Family',why:'Gethsemane shows that surrender does not erase anguish. The song gives language to trusting God when the path is painful and unclear, echoing Jesus’ prayer, “Not as I will, but as You will.”'},
    3:{title:'Were You There',artist:'Traditional African American Spiritual',why:'The spiritual slows us down at the cross instead of rushing past it. Its reflective grief fits a lesson centered on the crucified King, human sin, costly grace, and the saving self-gift of Jesus.'},
    4:{title:'Because He Lives',artist:'Nicole C. Mullen',why:'The resurrection changes the future because Jesus is alive. The song connects the empty tomb with courage, hope, and life beyond death, fitting the lesson’s movement from resurrection to witness and mission.'}
  };
  series.lessons.forEach(lesson=>{if(songs[lesson.number])lesson.song=songs[lesson.number];});
})();
