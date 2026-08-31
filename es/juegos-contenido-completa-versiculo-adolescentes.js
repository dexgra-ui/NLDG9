(()=>{
const base=window.NLDG_ES_FINISH_VERSE;
if(!base)return;
const entries={
'Romans 10:17':{
 prompt:'Así que la fe viene por oír, es decir, por oír la Buena Noticia acerca de ____.',
 sourceAnswer:'Christ',answer:'Cristo',verified:true,
 choiceMap:{Christ:'Cristo',truth:'la verdad',God:'Dios',life:'la vida'}
},
'Psalm 37:4':{
 prompt:'Deléitate en el Señor, y él te concederá los deseos de tu ____.',
 sourceAnswer:'heart',answer:'corazón',verified:true,
 choiceMap:{heart:'corazón',soul:'alma',mind:'mente',life:'vida'}
},
'2 Timothy 1:7':{
 prompt:'Pues Dios no nos ha dado un espíritu de ____ y timidez sino de poder, amor y autodisciplina.',
 sourceAnswer:'fear',answer:'temor',verified:true,
 choiceMap:{fear:'temor',anger:'enojo',pride:'orgullo',confusion:'confusión'}
},
'James 1:2':{
 prompt:'Cuando tengan que enfrentar cualquier tipo de problemas, considérenlo como un tiempo para alegrarse ____.',
 sourceAnswer:'trials',answer:'mucho',verified:true,
 choiceMap:{trials:'mucho',enemies:'con sus enemigos',sorrow:'en la tristeza',failure:'por el fracaso'}
},
'John 13:35':{
 prompt:'El ____ que tengan unos por otros será la prueba ante el mundo de que son mis discípulos.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',faith:'fe',words:'mensaje',service:'servicio'}
},
'1 Corinthians 10:31':{
 prompt:'Sea que coman o beban o cualquier otra cosa que hagan, háganlo todo para la gloria de ____.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',Christ:'Cristo',heaven:'los cielos',love:'el amor'}
},
'Romans 15:13':{
 prompt:'Que Dios, fuente de esperanza, los llene completamente de alegría y ____, porque confían en él.',
 sourceAnswer:'peace',answer:'paz',verified:true,
 choiceMap:{peace:'paz',strength:'fuerza',truth:'verdad',grace:'gracia'}
},
'Ephesians 2:8':{
 prompt:'Dios los salvó por su gracia cuando ____.',
 sourceAnswer:'faith',answer:'creyeron',verified:true,
 choiceMap:{faith:'creyeron',works:'trabajaron',law:'guardaron la ley',hope:'esperaron'}
},
'Philippians 1:6':{
 prompt:'Dios, quien comenzó la buena obra en ustedes, la continuará hasta que quede completamente ____.',
 sourceAnswer:'completion',answer:'terminada',verified:true,
 choiceMap:{completion:'terminada',heaven:'en el cielo',victory:'victoriosa',maturity:'madura'}
},
'Colossians 3:13':{
 prompt:'Recuerden que el Señor los ____ a ustedes, así que ustedes deben perdonar a otros.',
 sourceAnswer:'forgave',answer:'perdonó',verified:true,
 choiceMap:{forgave:'perdonó',loved:'amó',called:'llamó',helped:'ayudó'}
},
'James 1:5':{
 prompt:'Si necesitan sabiduría, pídansela a nuestro generoso ____, y él se la dará.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',others:'prójimo',leaders:'líder',teachers:'maestro'}
},
'1 Peter 2:9':{
 prompt:'Pero ustedes son un linaje ____, sacerdotes del Rey, una nación santa, posesión exclusiva de Dios.',
 sourceAnswer:'people',answer:'escogido',verified:true,
 choiceMap:{people:'escogido',nation:'santo',family:'familiar',church:'de la iglesia'}
},
'Romans 1:16':{
 prompt:'Pues no me avergüenzo de esta ____ acerca de Cristo.',
 sourceAnswer:'gospel',answer:'Buena Noticia',verified:true,
 choiceMap:{gospel:'Buena Noticia',truth:'verdad',cross:'cruz',church:'iglesia'}
},
'Galatians 6:9':{
 prompt:'Así que no nos cansemos de hacer el ____.',
 sourceAnswer:'good',answer:'bien',verified:true,
 choiceMap:{good:'bien',work:'trabajo',ministry:'ministerio',right:'deber'}
},
'Psalm 139:14':{
 prompt:'¡Gracias por hacerme tan maravillosamente ____!',
 sourceAnswer:'made',answer:'complejo',verified:true,
 choiceMap:{made:'complejo',loved:'amado',known:'conocido',chosen:'escogido'}
},
'Matthew 5:14':{
 prompt:'Ustedes son la luz del ____.',
 sourceAnswer:'world',answer:'mundo',verified:true,
 choiceMap:{world:'mundo',church:'iglesia',city:'ciudad',nations:'naciones'}
},
'John 10:10':{
 prompt:'Mi propósito es darles una ____ plena y abundante.',
 sourceAnswer:'life',answer:'vida',verified:true,
 choiceMap:{life:'vida',peace:'paz',hope:'esperanza',truth:'verdad'}
},
'Romans 8:31':{
 prompt:'Si Dios está a favor de nosotros, ¿quién podrá ponerse en nuestra ____?',
 sourceAnswer:'against',answer:'contra',verified:true,
 choiceMap:{against:'contra',over:'encima',near:'cerca',before:'delante'}
},
'1 Corinthians 16:14':{
 prompt:'Y hagan todo con ____.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',faith:'fe',truth:'verdad',hope:'esperanza'}
},
'Ephesians 5:2':{
 prompt:'Vivan una vida llena de ____, siguiendo el ejemplo de Cristo.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',truth:'verdad',faith:'fe',wisdom:'sabiduría'}
}
};
base.referenceBooks=Object.assign(base.referenceBooks||{}, {
 '2 Timothy':'2 Timoteo','1 Corinthians':'1 Corintios','1 Peter':'1 Pedro',Galatians:'Gálatas'
});
base.audiences=base.audiences||{};
base.audiences.teens={label:'Adolescentes',sourceQuestionCount:20,entries};
base.reviewedAudiences=[...new Set([...(base.reviewedAudiences||[base.sourceAudience]),'teens'])];
base.reviewedQuestionCount=80;
})();