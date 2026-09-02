const zechariahPurpose='Esta lección ayuda a los participantes a leer el pasaje dentro de su contexto profético, interpretar sus imágenes con responsabilidad y responder mediante adoración, justicia, arrepentimiento, compasión y esperanza.';
const zechariahOpening='Ora pidiendo sabiduría y gentileza. Invita a compartir una palabra, imagen o pregunta. Nadie tiene que revelar experiencias traumáticas, historia matrimonial, abuso, duelo, enfermedad, desplazamiento, sexualidad ni antecedentes de salud mental. Escucha sin apresurarte a explicar el dolor de otra persona.';
const zechariahExamination='¿Dónde estoy confiando en el poder, resistiendo la corrección, usando lenguaje religioso para controlar o pasando por alto la dignidad de otra persona? Pídele a Dios una convicción sincera y un paso lleno de gracia hacia el arrepentimiento, la reparación, el valor o una esperanza fiel.';
const zechariahGuidance='Trata los símbolos apocalípticos con humildad. No identifiques cada figura con políticos actuales, no predigas fechas, no señales al pueblo judío ni justifiques la violencia. Honra el contexto judío posexílico de Zacarías y el cumplimiento mesiánico cristiano sin desprecio de reemplazo, teorías de conspiración ni interpretaciones partidistas. Nunca presiones a nadie para revelar información personal, buscar una reconciliación insegura o aceptar especulaciones. El juicio pertenece a Dios. Da prioridad al consentimiento, la seguridad, la rendición de cuentas veraz y el cuidado práctico.';
const zechariahGenericBody=heading=>`${heading} muestra que Dios confronta la adoración falsa y el poder abusivo mientras llama a las personas a la verdad, la responsabilidad, la misericordia y la esperanza. El pasaje debe leerse dentro de su contexto profético y del pacto, no convertirse en un lema para controlar a otros.`;
const zechariahContext=passage=>`Lee ${passage} en secciones manejables. Observa la audiencia, la crisis histórica, las metáforas, las visiones, las acciones simbólicas y el movimiento entre juicio y esperanza. No separes las imágenes severas de su contexto del pacto ni las trates como una orden directa para la actualidad.`;
const zechariahQuestions=passage=>[
  `¿Qué te llama la atención en ${passage}?`,
  '¿Qué revela este pasaje acerca de Dios?',
  '¿Qué fracaso humano o qué esperanza deja al descubierto?',
  '¿Qué símbolo necesita contexto histórico?',
  '¿La dignidad o la seguridad de quién necesita atención?',
  '¿Qué interpretación dañina debemos rechazar?',
  '¿Cómo moldea este pasaje el liderazgo o la adoración fiel?',
  '¿Qué pondrás en práctica esta semana?'
];
const zechariahPractice=passage=>`Lee ${passage} otra vez. Escribe una verdad acerca de Dios, una advertencia y una esperanza. Elige un acto práctico de escucha, rendición de cuentas, misericordia, apoyo material, respeto de límites, justicia, oración o adoración.`;
const zechariahPrayer=passage=>`Dios fiel, encuéntranos en ${passage}. Corrige nuestra adoración falsa, protege a las personas vulnerables, renueva nuestro corazón y enséñanos a vivir por tu Espíritu con justicia, misericordia, humildad y esperanza. Amén.`;
const zMovement=(heading,body)=>({heading,body:body||zechariahGenericBody(heading)});

