(()=>{
const base=window.NLDG_ES_FINISH_VERSE;
if(!base)return;
const entries={
'Romans 3:23':{
 prompt:'Pues todos hemos pecado; nadie puede alcanzar la meta ____ establecida por Dios.',
 sourceAnswer:'glory',answer:'gloriosa',verified:true,
 choiceMap:{glory:'gloriosa',grace:'gracia',law:'ley',truth:'verdad'}
},
'Isaiah 40:31':{
 prompt:'En cambio, los que confían en el Señor encontrarán nuevas ____.',
 sourceAnswer:'strength',answer:'fuerzas',verified:true,
 choiceMap:{strength:'fuerzas',faith:'fe',hope:'esperanza',joy:'alegría'}
},
'Matthew 6:33':{
 prompt:'Busquen el reino de ____ por encima de todo lo demás y lleven una vida justa.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',heaven:'los cielos',truth:'la verdad',light:'la luz'}
},
'Colossians 3:2':{
 prompt:'Piensen en las cosas del ____, no en las de la tierra.',
 sourceAnswer:'above',answer:'cielo',verified:true,
 choiceMap:{above:'cielo',eternal:'futuro',holy:'templo',true:'mundo'}
},
'Ephesians 4:32':{
 prompt:'Por el contrario, sean amables unos con otros, sean de buen ____.',
 sourceAnswer:'compassionate',answer:'corazón',verified:true,
 choiceMap:{compassionate:'corazón',honest:'testimonio',patient:'ánimo',faithful:'carácter'}
},
'1 Peter 5:7':{
 prompt:'Pongan todas sus preocupaciones y ansiedades en las manos de Dios, porque él ____ de ustedes.',
 sourceAnswer:'cares',answer:'cuida',verified:true,
 choiceMap:{cares:'cuida',prays:'ora',waits:'espera',speaks:'habla'}
},
'Proverbs 4:23':{
 prompt:'Sobre todas las cosas cuida tu ____, porque este determina el rumbo de tu vida.',
 sourceAnswer:'heart',answer:'corazón',verified:true,
 choiceMap:{heart:'corazón',mind:'mente',words:'palabras',steps:'pasos'}
},
'Luke 6:31':{
 prompt:'Traten a los demás como les gustaría que ellos los trataran a ____.',
 sourceAnswer:'you',answer:'ustedes',verified:true,
 choiceMap:{you:'ustedes',all:'todos',friends:'sus amigos',neighbors:'sus vecinos'}
},
'Romans 12:12':{
 prompt:'Tengan paciencia en las dificultades y sigan ____.',
 sourceAnswer:'prayer',answer:'orando',verified:true,
 choiceMap:{prayer:'orando',service:'sirviendo',love:'amando',work:'trabajando'}
},
'Romans 5:8':{
 prompt:'Dios mostró el gran amor que nos tiene al enviar a Cristo a ____ por nosotros cuando todavía éramos pecadores.',
 sourceAnswer:'died',answer:'morir',verified:true,
 choiceMap:{died:'morir',prayed:'orar',waited:'esperar',spoke:'hablar'}
},
'Ephesians 2:10':{
 prompt:'Pues somos la ____ de Dios. Él nos creó de nuevo en Cristo Jesús.',
 sourceAnswer:'workmanship',answer:'obra maestra',verified:true,
 choiceMap:{workmanship:'obra maestra',children:'hijos',people:'pueblo',servants:'siervos'}
},
'Colossians 3:23':{
 prompt:'Trabajen ____ en todo lo que hagan, como si fuera para el Señor y no para la gente.',
 sourceAnswer:'heart',answer:'de buena gana',verified:true,
 choiceMap:{heart:'de buena gana',strength:'con todas sus fuerzas',mind:'con toda su mente',faith:'con fe'}
},
'James 4:8':{
 prompt:'Acérquense a Dios, y Dios se acercará a ____.',
 sourceAnswer:'you',answer:'ustedes',verified:true,
 choiceMap:{you:'ustedes',all:'todos',them:'ellos',us:'nosotros'}
},
'1 John 1:9':{
 prompt:'Él es fiel y ____ para perdonarnos nuestros pecados.',
 sourceAnswer:'just',answer:'justo',verified:true,
 choiceMap:{just:'justo',loving:'amoroso',merciful:'misericordioso',kind:'bondadoso'}
},
'Hebrews 13:8':{
 prompt:'Jesucristo es el mismo ayer, hoy y ____.',
 sourceAnswer:'forever',answer:'siempre',verified:true,
 choiceMap:{forever:'siempre',always:'ahora',tomorrow:'mañana',eternally:'eternamente'}
},
'Psalm 27:1':{
 prompt:'El Señor es mi luz y mi ____.',
 sourceAnswer:'salvation',answer:'salvación',verified:true,
 choiceMap:{salvation:'salvación',strength:'fortaleza',hope:'esperanza',shield:'escudo'}
},
'Philippians 4:6':{
 prompt:'No se preocupen por ____; en cambio, oren por todo.',
 sourceAnswer:'anything',answer:'nada',verified:true,
 choiceMap:{anything:'nada',tomorrow:'mañana',money:'dinero',trouble:'problemas'}
},
'Mark 12:30':{
 prompt:'Ama al Señor tu Dios con todo tu ____, con toda tu alma, con toda tu mente y con todas tus fuerzas.',
 sourceAnswer:'heart',answer:'corazón',verified:true,
 choiceMap:{heart:'corazón',mind:'mente',strength:'fuerzas',soul:'alma'}
},
'Psalm 91:2':{
 prompt:'Solo él es mi refugio, mi ____; él es mi Dios y en él confío.',
 sourceAnswer:'fortress',answer:'lugar seguro',verified:true,
 choiceMap:{fortress:'lugar seguro',shield:'escudo',strength:'fortaleza',rock:'roca'}
},
'Proverbs 16:3':{
 prompt:'Pon todo lo que hagas en manos del ____, y tus planes tendrán éxito.',
 sourceAnswer:'Lord',answer:'Señor',verified:true,
 choiceMap:{Lord:'Señor',church:'pastor',wise:'sabio',faithful:'fiel'}
}
};
base.referenceBooks=Object.assign(base.referenceBooks||{}, {
 Isaiah:'Isaías',Colossians:'Colosenses','1 Peter':'1 Pedro',Proverbs:'Proverbios','1 John':'1 Juan',Mark:'Marcos'
});
base.audiences=base.audiences||{};
base.audiences.kids={label:'Niños',sourceQuestionCount:20,entries};
base.reviewedAudiences=[...new Set([...(base.reviewedAudiences||[base.sourceAudience]),'kids'])];
base.reviewedQuestionCount=60;
})();