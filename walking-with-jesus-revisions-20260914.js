(()=>{
  const lessons=window.NLDG_WALKING_WITH_JESUS_WEEKS;
  if(!Array.isArray(lessons))return;
  const byNumber=number=>lessons.find(item=>Number(item.number)===Number(number));
  const patch=(number,data)=>Object.assign(byNumber(number)||{},data);

  patch(1,{song:{title:'Holy Forever',artist:'CeCe Winans',why:'John 1 opens with the eternal Word and the glory of the One who came near in flesh. This song keeps the response centered on the holiness and eternal worth of Jesus.'}});
  patch(2,{song:{title:'Promises',artist:'Maverick City Music',why:'The birth narratives show God keeping His covenant promises in Jesus. The song fits when it is heard as a response to God’s proven faithfulness rather than as a claim that every personal desire is guaranteed.'}});
  patch(3,{song:{title:'Come to Jesus',artist:'Chris Rice',why:'This lesson centers on invitation: Andrew brings Simon, Philip invites Nathanael, and each encounter moves toward Jesus Himself.'}});
  patch(4,{scripture:'Matthew 9:9–13; John 1:35–51 (review)',memory:'John 1:42',song:{title:'You Know My Name',artist:'Tasha Cobbs Leonard',why:'Jesus sees people beyond the labels others assign and calls them personally into relationship, allegiance, and transformation.'}});
  patch(5,{song:{title:'Trust and Obey',artist:'Traditional Hymn',why:'The servants at Cana act before they understand the outcome. The hymn matches the lesson’s call to trust Jesus enough to do what He says without treating obedience as a formula for controlling results.'}});
  patch(6,{song:{title:'Changed',artist:'Tramaine Hawkins',why:'Nicodemus comes with knowledge and status, but Jesus speaks of a transformation deeper than reputation or religion. The song gives voice to inward change produced by God.'}});
  patch(7,{song:{title:'Fill My Cup, Lord',artist:'Traditional Gospel Hymn',why:'John 4 is built around thirst and living water. The song gives the lesson a simple prayer for the satisfaction only Christ can provide.'}});
  patch(8,{song:{title:'The Kingdom Is Yours',artist:'Common Hymnal',why:'The Beatitudes announce a kingdom whose values overturn ordinary ideas of blessing, power, and success.'}});
  patch(9,{song:{title:'Give Me a Clean Heart',artist:'Fred Hammond',why:'Matthew 5 presses beneath religious appearance into anger, desire, truthfulness, retaliation, and love. The song turns the lesson into a prayer for heart-level transformation.'}});
  patch(10,{song:{title:'The Lord’s Prayer (It’s Yours)',artist:'Matt Maher',why:'The lesson centers on Jesus teaching His disciples how prayer reorders life around the Father’s name, kingdom, will, provision, forgiveness, and protection.'}});
  patch(11,{song:{title:'Firm Foundation (He Won’t)',artist:'Cody Carnes',why:'Jesus ends the sermon with the image of a life built on hearing and doing His words. The song reinforces trust in Christ as the foundation while the lesson keeps obedience in view.'}});
  patch(12,{song:{title:'There Is a Balm in Gilead',artist:'Traditional Spiritual',why:'This spiritual gives wounded people language for healing and hope while keeping our deepest confidence in God rather than in a guaranteed immediate outcome.'}});
  patch(13,{song:{title:'Bread of Heaven',artist:'Fred Hammond',why:'John 6 moves from multiplied bread to Jesus Himself as the Bread of Life. The song keeps the focus on Christ as the deeper provision.'}});
  patch(14,{memory:'Matthew 14:33',song:{title:'It Is Well with My Soul',artist:'Traditional Hymn',why:'The lesson does not promise the absence of storms. It calls for trust that can remain anchored in God while circumstances are still unsettled.'}});
  patch(15,{song:{title:'I Give Myself Away',artist:'William McDowell',why:'Jesus sends His disciples into His mission. The song fits the surrender of being available for Christ’s purposes rather than building a platform for ourselves.'}});
  patch(16,{song:{title:'Send Me',artist:'Lecrae',why:'Luke 10 is a sending passage. The song matches the willingness to go while the lesson keeps mission grounded in humility, dependence, and belonging to God.'}});
  patch(17,{song:{title:'Resurrection Power',artist:'Chris Tomlin',why:'Jesus does more than comfort Martha and Mary; He identifies Himself as the resurrection and the life and demonstrates authority over death.'}});
  patch(18,{song:{title:'In Christ Alone',artist:'Keith Getty & Stuart Townend',why:'Peter’s confession asks who Jesus truly is, and Jesus immediately defines Messiahship through suffering, surrender, and the way of the cross.'}});
  patch(19,{song:{title:'Hosanna',artist:'Kirk Franklin',why:'The Triumphal Entry is filled with royal welcome and the cry of Hosanna. The song gives the group language to honor Jesus as King while the lesson challenges us to receive Him on His terms.'}});
  patch(20,{song:{title:'The Heart of Worship',artist:'Matt Redman',why:'Jesus confronts worship that has been distorted by religious activity. The song fits the call back to sincere devotion centered on God rather than performance.'}});
  patch(21,{song:{title:'Even So Come',artist:'Passion',why:'The song expresses longing for Christ’s return while calling His people to readiness. That matches Matthew 24–25, where waiting becomes faithful living rather than speculation.'}});

  window.NLDG_WALKING_WITH_JESUS_REVISIONS_20260914=true;
})();