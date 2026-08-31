(()=>{
const base=window.NLDG_ES_FINISH_VERSE;
if(!base)return;
const entries={
'Genesis 1:1':{
 prompt:'En el principio, Dios creó los cielos y la ____.',
 sourceAnswer:'earth',answer:'tierra',verified:true,
 choiceMap:{earth:'tierra',sea:'mar',sun:'sol',stars:'estrellas'}
},
'Psalm 118:24':{
 prompt:'Este es el día que ____ el Señor; nos gozaremos y alegraremos en él.',
 sourceAnswer:'made',answer:'hizo',verified:true,
 choiceMap:{made:'hizo',given:'dio',blessed:'bendijo',chosen:'escogió'}
},
'Psalm 150:6':{
 prompt:'¡Que todo lo que respira cante alabanzas al ____!',
 sourceAnswer:'Lord',answer:'Señor',verified:true,
 choiceMap:{Lord:'Señor',King:'Rey',Creator:'Creador',Savior:'Salvador'}
},
'Luke 1:37':{
 prompt:'Pues la palabra de ____ nunca dejará de cumplirse.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',faith:'fe',prayer:'oración',hope:'esperanza'}
},
'John 14:6':{
 prompt:'Yo soy el camino, la verdad y la ____; nadie puede ir al Padre si no es por medio de mí.',
 sourceAnswer:'life',answer:'vida',verified:true,
 choiceMap:{life:'vida',light:'luz',hope:'esperanza',door:'puerta'}
},
'Psalm 34:8':{
 prompt:'Prueben y vean que el Señor es ____; ¡qué alegría para los que se refugian en él!',
 sourceAnswer:'good',answer:'bueno',verified:true,
 choiceMap:{good:'bueno',near:'cercano',holy:'santo',strong:'fuerte'}
},
'Psalm 56:3':{
 prompt:'Pero cuando tenga miedo, en ti pondré mi ____.',
 sourceAnswer:'trust',answer:'confianza',verified:true,
 choiceMap:{trust:'confianza',hope:'esperanza',rest:'descanso',believe:'fe'}
},
'Matthew 7:7':{
 prompt:'Sigue pidiendo y ____ lo que pides; sigue buscando y encontrarás.',
 sourceAnswer:'given',answer:'recibirás',verified:true,
 choiceMap:{given:'recibirás',shown:'verás',opened:'abrirás',sent:'enviarás'}
},
'Romans 6:23':{
 prompt:'El regalo que Dios da es la ____ eterna por medio de Cristo Jesús nuestro Señor.',
 sourceAnswer:'life',answer:'vida',verified:true,
 choiceMap:{life:'vida',peace:'paz',hope:'esperanza',joy:'alegría'}
},
'Matthew 11:28':{
 prompt:'Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré ____.',
 sourceAnswer:'rest',answer:'descanso',verified:true,
 choiceMap:{rest:'descanso',peace:'paz',strength:'fuerza',hope:'esperanza'}
},
'Psalm 121:2':{
 prompt:'¡Mi ayuda viene del ____, quien hizo el cielo y la tierra!',
 sourceAnswer:'Lord',answer:'Señor',verified:true,
 choiceMap:{Lord:'Señor',mountains:'monte',church:'iglesia',heavens:'cielo'}
},
'Matthew 5:16':{
 prompt:'Dejen que sus buenas acciones ____ a la vista de todos.',
 sourceAnswer:'shine',answer:'brillen',verified:true,
 choiceMap:{shine:'brillen',burn:'ardan',grow:'crezcan',lead:'guíen'}
},
'Psalm 136:1':{
 prompt:'¡Den gracias al Señor, porque él es ____!',
 sourceAnswer:'good',answer:'bueno',verified:true,
 choiceMap:{good:'bueno',holy:'santo',near:'cercano',faithful:'fiel'}
},
'John 15:5':{
 prompt:'Separados de mí, no pueden hacer ____.',
 sourceAnswer:'nothing',answer:'nada',verified:true,
 choiceMap:{nothing:'nada',little:'poco',anything:'cualquier cosa',more:'más'}
},
'Psalm 100:4':{
 prompt:'Entren por sus puertas con acción de ____; vayan a sus atrios con alabanza.',
 sourceAnswer:'thanksgiving',answer:'gracias',verified:true,
 choiceMap:{thanksgiving:'gracias',praise:'alabanza',joy:'alegría',singing:'canto'}
},
'Joshua 1:9':{
 prompt:'Mi mandato es: «¡Sé fuerte y ____!»',
 sourceAnswer:'courageous',answer:'valiente',verified:true,
 choiceMap:{courageous:'valiente',faithful:'fiel',patient:'paciente',wise:'sabio'}
},
'Romans 12:21':{
 prompt:'No dejen que el mal los venza, más bien venzan el mal haciendo el ____.',
 sourceAnswer:'good',answer:'bien',verified:true,
 choiceMap:{good:'bien',love:'amor',truth:'verdad',faith:'fe'}
},
'Matthew 28:19':{
 prompt:'Por lo tanto, vayan y hagan ____ de todas las naciones.',
 sourceAnswer:'disciples',answer:'discípulos',verified:true,
 choiceMap:{disciples:'discípulos',believers:'creyentes',servants:'siervos',teachers:'maestros'}
},
'Psalm 19:1':{
 prompt:'Los cielos proclaman la gloria de ____ y el firmamento despliega la destreza de sus manos.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',creation:'la creación',heaven:'los cielos',Christ:'Cristo'}
},
'1 Corinthians 13:13':{
 prompt:'Tres cosas durarán para siempre: la fe, la esperanza y el ____; y la mayor de las tres es el amor.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',faith:'fe',hope:'esperanza',grace:'gracia'}
}
};
base.audiences=base.audiences||{};
if(!base.audiences.family)base.audiences.family={label:'Familia',sourceQuestionCount:base.sourceQuestionCount,entries:base.entries};
base.audiences.preschool={label:'Preescolar',sourceQuestionCount:20,entries};
base.reviewedAudiences=[...new Set([...(base.reviewedAudiences||[base.sourceAudience]),'preschool'])];
base.reviewedQuestionCount=40;
})();