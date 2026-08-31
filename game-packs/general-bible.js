(()=>{
const register=()=>window.NLDG_GAME_PACKS?.register({
 id:'general-bible',name:'General Bible',description:'A mixed-audience starter pack covering major Bible people, events, teachings, and common misconceptions.',version:'1.0.1',author:'No Labels, Designed by God',games:['scripture-or-suspicion','jeopardy','wheel','survey'],audiences:['kids','teens','adults','family','mixed'],
 questions:[
 {id:'sos-001',game:'scripture-or-suspicion',prompt:'Noah built an ark.',answer:'Scripture',category:'Genesis',difficulty:'easy',audience:['kids','family','mixed'],scripture:'Genesis 6:14'},
 {id:'sos-002',game:'scripture-or-suspicion',prompt:'God helps those who help themselves is a Bible verse.',answer:'Suspicion',category:'Biblical Wisdom',difficulty:'easy',audience:['teens','adults','family','mixed'],scripture:'Psalm 121:2'},
 {id:'sos-003',game:'scripture-or-suspicion',prompt:'James teaches that faith without works is dead.',answer:'Scripture',category:'General Epistles',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'James 2:26'},
 {id:'sos-004',game:'scripture-or-suspicion',prompt:'Paul was one of Jesus’ original twelve disciples.',answer:'Suspicion',category:'Acts and Paul',difficulty:'easy',audience:['kids','teens','family','mixed'],scripture:'Matthew 10:2-4'},
 {id:'sos-005',game:'scripture-or-suspicion',prompt:'Jesus taught His followers to pray for their enemies.',answer:'Scripture',category:'Jesus',difficulty:'medium',audience:['teens','adults','family','mixed'],scripture:'Matthew 5:44'},
 {id:'sos-006',game:'scripture-or-suspicion',prompt:'The Bible says money itself is the root of all evil.',answer:'Suspicion',category:'Biblical Wisdom',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'1 Timothy 6:10'},
 {id:'sos-007',game:'scripture-or-suspicion',prompt:'Lydia was a seller of purple cloth.',answer:'Scripture',category:'Acts and Paul',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'Acts 16:14'},
 {id:'sos-008',game:'scripture-or-suspicion',prompt:'The armor of God is described in Philippians.',answer:'Suspicion',category:'Paul’s Letters',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'Ephesians 6:10-18'},
 {id:'sos-009',game:'scripture-or-suspicion',prompt:'Jesus promised His followers a life free from trouble.',answer:'Suspicion',category:'Jesus',difficulty:'medium',audience:['teens','adults','family','mixed'],scripture:'John 16:33'},
 {id:'sos-010',game:'scripture-or-suspicion',prompt:'Micah called God’s people to do justice, love mercy, and walk humbly.',answer:'Scripture',category:'Prophets',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'Micah 6:8'},
 {id:'jeo-001',game:'jeopardy',prompt:'This man interpreted Pharaoh’s dreams and later governed Egypt.',answer:'Who is Joseph?',category:'Bible Characters',difficulty:'easy',audience:['kids','family','mixed'],scripture:'Genesis 41'},
 {id:'jeo-002',game:'jeopardy',prompt:'This Gospel begins by calling Jesus the Word.',answer:'What is John?',category:'Gospels',difficulty:'medium',audience:['teens','adults','mixed'],scripture:'John 1:1'},
 {id:'jeo-003',game:'jeopardy',prompt:'This woman became queen of Persia and risked her life for her people.',answer:'Who is Esther?',category:'Women of the Bible',difficulty:'easy',audience:['kids','family','mixed'],scripture:'Esther 4'},
 {id:'wheel-001',game:'wheel',prompt:'FRUIT OF THE SPIRIT',answer:'FRUIT OF THE SPIRIT',category:'Christian Living',difficulty:'easy',audience:['kids','family','mixed'],scripture:'Galatians 5:22-23'},
 {id:'wheel-002',game:'wheel',prompt:'WALK BY FAITH',answer:'WALK BY FAITH',category:'Faith',difficulty:'easy',audience:['family','mixed'],scripture:'2 Corinthians 5:7'},
 {id:'survey-001',game:'survey',prompt:'Name something people often remember about David.',answer:['Goliath','King of Israel','Psalms','Shepherd','Friendship with Jonathan'],category:'Bible Characters',difficulty:'easy',audience:['family','mixed']}
 ]
});
if(window.NLDG_GAME_PACKS)register();else window.addEventListener('nldg-game-pack-engine-ready',register,{once:true});
})();