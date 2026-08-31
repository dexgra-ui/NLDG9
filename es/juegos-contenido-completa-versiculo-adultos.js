(()=>{
const base=window.NLDG_ES_FINISH_VERSE;
if(!base)return;
const entries={
'Romans 8:1':{
 prompt:'Por lo tanto, ya no hay condenación para los que pertenecen a Cristo ____.',
 sourceAnswer:'Jesus',answer:'Jesús',verified:true,
 choiceMap:{Jesus:'Jesús',God:'Dios','the Lord':'el Señor','the Spirit':'el Espíritu'}
},
'2 Timothy 3:16':{
 prompt:'Toda la Escritura es inspirada por ____ y es útil para enseñarnos lo que es verdad.',
 sourceAnswer:'breathed',answer:'Dios',verified:true,
 choiceMap:{breathed:'Dios',spoken:'los profetas',written:'los apóstoles',given:'la iglesia'}
},
'James 2:17':{
 prompt:'A menos que produzca buenas acciones, la fe está ____ y es inútil.',
 sourceAnswer:'dead',answer:'muerta',verified:true,
 choiceMap:{dead:'muerta',weak:'débil',empty:'vacía',unfinished:'incompleta'}
},
'Romans 5:3':{
 prompt:'También nos alegramos al enfrentar pruebas y dificultades porque sabemos que nos ayudan a desarrollar ____.',
 sourceAnswer:'perseverance',answer:'resistencia',verified:true,
 choiceMap:{perseverance:'resistencia',wisdom:'sabiduría',faith:'fe',humility:'humildad'}
},
'Philippians 2:5':{
 prompt:'Tengan la misma actitud que tuvo Cristo ____.',
 sourceAnswer:'Jesus',answer:'Jesús',verified:true,
 choiceMap:{Jesus:'Jesús','the Lord':'el Señor','our Savior':'nuestro Salvador','the King':'el Rey'}
},
'1 Corinthians 13:4':{
 prompt:'El amor es paciente y ____.',
 sourceAnswer:'kind',answer:'bondadoso',verified:true,
 choiceMap:{kind:'bondadoso',faithful:'fiel',gentle:'amable',strong:'fuerte'}
},
'Galatians 2:20':{
 prompt:'Mi antiguo yo ha sido crucificado con ____.',
 sourceAnswer:'Christ',answer:'Cristo',verified:true,
 choiceMap:{Christ:'Cristo',Jesus:'Jesús','the Lord':'el Señor','the world':'el mundo'}
},
'Romans 12:1':{
 prompt:'Que sea un ____ vivo y santo, la clase de sacrificio que a él le agrada.',
 sourceAnswer:'sacrifice',answer:'sacrificio',verified:true,
 choiceMap:{sacrifice:'sacrificio',witness:'testimonio',temple:'templo',service:'servicio'}
},
'Ephesians 4:15':{
 prompt:'En cambio, hablaremos la verdad con ____ y así creceremos en todo sentido hasta parecernos más y más a Cristo.',
 sourceAnswer:'love',answer:'amor',verified:true,
 choiceMap:{love:'amor',faith:'fe',grace:'gracia',wisdom:'sabiduría'}
},
'Colossians 1:16':{
 prompt:'Todo fue creado por medio de él y para ____.',
 sourceAnswer:'him',answer:'él',verified:true,
 choiceMap:{him:'él',God:'Dios',us:'nosotros',Christ:'Cristo'}
},
'Hebrews 4:12':{
 prompt:'Pues la palabra de Dios es viva y ____.',
 sourceAnswer:'active',answer:'poderosa',verified:true,
 choiceMap:{active:'poderosa',true:'verdadera',powerful:'fuerte',holy:'santa'}
},
'1 Peter 3:15':{
 prompt:'Si alguien les pregunta acerca de la esperanza que tienen como creyentes, estén siempre preparados para dar una ____.',
 sourceAnswer:'answer',answer:'explicación',verified:true,
 choiceMap:{answer:'explicación',account:'razón',explanation:'defensa',example:'ejemplo'}
},
'Romans 14:19':{
 prompt:'Por lo tanto, procuremos que haya ____ en la iglesia y tratemos de edificarnos unos a otros.',
 sourceAnswer:'peace',answer:'armonía',verified:true,
 choiceMap:{peace:'armonía',unity:'unidad',love:'amor',growth:'crecimiento'}
},
'2 Corinthians 12:9':{
 prompt:'Cada vez él me dijo: «Mi gracia es todo lo que ____; mi poder actúa mejor en la debilidad».',
 sourceAnswer:'you',answer:'necesitas',verified:true,
 choiceMap:{you:'necesitas',all:'necesitan todos',them:'necesitan ellos',us:'necesitamos'}
},
'Ephesians 3:20':{
 prompt:'Dios puede lograr mucho más de lo que pudiéramos pedir o incluso ____.',
 sourceAnswer:'imagine',answer:'imaginar',verified:true,
 choiceMap:{imagine:'imaginar',believe:'creer',expect:'esperar',desire:'desear'}
},
'Philippians 2:3':{
 prompt:'Sean humildes, es decir, considerando a los demás como mejores que ____.',
 sourceAnswer:'yourselves',answer:'ustedes',verified:true,
 choiceMap:{yourselves:'ustedes',everyone:'todos',friends:'sus amigos',leaders:'sus líderes'}
},
'Romans 13:10':{
 prompt:'El amor no hace mal a otros, por eso el amor cumple con las exigencias de la ____ de Dios.',
 sourceAnswer:'law',answer:'ley',verified:true,
 choiceMap:{law:'ley',command:'orden',gospel:'Buena Noticia',covenant:'alianza'}
},
'1 John 4:18':{
 prompt:'En esa clase de amor no hay temor, porque el amor perfecto expulsa todo ____.',
 sourceAnswer:'fear',answer:'temor',verified:true,
 choiceMap:{fear:'temor',doubt:'duda',anger:'enojo',worry:'preocupación'}
},
'Hebrews 10:24':{
 prompt:'Pensemos en maneras de motivarnos unos a otros a realizar actos de amor y buenas ____.',
 sourceAnswer:'deeds',answer:'acciones',verified:true,
 choiceMap:{deeds:'acciones',works:'obras',choices:'decisiones',service:'servicio'}
},
'James 3:17':{
 prompt:'Sin embargo, la sabiduría que proviene del cielo es, ante todo, ____ y también ama la paz.',
 sourceAnswer:'pure',answer:'pura',verified:true,
 choiceMap:{pure:'pura',peaceful:'pacífica',gentle:'amable',true:'verdadera'}
}
};
base.referenceBooks=Object.assign(base.referenceBooks||{}, {
 '2 Timothy':'2 Timoteo','1 Corinthians':'1 Corintios',Galatians:'Gálatas',Colossians:'Colosenses','1 Peter':'1 Pedro','2 Corinthians':'2 Corintios','1 John':'1 Juan'
});
base.audiences=base.audiences||{};
base.audiences.adults={label:'Adultos',sourceQuestionCount:20,entries};
base.reviewedAudiences=[...new Set([...(base.reviewedAudiences||[base.sourceAudience]),'adults'])];
base.reviewedQuestionCount=100;
})();