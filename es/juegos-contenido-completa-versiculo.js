(()=>{
const entries={
'Genesis 1:1':{
 prompt:'En el principio, Dios creó los cielos y la ____.',
 sourceAnswer:'earth',answer:'tierra',verified:true,
 choiceMap:{earth:'tierra',sea:'mar',light:'luz',stars:'estrellas'}
},
'Romans 3:23':{
 prompt:'Pues todos hemos pecado; nadie puede alcanzar la meta ____ establecida por Dios.',
 sourceAnswer:'glory',answer:'gloriosa',verified:true,
 choiceMap:{glory:'gloriosa',grace:'gracia',law:'ley',truth:'verdad'}
},
'Joshua 1:9':{
 prompt:'Mi mandato es: «¡Sé fuerte y ____!»',
 sourceAnswer:'courageous',answer:'valiente',verified:true,
 choiceMap:{courageous:'valiente',faithful:'fiel',patient:'paciente',wise:'sabio'}
},
'Matthew 6:33':{
 prompt:'Busquen el reino de ____ por encima de todo lo demás y lleven una vida justa.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',heaven:'los cielos',truth:'la verdad',light:'la luz'}
},
'Psalm 118:24':{
 prompt:'Este es el día que ____ el Señor; nos gozaremos y alegraremos en él.',
 sourceAnswer:'made',answer:'hizo',verified:true,
 choiceMap:{made:'hizo',given:'dio',blessed:'bendijo',chosen:'escogió'}
},
'Ephesians 4:32':{
 prompt:'Por el contrario, sean amables unos con otros, sean de buen ____.',
 sourceAnswer:'compassionate',answer:'corazón',verified:true,
 choiceMap:{compassionate:'corazón',honest:'testimonio',patient:'ánimo',faithful:'carácter'}
},
'Psalm 56:3':{
 prompt:'Pero cuando tenga miedo, en ti pondré mi ____.',
 sourceAnswer:'trust',answer:'confianza',verified:true,
 choiceMap:{trust:'confianza',hope:'esperanza',rest:'descanso',believe:'fe'}
},
'John 14:6':{
 prompt:'Yo soy el camino, la verdad y la ____; nadie puede ir al Padre si no es por medio de mí.',
 sourceAnswer:'life',answer:'vida',verified:true,
 choiceMap:{life:'vida',light:'luz',hope:'esperanza',door:'puerta'}
},
'Romans 5:8':{
 prompt:'Dios mostró el gran amor que nos tiene al enviar a Cristo a ____ por nosotros cuando todavía éramos pecadores.',
 sourceAnswer:'died',answer:'morir',verified:true,
 choiceMap:{died:'morir',prayed:'orar',waited:'esperar',spoke:'hablar'}
},
'Matthew 28:19':{
 prompt:'Por lo tanto, vayan y hagan ____ de todas las naciones.',
 sourceAnswer:'disciples',answer:'discípulos',verified:true,
 choiceMap:{disciples:'discípulos',believers:'creyentes',servants:'siervos',teachers:'maestros'}
},
'2 Timothy 1:7':{
 prompt:'Dios no nos ha dado un espíritu de ____ y timidez sino de poder, amor y autodisciplina.',
 sourceAnswer:'fear',answer:'temor',verified:true,
 choiceMap:{fear:'temor',anger:'enojo',pride:'orgullo',confusion:'confusión'}
},
'Psalm 121:2':{
 prompt:'¡Mi ayuda viene del ____, quien hizo el cielo y la tierra!',
 sourceAnswer:'Lord',answer:'Señor',verified:true,
 choiceMap:{Lord:'Señor',mountains:'monte',church:'iglesia',heavens:'cielo'}
},
'1 Corinthians 13:13':{
 prompt:'Tres cosas durarán para siempre: la fe, la esperanza y el ____; y la mayor de las tres es el amor.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',faith:'fe',hope:'esperanza',grace:'gracia'}
},
'John 15:5':{
 prompt:'Separados de mí, no pueden hacer ____.',
 sourceAnswer:'nothing',answer:'nada',verified:true,
 choiceMap:{nothing:'nada',little:'poco',anything:'cualquier cosa',more:'más'}
},
'Matthew 5:16':{
 prompt:'Dejen que sus buenas acciones ____ a la vista de todos.',
 sourceAnswer:'shine',answer:'brillen',verified:true,
 choiceMap:{shine:'brillen',burn:'ardan',grow:'crezcan',lead:'guíen'}
},
'James 4:8':{
 prompt:'Acérquense a Dios, y Dios se acercará a ____.',
 sourceAnswer:'you',answer:'ustedes',verified:true,
 choiceMap:{you:'ustedes',all:'todos',them:'ellos',us:'nosotros'}
},
'Hebrews 13:8':{
 prompt:'Jesucristo es el mismo ayer, hoy y ____.',
 sourceAnswer:'forever',answer:'siempre',verified:true,
 choiceMap:{forever:'siempre',always:'ahora',tomorrow:'mañana',eternally:'eternamente'}
},
'Philippians 4:6':{
 prompt:'No se preocupen por ____; en cambio, oren por todo.',
 sourceAnswer:'anything',answer:'nada',verified:true,
 choiceMap:{anything:'nada',tomorrow:'mañana',money:'dinero',trouble:'problemas'}
},
'Romans 12:21':{
 prompt:'No dejen que el mal los venza, más bien venzan el mal haciendo el ____.',
 sourceAnswer:'good',answer:'bien',verified:true,
 choiceMap:{good:'bien',love:'amor',truth:'verdad',faith:'fe'}
},
'Luke 1:37':{
 prompt:'Pues la palabra de ____ nunca dejará de cumplirse.',
 sourceAnswer:'God',answer:'Dios',verified:true,
 choiceMap:{God:'Dios',faith:'fe',prayer:'oración',hope:'esperanza'}
}
};
const referenceBooks={
'Genesis':'Génesis','Romans':'Romanos','Joshua':'Josué','Matthew':'Mateo','Psalm':'Salmo','Ephesians':'Efesios','John':'Juan','2 Timothy':'2 Timoteo','1 Corinthians':'1 Corintios','James':'Santiago','Hebrews':'Hebreos','Philippians':'Filipenses','Luke':'Lucas'
};
window.NLDG_ES_FINISH_VERSE={
 translation:'NTV',sourceAudience:'family',sourceQuestionCount:20,entries,referenceBooks,
 copyrightNotice:'Texto bíblico NTV © Tyndale House Foundation, 2010. Usado con permiso de Tyndale House Publishers, Inc. Todos los derechos reservados.'
};
})();