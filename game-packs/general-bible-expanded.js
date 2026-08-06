(()=>{
const register=()=>{
const questions=[];
const add=(id,game,prompt,answer,category,difficulty,audience,scripture)=>questions.push({id,game,prompt,answer,category,difficulty,audience,scripture});
const mixed=['teens','adults','family','mixed'];
const family=['kids','teens','adults','family','mixed'];
const sos=[
['God created the heavens and the earth.','Scripture','Genesis','easy',family,'Genesis 1:1'],
['Adam and Eve lived in the garden of Gethsemane.','Suspicion','Genesis','easy',family,'Genesis 2:8'],
['Cain was a keeper of sheep.','Suspicion','Genesis','medium',mixed,'Genesis 4:2'],
['Enoch walked with God and was taken by God.','Scripture','Genesis','medium',mixed,'Genesis 5:24'],
['Noah sent out a dove after the flood.','Scripture','Genesis','easy',family,'Genesis 8:8-12'],
['The tower of Babel was built after the exile in Babylon.','Suspicion','Genesis','medium',mixed,'Genesis 11:1-9'],
['Abram was called to leave his country and family.','Scripture','Genesis','easy',family,'Genesis 12:1'],
['Sarah laughed when she heard she would bear a son.','Scripture','Genesis','easy',family,'Genesis 18:12'],
['Lot became king of Sodom.','Suspicion','Genesis','easy',family,'Genesis 19'],
['Abraham was willing to offer Isaac to God.','Scripture','Genesis','medium',mixed,'Genesis 22:1-14'],
['Jacob received a new name, Israel.','Scripture','Genesis','easy',family,'Genesis 32:28'],
['Joseph was sold for thirty pieces of silver.','Suspicion','Genesis','medium',mixed,'Genesis 37:28'],
['Joseph interpreted dreams while in prison.','Scripture','Genesis','easy',family,'Genesis 40'],
['Moses was raised in Pharaoh’s household.','Scripture','Exodus','easy',family,'Exodus 2:10'],
['The burning bush was consumed by the fire.','Suspicion','Exodus','easy',family,'Exodus 3:2'],
['Aaron’s staff became a serpent before Pharaoh.','Scripture','Exodus','medium',mixed,'Exodus 7:10'],
['The final plague in Egypt was darkness.','Suspicion','Exodus','easy',family,'Exodus 12:29-30'],
['Israel crossed the Red Sea on dry ground.','Scripture','Exodus','easy',family,'Exodus 14:21-22'],
['The manna tasted like bitter herbs.','Suspicion','Exodus','hard',mixed,'Exodus 16:31'],
['The Ten Commandments were given at Mount Sinai.','Scripture','Exodus','easy',family,'Exodus 19-20'],
['Rahab hid Israelite spies in Jericho.','Scripture','Joshua','easy',family,'Joshua 2'],
['Joshua stopped the Jordan River by striking it with a staff.','Suspicion','Joshua','medium',mixed,'Joshua 3'],
['Deborah served as a judge in Israel.','Scripture','Judges','easy',family,'Judges 4:4'],
['Gideon defeated Midian with six hundred men.','Suspicion','Judges','medium',mixed,'Judges 7:7'],
['Samson killed a lion with his bare hands.','Scripture','Judges','medium',mixed,'Judges 14:5-6'],
['Ruth was a Moabite woman.','Scripture','Ruth','easy',family,'Ruth 1:4'],
['Hannah dedicated Samuel to the Lord.','Scripture','Samuel','easy',family,'1 Samuel 1:27-28'],
['Saul was anointed as Israel’s first king.','Scripture','Samuel','easy',family,'1 Samuel 10:1'],
['David defeated Goliath with a sword he brought from home.','Suspicion','Samuel','easy',family,'1 Samuel 17:49-51'],
['Jonathan was Saul’s son and David’s friend.','Scripture','Samuel','easy',family,'1 Samuel 18:1-4'],
['Solomon asked God for riches above all else.','Suspicion','Kings','easy',family,'1 Kings 3:9-13'],
['Elijah challenged the prophets of Baal on Mount Carmel.','Scripture','Kings','easy',family,'1 Kings 18'],
['Elisha healed Naaman of leprosy.','Scripture','Kings','easy',family,'2 Kings 5'],
['Josiah became king when he was eight years old.','Scripture','Kings','medium',mixed,'2 Kings 22:1'],
['Nehemiah rebuilt the temple in Jerusalem.','Suspicion','History','medium',mixed,'Nehemiah 2-6'],
['Esther approached the king without being summoned.','Scripture','Esther','easy',family,'Esther 5:1-2'],
['Job’s friends immediately understood the reason for his suffering.','Suspicion','Wisdom','medium',mixed,'Job 4-37'],
['Psalm 23 describes the Lord as a shepherd.','Scripture','Psalms','easy',family,'Psalm 23:1'],
['Proverbs says a gentle answer turns away wrath.','Scripture','Wisdom','easy',family,'Proverbs 15:1'],
['Ecclesiastes says there is a season for every activity.','Scripture','Wisdom','easy',family,'Ecclesiastes 3:1'],
['Isaiah saw the Lord high and lifted up.','Scripture','Prophets','medium',mixed,'Isaiah 6:1'],
['Jeremiah was thrown into a lions’ den.','Suspicion','Prophets','easy',family,'Jeremiah 38:6'],
['Ezekiel saw a valley of dry bones.','Scripture','Prophets','easy',family,'Ezekiel 37'],
['Daniel interpreted the writing on the wall.','Scripture','Prophets','easy',family,'Daniel 5'],
['Hosea was commanded to marry Gomer.','Scripture','Prophets','medium',mixed,'Hosea 1:2-3'],
['Jonah preached to Nineveh after fleeing from God.','Scripture','Prophets','easy',family,'Jonah 3'],
['Micah predicted the Messiah would come from Bethlehem.','Scripture','Prophets','medium',mixed,'Micah 5:2'],
['John the Baptist was the son of Zechariah and Elizabeth.','Scripture','Gospels','easy',family,'Luke 1:13'],
['Jesus was born in Nazareth.','Suspicion','Gospels','easy',family,'Luke 2:4-7'],
['Jesus was tempted in the wilderness for forty days.','Scripture','Gospels','easy',family,'Matthew 4:1-2'],
['Jesus called Matthew from a fishing boat.','Suspicion','Gospels','easy',family,'Matthew 9:9'],
['Nicodemus came to Jesus at night.','Scripture','Gospels','easy',family,'John 3:2'],
['Jesus healed a man lowered through a roof.','Scripture','Gospels','easy',family,'Mark 2:1-12'],
['The Good Samaritan is a historical account in Acts.','Suspicion','Parables','medium',mixed,'Luke 10:30-37'],
['Jesus raised Lazarus after he had been dead four days.','Scripture','Gospels','easy',family,'John 11:39-44'],
['Peter walked on water toward Jesus.','Scripture','Gospels','easy',family,'Matthew 14:28-29'],
['Jesus fed five thousand with seven loaves and a few fish.','Suspicion','Gospels','medium',mixed,'Matthew 14:17-21'],
['Zacchaeus was a tax collector.','Scripture','Gospels','easy',family,'Luke 19:2'],
['Jesus washed His disciples’ feet.','Scripture','Gospels','easy',family,'John 13:5'],
['Judas identified Jesus with a handshake.','Suspicion','Gospels','easy',family,'Matthew 26:48-49'],
['Joseph of Arimathea asked for Jesus’ body.','Scripture','Gospels','medium',mixed,'Mark 15:43'],
['Mary Magdalene was among the first witnesses of the empty tomb.','Scripture','Gospels','easy',family,'John 20:1-18'],
['Thomas believed the resurrection before seeing Jesus.','Suspicion','Gospels','medium',mixed,'John 20:24-29'],
['Matthias was chosen to replace Judas.','Scripture','Acts','medium',mixed,'Acts 1:26'],
['The Holy Spirit came at Pentecost with the sound of a rushing wind.','Scripture','Acts','easy',family,'Acts 2:2'],
['Stephen was the first Gentile convert.','Suspicion','Acts','medium',mixed,'Acts 6-7'],
['Philip baptized an Ethiopian official.','Scripture','Acts','easy',family,'Acts 8:36-38'],
['Saul encountered Jesus on the road to Damascus.','Scripture','Acts','easy',family,'Acts 9:3-6'],
['Peter was freed from prison by an earthquake.','Suspicion','Acts','medium',mixed,'Acts 12:7-10'],
['Paul and Barnabas separated over John Mark.','Scripture','Acts','medium',mixed,'Acts 15:37-40']
];
sos.forEach((x,i)=>add(`sosx-${String(i+1).padStart(3,'0')}`,'scripture-or-suspicion',...x));
const people=[
['Adam','the first man','Genesis 2:7','Genesis','easy'],['Eve','the first woman','Genesis 2:22','Genesis','easy'],['Noah','built the ark','Genesis 6:14','Genesis','easy'],['Abraham','was called the father of many nations','Genesis 17:5','Genesis','easy'],['Sarah','gave birth to Isaac in old age','Genesis 21:2','Genesis','easy'],['Isaac','was the promised son of Abraham and Sarah','Genesis 21:3','Genesis','easy'],['Jacob','was renamed Israel','Genesis 32:28','Genesis','easy'],['Joseph','interpreted Pharaoh’s dreams','Genesis 41:15-16','Genesis','easy'],['Moses','led Israel out of Egypt','Exodus 12-14','Exodus','easy'],['Aaron','served as Israel’s first high priest','Exodus 28:1','Exodus','medium'],['Miriam','watched over infant Moses and later led worship','Exodus 2:4; 15:20','Exodus','medium'],['Joshua','led Israel into the promised land','Joshua 1:1-9','Joshua','easy'],['Rahab','hid the spies in Jericho','Joshua 2','Joshua','easy'],['Deborah','judged Israel under a palm tree','Judges 4:4-5','Judges','medium'],['Gideon','defeated Midian with three hundred men','Judges 7:7','Judges','easy'],['Samson','was known for extraordinary strength','Judges 13-16','Judges','easy'],['Ruth','pledged loyalty to Naomi','Ruth 1:16','Ruth','easy'],['Boaz','served as Ruth’s kinsman-redeemer','Ruth 4','Ruth','medium'],['Hannah','prayed for a son and dedicated Samuel to God','1 Samuel 1','Samuel','medium'],['Samuel','anointed both Saul and David','1 Samuel 10:1; 16:13','Samuel','medium'],['Saul','was Israel’s first king','1 Samuel 10:24','Samuel','easy'],['David','defeated Goliath and became king','1 Samuel 17; 2 Samuel 5','Samuel','easy'],['Jonathan','was David’s loyal friend','1 Samuel 18:1-4','Samuel','easy'],['Solomon','asked God for wisdom','1 Kings 3:9','Kings','easy'],['Elijah','called down fire on Mount Carmel','1 Kings 18:36-38','Kings','easy'],['Elisha','received a double portion of Elijah’s spirit','2 Kings 2:9-15','Kings','medium'],['Hezekiah','prayed when Jerusalem was threatened by Assyria','2 Kings 19','Kings','hard'],['Josiah','found the Book of the Law and led reform','2 Kings 22-23','Kings','medium'],['Ezra','was a scribe devoted to God’s law','Ezra 7:10','History','medium'],['Nehemiah','rebuilt Jerusalem’s walls','Nehemiah 2-6','History','easy'],['Esther','risked her life before the Persian king','Esther 4:16','Esther','easy'],['Mordecai','raised Esther and exposed a plot against the king','Esther 2:7,21-23','Esther','medium'],['Job','remained faithful through severe suffering','Job 1-2','Wisdom','easy'],['Isaiah','saw the Lord in the temple','Isaiah 6:1','Prophets','medium'],['Jeremiah','was called the weeping prophet','Jeremiah 9:1','Prophets','medium'],['Ezekiel','saw the valley of dry bones','Ezekiel 37','Prophets','easy'],['Daniel','survived the lions’ den','Daniel 6','Prophets','easy'],['Shadrach','was thrown into a fiery furnace with two friends','Daniel 3','Prophets','easy'],['Hosea','used his marriage as a picture of covenant faithfulness','Hosea 1-3','Prophets','hard'],['Jonah','was sent to preach to Nineveh','Jonah 1-3','Prophets','easy'],['John the Baptist','prepared the way for Jesus','Matthew 3:1-3','Gospels','easy'],['Mary','was the mother of Jesus','Luke 1:30-35','Gospels','easy'],['Joseph of Nazareth','was Jesus’ earthly guardian','Matthew 1:18-25','Gospels','easy'],['Peter','confessed Jesus as the Messiah','Matthew 16:16','Gospels','easy'],['Andrew','brought his brother Peter to Jesus','John 1:40-42','Gospels','medium'],['James','was the brother of John and son of Zebedee','Mark 1:19-20','Gospels','medium'],['John','was called the disciple Jesus loved','John 13:23','Gospels','medium'],['Matthew','left tax collecting to follow Jesus','Matthew 9:9','Gospels','easy'],['Thomas','wanted evidence of the resurrection','John 20:24-29','Gospels','easy'],['Martha','served Jesus and confessed faith in the resurrection','Luke 10:40; John 11:27','Gospels','medium'],['Mary of Bethany','anointed Jesus with costly perfume','John 12:3','Gospels','medium'],['Lazarus','was raised after four days in the tomb','John 11:39-44','Gospels','easy'],['Zacchaeus','climbed a sycamore tree to see Jesus','Luke 19:4','Gospels','easy'],['Mary Magdalene','announced the risen Christ to the disciples','John 20:18','Gospels','easy'],['Stephen','was martyred after testifying before the council','Acts 7','Acts','medium'],['Philip','explained Isaiah to an Ethiopian official','Acts 8:30-35','Acts','medium'],['Barnabas','was known as a son of encouragement','Acts 4:36','Acts','easy'],['Paul','carried the gospel to many Gentile cities','Acts 13-28','Acts','easy'],['Silas','sang hymns with Paul in prison','Acts 16:25','Acts','medium'],['Lydia','sold purple cloth and welcomed Paul’s team','Acts 16:14-15','Acts','medium']
];
people.forEach((p,i)=>{add(`jeox-${String(i+1).padStart(3,'0')}`,'jeopardy',`This person ${p[1]}.`,`Who is ${p[0]}?`,p[3],p[4],family,p[2]);add(`who-${String(i+1).padStart(3,'0')}`,'who-am-i',`I ${p[1]}. Who am I?`,p[0],p[3],p[4],family,p[2]);});
const wheels=[
['IN THE BEGINNING','Genesis','easy','Genesis 1:1'],['LET MY PEOPLE GO','Exodus','easy','Exodus 5:1'],['THE LORD IS MY SHEPHERD','Psalms','easy','Psalm 23:1'],['A GENTLE ANSWER','Wisdom','medium','Proverbs 15:1'],['WALK HUMBLY WITH YOUR GOD','Prophets','medium','Micah 6:8'],['PREPARE THE WAY OF THE LORD','Gospels','medium','Matthew 3:3'],['BLESSED ARE THE PEACEMAKERS','Jesus','easy','Matthew 5:9'],['LOVE YOUR ENEMIES','Jesus','easy','Matthew 5:44'],['THE GOOD SAMARITAN','Parables','easy','Luke 10:30-37'],['THE PRODIGAL SON','Parables','easy','Luke 15:11-32'],['YOU MUST BE BORN AGAIN','Jesus','medium','John 3:7'],['LIVING WATER','Jesus','medium','John 4:10'],['BREAD OF LIFE','Jesus','easy','John 6:35'],['LIGHT OF THE WORLD','Jesus','easy','John 8:12'],['THE GOOD SHEPHERD','Jesus','easy','John 10:11'],['THE RESURRECTION AND THE LIFE','Jesus','medium','John 11:25'],['THE WAY THE TRUTH AND THE LIFE','Jesus','easy','John 14:6'],['GO AND MAKE DISCIPLES','Discipleship','easy','Matthew 28:19'],['POWER FROM ON HIGH','Acts','medium','Luke 24:49'],['FILLED WITH THE HOLY SPIRIT','Acts','easy','Acts 2:4'],['A SON OF ENCOURAGEMENT','Acts','medium','Acts 4:36'],['PRAY WITHOUT CEASING','Prayer','easy','1 Thessalonians 5:17'],['REJOICE IN THE LORD','Christian Living','easy','Philippians 4:4'],['THE PEACE OF GOD','Christian Living','easy','Philippians 4:7'],['ARMOR OF GOD','Christian Living','easy','Ephesians 6:11'],['RUN WITH PERSEVERANCE','Faith','medium','Hebrews 12:1'],['FAITH WITHOUT WORKS IS DEAD','Faith','medium','James 2:26'],['CAST ALL YOUR ANXIETY ON HIM','Hope','medium','1 Peter 5:7'],['A NEW HEAVEN AND A NEW EARTH','Revelation','medium','Revelation 21:1'],['EVERY TRIBE AND LANGUAGE','Revelation','hard','Revelation 7:9']
];
wheels.forEach((x,i)=>add(`wheelx-${String(i+1).padStart(3,'0')}`,'wheel',x[0],x[0],x[1],x[2],family,x[3]));
const surveys=[
['Name something associated with Noah.',['Ark','Flood','Animals','Rainbow','Dove'],'Genesis'],['Name something associated with Moses.',['Red Sea','Ten Commandments','Burning Bush','Pharaoh','Manna'],'Exodus'],['Name something associated with David.',['Goliath','King','Psalms','Shepherd','Jonathan'],'Samuel'],['Name something associated with Solomon.',['Wisdom','Temple','Proverbs','Queen of Sheba','Wealth'],'Kings'],['Name something associated with Elijah.',['Mount Carmel','Fire','Ravens','Ahab','Whirlwind'],'Kings'],['Name something associated with Daniel.',['Lions’ Den','Dreams','Babylon','Prayer','Fiery Furnace'],'Prophets'],['Name something associated with Jonah.',['Great Fish','Nineveh','Storm','Ship','Plant'],'Prophets'],['Name something associated with Jesus’ birth.',['Bethlehem','Manger','Mary','Shepherds','Angels'],'Gospels'],['Name one of Jesus’ miracles.',['Healing the Sick','Feeding Five Thousand','Walking on Water','Calming Storm','Raising Lazarus'],'Miracles'],['Name one of Jesus’ parables.',['Good Samaritan','Prodigal Son','Sower','Lost Sheep','Talents'],'Parables'],['Name something associated with Peter.',['Fisherman','Walking on Water','Denied Jesus','Pentecost','Keys'],'Gospels'],['Name something associated with Paul.',['Damascus Road','Missionary Journeys','Letters','Prison','Silas'],'Acts'],['Name part of the armor of God.',['Belt of Truth','Breastplate of Righteousness','Shield of Faith','Helmet of Salvation','Sword of the Spirit'],'Christian Living'],['Name a fruit of the Spirit.',['Love','Joy','Peace','Patience','Kindness'],'Christian Living'],['Name something Christians commonly do together.',['Pray','Worship','Study Scripture','Serve','Share Meals'],'Church']
];
surveys.forEach((x,i)=>add(`surveyx-${String(i+1).padStart(3,'0')}`,'survey',x[0],x[1],x[2],'easy',family,''));
const verses=[
['The Lord is my shepherd; I shall not ____.','want','Psalms','Psalm 23:1'],['Be still, and know that I am ____.','God','Psalms','Psalm 46:10'],['Trust in the Lord with all your ____.','heart','Wisdom','Proverbs 3:5'],['A gentle answer turns away ____.','wrath','Wisdom','Proverbs 15:1'],['Those who hope in the Lord will renew their ____.','strength','Prophets','Isaiah 40:31'],['Blessed are the peacemakers, for they will be called children of ____.','God','Jesus','Matthew 5:9'],['Where your treasure is, there your ____ will be also.','heart','Jesus','Matthew 6:21'],['Ask and it will be given to you; seek and you will ____.','find','Jesus','Matthew 7:7'],['Love the Lord your God with all your ____.','heart','Jesus','Matthew 22:37'],['The truth will set you ____.','free','Jesus','John 8:32'],['I am the way and the truth and the ____.','life','Jesus','John 14:6'],['You will receive power when the Holy Spirit comes on ____.','you','Acts','Acts 1:8'],['The wages of sin is ____.','death','Salvation','Romans 6:23'],['Faith comes by hearing, and hearing by the word of ____.','Christ','Faith','Romans 10:17'],['Do everything in ____.','love','Christian Living','1 Corinthians 16:14']
];
verses.forEach((x,i)=>add(`verse-${String(i+1).padStart(3,'0')}`,'finish-the-verse',x[0],x[1],x[2],'medium',mixed,x[3]));
window.NLDG_GAME_PACKS?.register({id:'general-bible-expanded',name:'General Bible Expanded',description:'A large mixed-audience pack of Bible statements, character clues, puzzles, surveys, and verse completions.',version:'1.0.0',author:'No Labels, Designed by God',games:['scripture-or-suspicion','jeopardy','wheel','survey','finish-the-verse','who-am-i'],audiences:['kids','teens','adults','family','mixed'],questions});
};
if(window.NLDG_GAME_PACKS)register();else window.addEventListener('nldg-game-pack-engine-ready',register,{once:true});
})();