window.NLDG_BOOK_STUDY={
  slug:'zacarias-estudio',
  book:'Zacarías',
  title:'Zacarías: Regreso, purificación, obra por el Espíritu y esperanza final',
  description:'Regreso, purificación, obra por el Espíritu, el Rey humilde y esperanza final',
  theme:'',
  audience:'Adultos, grupos, clases y equipos de ministerio',
  purpose:'Zacarías anima a una comunidad posexílica mediante llamados a volver a Dios, visiones nocturnas simbólicas, purificación, reconstrucción del templo, instrucción ética, esperanza mesiánica, imágenes de pastores y visiones del reinado universal de Dios.',
  background:'',
  scriptureStandard:'Nueva Traducción Viviente (NTV)',
  lessons:[
    {
      number:1,
      title:'Vuélvanse a mí, y yo me volveré a ustedes',
      scripture:'Zacarías 1',
      supporting:[],
      question:'¿Cómo puede comenzar de nuevo una comunidad posexílica desanimada?',
      truth:'Dios llama al pueblo a aprender de las generaciones anteriores, volver a él de todo corazón y confiar en su compasión renovada por Jerusalén.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 1'),
      teaching:[
        zMovement('Recuerden a los profetas anteriores'),
        zMovement('Volver a Dios es relacional'),
        zMovement('Los jinetes entre los mirtos'),
        zMovement('¿Hasta cuándo?'),
        zMovement('Dios responde con consuelo'),
        zMovement('La restauración se mide por la presencia de Dios')
      ],
      questions:zechariahQuestions('Zacarías 1'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 1'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 1')
    },
    {
      number:2,
      title:'Visiones nocturnas y la presencia restauradora de Dios',
      scripture:'Zacarías 1–6',
      supporting:[],
      question:'¿Qué revelan las visiones nocturnas de Zacarías acerca de la obra de Dios más allá de la debilidad visible?',
      truth:'Dios ve a las naciones, quita la maldad, protege a Jerusalén, purifica el liderazgo y hace avanzar la restauración por medio de su Espíritu.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 1–6'),
      teaching:[
        zMovement('Las visiones son revelación simbólica'),
        zMovement('Cuernos y artesanos'),
        zMovement('Una ciudad sin murallas'),
        zMovement('La cuerda de medir'),
        zMovement('El rollo volador y la canasta'),
        zMovement('Los carros recorren la tierra')
      ],
      questions:zechariahQuestions('Zacarías 1–6'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 1–6'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 1–6')
    },
    {
      number:3,
      title:'Josué purificado y el Renuevo que viene',
      scripture:'Zacarías 3',
      supporting:[],
      question:'¿Cómo restaura Dios un sacerdocio comprometido y anuncia una esperanza futura?',
      truth:'Dios reprende al acusador, quita las vestiduras sucias de Josué, renueva su responsabilidad y promete al Renuevo.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 3'),
      teaching:[
        zMovement('Josué delante del ángel'),
        zMovement('El acusador es reprendido'),
        zMovement('Un tizón rescatado del fuego'),
        zMovement('Las vestiduras son reemplazadas'),
        zMovement('La purificación restaura la responsabilidad'),
        zMovement('El Renuevo y la remoción del pecado')
      ],
      questions:zechariahQuestions('Zacarías 3'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 3'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 3')
    },
    {
      number:4,
      title:'No por la fuerza ni el poder, sino por mi Espíritu',
      scripture:'Zacarías 4',
      supporting:[],
      question:'¿Cómo puede una comunidad pequeña completar la obra de Dios sin depender de la dominación?',
      truth:'Dios provee su Espíritu, anima a Zorobabel y enseña que los comienzos fieles no deben ser despreciados.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 4'),
      teaching:[
        zMovement('Un candelabro abastecido de aceite'),
        zMovement('No por la fuerza','La obra de Dios no depende de la fuerza militar, el dominio político, la manipulación ni la celebridad. El Espíritu capacita para una obediencia fiel.'),
        zMovement('La gran montaña queda nivelada'),
        zMovement('Zorobabel terminará la obra'),
        zMovement('No desprecien los comienzos pequeños'),
        zMovement('Los dos ungidos')
      ],
      questions:zechariahQuestions('Zacarías 4'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 4'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 4')
    },
    {
      number:5,
      title:'Ayuno verdadero, justicia y las naciones',
      scripture:'Zacarías 7–8',
      supporting:[],
      question:'¿Qué convierte el ayuno religioso en verdadera fidelidad al pacto?',
      truth:'Dios llama a practicar justicia, misericordia, compasión y verdad comunitaria, y a una adoración gozosa que atrae a las naciones.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 7–8'),
      teaching:[
        zMovement('¿Realmente ayunaban para Dios?'),
        zMovement('El mensaje de los profetas anteriores'),
        zMovement('Practiquen la verdadera justicia'),
        zMovement('No opriman a las personas vulnerables'),
        zMovement('Ancianos y niños en calles seguras','La restauración también se mide por la seguridad pública y el sentido de pertenencia entre generaciones. Las comunidades deben proteger a los niños, a las personas mayores y a las personas con discapacidades.'),
        zMovement('Las naciones buscan al Señor')
      ],
      questions:zechariahQuestions('Zacarías 7–8'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 7–8'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 7–8')
    },
    {
      number:6,
      title:'El Rey humilde y aquel a quien traspasaron',
      scripture:'Zacarías 9; 12',
      supporting:[],
      question:'¿Cómo moldean la esperanza mesiánica el Rey humilde y la figura traspasada?',
      truth:'El Rey de Dios viene con humildad, pone fin a los instrumentos de guerra y abre un camino de duelo y purificación.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 9; 12'),
      teaching:[
        zMovement('Un Rey montado en un burro'),
        zMovement('Los caballos de guerra son eliminados'),
        zMovement('Paz para las naciones'),
        zMovement('Aquel a quien traspasaron','Los lectores cristianos ven su cumplimiento en Jesús, mientras el texto sigue formando parte de la esperanza profética de Israel. La interpretación nunca debe alimentar el antisemitismo.'),
        zMovement('Las familias hacen duelo'),
        zMovement('Una fuente queda abierta')
      ],
      questions:zechariahQuestions('Zacarías 9; 12'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 9; 12'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 9; 12')
    },
    {
      number:7,
      title:'El pastor, el rebaño y el liderazgo rechazado',
      scripture:'Zacarías 10–13',
      supporting:[],
      question:'¿Qué revelan las imágenes de pastores acerca del liderazgo fallido y del cuidado de Dios?',
      truth:'Dios se opone a los pastores explotadores, reúne al rebaño y deja al descubierto el costo de rechazar el liderazgo fiel.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 10–13'),
      teaching:[
        zMovement('Los ídolos domésticos engañan'),
        zMovement('Los pastores rinden cuentas'),
        zMovement('Dios visita a su rebaño'),
        zMovement('Treinta piezas de plata'),
        zMovement('Un pastor rechazado'),
        zMovement('Golpear al pastor')
      ],
      questions:zechariahQuestions('Zacarías 10–13'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 10–13'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 10–13')
    },
    {
      number:8,
      title:'El día del Señor y las aguas vivas',
      scripture:'Zacarías 14',
      supporting:[],
      question:'¿Cómo debe formar nuestra esperanza la visión final de Zacarías sobre el día del Señor sin llevarnos a especulaciones violentas?',
      truth:'Dios confronta el mal, llega a ser Rey sobre toda la tierra, hace fluir aguas vivas y convierte la vida cotidiana en algo santo.',
      goal:zechariahPurpose,
      opening:zechariahOpening,
      context:zechariahContext('Zacarías 14'),
      teaching:[
        zMovement('Una batalla apocalíptica severa','Las imágenes son violentas y simbólicas. El juicio pertenece a Dios y nunca autoriza a los creyentes a atacar al pueblo judío, a adversarios políticos ni a personas de otras religiones.'),
        zMovement('Dios se pone del lado de quienes están amenazados'),
        zMovement('Fluyen aguas vivas'),
        zMovement('El Señor es uno'),
        zMovement('Las naciones vienen a adorar'),
        zMovement('Todo es santo para el Señor')
      ],
      questions:zechariahQuestions('Zacarías 14'),
      examination:zechariahExamination,
      challenge:zechariahPractice('Zacarías 14'),
      caution:zechariahGuidance,
      prayer:zechariahPrayer('Zacarías 14')
    }
  ]
};
(function(){
  const s=window.NLDG_BOOK_STUDY;
  if(!s)return;
  Object.assign(s,{
    description:'Regreso, purificación, obra por el Espíritu, el Rey humilde y esperanza final',
    theme:'',
    background:'',
    seriesPurposeLabel:'Fundamento del estudio',
    purpose:'Zacarías anima a una comunidad posexílica mediante llamados a volver a Dios, visiones nocturnas simbólicas, purificación, reconstrucción del templo, instrucción ética, esperanza mesiánica, imágenes de pastores y visiones del reinado universal de Dios.',
    lessonPurposeLabel:'Propósito',
    openingLabel:'Inicio',
    mainPassageLabel:'Escritura principal',
    supportingScriptureLabel:'Escrituras de apoyo',
    scriptureContextLabel:'Contexto bíblico',
    keyTruthLabel:'Verdad clave',
    lessonQuestionLabel:'Pregunta central',
    lessonFoundationLabel:'Fundamento del estudio',
    lessonTeachingLabel:'Movimientos de enseñanza',
    discussionQuestionsLabel:'Preguntas para conversar',
    personalExaminationLabel:'Examen personal',
    personalExaminationTitle:'',
    weeklyPracticeLabel:'Práctica semanal',
    weeklyPracticeTitle:'',
    leaderGuidanceLabel:'Guía para líderes',
    closingPrayerLabel:'Oración final',
    seriesGuideBlocks:[
      {title:'Propósito de la serie',text:'Esta serie de ocho lecciones ayuda a los grupos a leer Zacarías en contexto, enfrentar con honestidad las imágenes difíciles y practicar adoración, justicia, arrepentimiento, liderazgo responsable, misericordia y esperanza.'},
      {title:'Compromisos de interpretación',text:'Trata los símbolos apocalípticos con humildad. No identifiques cada figura con políticos actuales, no predigas fechas, no señales al pueblo judío ni justifiques la violencia. Honra el contexto judío posexílico de Zacarías y el cumplimiento mesiánico cristiano sin desprecio de reemplazo, teorías de conspiración ni interpretaciones partidistas.'},
      {title:'Mapa de lecciones',items:[
        '1. Vuélvanse a mí — Zacarías 1',
        '2. Visiones nocturnas y presencia restauradora — Zacarías 1–6',
        '3. Josué purificado y el Renuevo que viene — Zacarías 3',
        '4. No por la fuerza, sino por mi Espíritu — Zacarías 4',
        '5. Ayuno verdadero, justicia y las naciones — Zacarías 7–8',
        '6. El Rey humilde y aquel a quien traspasaron — Zacarías 9; 12',
        '7. El pastor, el rebaño y el liderazgo rechazado — Zacarías 10–13',
        '8. El día del Señor y las aguas vivas — Zacarías 14'
      ]},
      {title:'Ritmo recomendado',text:'Reserva de 60 a 75 minutos. Ora, lee el pasaje, repasa su contexto histórico y literario, conversa sobre los seis movimientos y elige las preguntas apropiadas para el grupo. Termina con una práctica semanal y oración.'},
      {title:'Protecciones para facilitadores',text:'Trata los símbolos apocalípticos con humildad. No identifiques cada figura con políticos actuales, no predigas fechas, no señales al pueblo judío ni justifiques la violencia. Honra el contexto judío posexílico de Zacarías y el cumplimiento mesiánico cristiano sin desprecio de reemplazo, teorías de conspiración ni interpretaciones partidistas. Los participantes pueden omitir preguntas. Cuando sea necesario, combina el cuidado pastoral con ayuda médica, de salud mental, legal, financiera, de vivienda y de protección de personas vulnerables.'},
      {title:'Cómo leer juntos',text:'Observa la visión, la poesía, la metáfora, la acción simbólica, la audiencia histórica y las conexiones dentro del canon bíblico. Expón con humildad las interpretaciones discutidas y nunca conviertas un juicio antiguo en permiso moderno para hacer daño.'},
      {title:'Oración final',text:'Dios santo y misericordioso, danos ojos para ver tu gloria, valor para arrepentirnos, compasión por las personas vulnerables y esperanza arraigada en tu presencia fiel. Amén.'}
    ]
  });
})();
