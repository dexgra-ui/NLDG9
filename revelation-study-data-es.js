const revelationOpening='Comienza con una breve oración pidiendo sabiduría. Invita a los participantes a nombrar una palabra o imagen del pasaje que les haya quedado presente. Nadie debe sentirse obligado a revelar trauma, enfermedad, experiencias políticas o historia familiar. Escucha sin apresurarte a resolver la historia de otra persona.';
const revelationQuestionsTail=[
 '¿Qué revela este pasaje acerca del carácter y los propósitos de Dios?',
 '¿Dónde ves fidelidad, temor, compromiso o valentía en las personas descritas?',
 '¿Qué símbolo, acción o afirmación necesita contexto cuidadoso antes de aplicarse?',
 '¿Cómo desafía este pasaje la manera en que las comunidades usan el poder?',
 '¿Qué consuelo o corrección podría ofrecer este texto a alguien bajo presión?',
 '¿Qué interpretación dañina debe evitar un lector responsable?',
 '¿Qué respuesta concreta de adoración, justicia, misericordia o perseverancia practicarás esta semana?'
];
const revelationExamination='¿Dónde siento la tentación de buscar control, reputación, riqueza, certeza o represalia en vez de confiar en Dios? ¿Dónde podrían mis suposiciones pasar por alto a una persona vulnerable? Pide al Espíritu una convicción específica y un próximo paso lleno de gracia. El examen personal debe conducir al arrepentimiento y la restauración, no a la vergüenza ni al castigo propio.';
const revelationPractice=passage=>`Lee ${passage} una vez más esta semana. Escribe una oración acerca de Dios, una advertencia que debas recibir y una promesa o esperanza que quieras llevar contigo. Luego elige una acción práctica: anima a alguien, repara un daño, comparte recursos, busca rendición de cuentas, apoya la seguridad de una persona o intercede con constancia por una comunidad bajo presión.`;
const revelationLeaderGuidance='Mantén al Cordero, la adoración, el testimonio y la nueva creación en el centro. No premies la fijación de fechas, las teorías conspirativas, la identificación partidista, el antisemitismo, el señalamiento étnico ni el miedo relacionado con vacunas, microchips o tecnología ordinaria. Reconoce con humildad las diferencias interpretativas fieles. El juicio pertenece a Dios y nunca autoriza la violencia cristiana. Si la conversación produce ansiedad severa, reduce el ritmo, vuelve al texto y anima a buscar apoyo pastoral o de salud mental apropiado.';
const revelationPrayer=passage=>`Dios santo, encuéntranos en ${passage}. Líbranos de la adoración falsa y de la autoprotección. Danos valentía para decir la verdad, misericordia hacia las personas vulnerables, humildad ante palabras difíciles y esperanza arraigada en tu fidelidad. Forma nuestra vida según tus caminos y ayúdanos a practicar lo aprendido. Amén.`;

window.NLDG_BOOK_STUDY={
 slug:'apocalipsis-estudio',
 book:'Apocalipsis',
 title:'APOCALIPSIS — TESTIMONIO FIEL, VICTORIA DEL CORDERO Y NUEVA CREACIÓN',
 description:'Serie de estudio bíblico libro por libro',
 themeLabel:'FUNDAMENTO DEL ESTUDIO',
 theme:'Apocalipsis es a la vez literatura apocalíptica, profecía y carta pastoral dirigida a siete iglesias reales bajo presión imperial. Sus visiones llenas de símbolos hacen eco del Antiguo Testamento y mantienen en el centro al Cordero inmolado y resucitado. Esta serie lee el libro para formar adoración, perseverancia, discernimiento y esperanza, no para fijar fechas, alimentar especulación basada en miedo, descifrar partidos políticos ni identificar con seguridad a personas modernas como villanos proféticos.',
 audience:'Adultos, grupos pequeños, escuela dominical, equipos de ministerio y estudio personal.',
 scriptureStandard:'Nueva Traducción Viviente (NTV)',
 seriesPurposeLabel:'PROPÓSITO DE LA SERIE',
 seriesOverviewParagraphs:[
  'Esta serie de ocho lecciones ayuda a leer Apocalipsis en su contexto literario e histórico, encontrarse honestamente con Dios en pasajes difíciles y practicar un discipulado fiel. Cada lección combina lectura cuidadosa, reflexión teológica, conversación, examen personal, práctica semanal, orientación para líderes y oración.'
 ],
 seriesGuideBlocks:[
  {
   title:'COMPROMISOS INTERPRETATIVOS',
   text:'Lee los símbolos a la luz de sus ecos bíblicos y de su contexto del primer siglo. Mantén a Jesús, el Cordero, en el centro. Trata con humildad las cronologías debatidas y las distintas posturas sobre el milenio. Rechaza el antisemitismo, el señalamiento étnico, las afirmaciones conspirativas, el pánico tecnológico y cualquier uso de estas visiones para justificar violencia cristiana.'
  },
  {
   title:'MAPA DE LA SERIE',
   items:[
    '1. El Cristo resucitado entre sus iglesias — Apocalipsis 1–2',
    '2. Despierta y adora al que está en el trono — Apocalipsis 3–4',
    '3. El Cordero abre los sellos — Apocalipsis 5–7',
    '4. Trompetas, testimonio y el reino de Dios — Apocalipsis 8–11',
    '5. El dragón, las bestias y el Cordero fiel — Apocalipsis 12–14',
    '6. Las copas, Babilonia y la caída del imperio — Apocalipsis 15–18',
    '7. El Jinete, el juicio final y la derrota del mal — Apocalipsis 19–20',
    '8. Nueva creación y el río de vida — Apocalipsis 21–22'
   ]
  }
 ],
 postLessonMapGuideBlocks:[
  {
   title:'RITMO RECOMENDADO',
   text:'Planifica 60–75 minutos. Comienza con oración y el pasaje principal, resume el contexto, recorre los movimientos de enseñanza y elige las preguntas apropiadas para el grupo. Termina con una práctica semanal realista y la oración final. Cualquier participante puede decidir no responder una pregunta.'
  },
  {
   title:'SALVAGUARDAS PARA FACILITADORES',
   text:'Evita gráficos sensacionalistas y afirmaciones de que las noticias actuales prueban un calendario privado. Nunca llames bestia o marca a un participante, oponente político, nación, grupo étnico, denominación, vacuna, microchip o tecnología ordinaria. Toma el miedo en serio, recibe preguntas interpretativas y dirige a las personas hacia una esperanza centrada en Cristo y un cuidado responsable.'
  },
  {
   title:'CÓMO USAR LAS REFERENCIAS BÍBLICAS',
   text:'Lee el pasaje asignado en una traducción confiable. Compara los párrafos cercanos antes de sacar conclusiones. Cuando las tradiciones difieran, afirma el centro cristiano compartido y describe las alternativas sin ridiculizarlas. Anima a los participantes a verificar las afirmaciones en el texto.'
  }
 ],
 seriesPrayerLabel:'ORACIÓN FINAL DE LA SERIE',
 seriesPrayer:'Dios de verdad y misericordia, guíanos por Apocalipsis. Corrige nuestras lealtades falsas, protege a las personas vulnerables, forma en nosotros una adoración sincera y danos valentía para seguirte con humildad. Mantén a Jesús en el centro de nuestro aprendizaje y haz que este estudio produzca amor. Amén.',
 lessonFoundationLabel:'FUNDAMENTO DEL ESTUDIO',
 lessonPurposeLabel:'PROPÓSITO',
 openingLabel:'APERTURA',
 mainPassageLabel:'PASAJE PRINCIPAL',
 supportingScriptureLabel:'ESCRITURAS DE APOYO',
 scriptureContextLabel:'CONTEXTO BÍBLICO',
 keyTruthLabel:'VERDAD CLAVE',
 lessonQuestionLabel:'PREGUNTA CENTRAL',
 lessonTeachingLabel:'MOVIMIENTOS DE ENSEÑANZA',
 discussionQuestionsLabel:'PREGUNTAS PARA CONVERSAR',
 personalExaminationLabel:'EXAMEN PERSONAL',
 personalExaminationTitle:'',
 weeklyPracticeLabel:'PRÁCTICA SEMANAL',
 weeklyPracticeTitle:'',
 leaderGuidanceLabel:'GUÍA PARA LÍDERES',
 closingPrayerLabel:'ORACIÓN FINAL',
 lessons:[
  {
   number:1,
   title:'El Cristo resucitado entre sus iglesias',
   scripture:'Apocalipsis 1–2',
   supporting:[],
   question:'¿Qué dice el Jesús resucitado a iglesias que viven bajo presión?',
   truth:'Jesús camina entre sus iglesias, conoce su fidelidad y sus fallas, y las llama a perseverar en amor.',
   goal:'Esta lección ayuda a leer Apocalipsis 1–2 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 1–2 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'Apocalipsis, profecía y carta',body:'Apocalipsis revela la realidad, comunica la palabra de Dios y se dirige a siete iglesias reales de Asia Menor. Sus símbolos dependen ampliamente del Antiguo Testamento. Lo leemos primero como verdad pastoral para comunidades que adoran, no como un código secreto para los titulares.'},
    {heading:'Jesús está en el centro',body:'El majestuoso Hijo del Hombre es también quien estuvo muerto y ahora vive. La autoridad pertenece al Cristo crucificado y resucitado. El miedo encuentra respuesta en su presencia y victoria, no en el control humano.'},
    {heading:'Éfeso: verdad sin el primer amor',body:'La iglesia examina a falsos maestros y persevera, pero ha abandonado su primer amor. El discernimiento y la devoción deben permanecer unidos. La doctrina correcta sin amor por Cristo y el prójimo queda vacía.'},
    {heading:'Esmirna: fidelidad en medio del sufrimiento',body:'Jesús conoce la pobreza y la calumnia y llama a la fidelidad. Esto no exige que nadie permanezca en abuso prevenible. Las iglesias deben ayudar a las personas en peligro a buscar seguridad mientras resisten la coerción y la desesperanza.'},
    {heading:'Pérgamo: resistencia y compromiso',body:'La iglesia conserva el nombre de Cristo donde el poder imperial es intenso, pero tolera enseñanzas que comprometen la adoración y la ética. La valentía pública no reemplaza la santidad privada.'},
    {heading:'Tiatira y el lenguaje responsable',body:'El nombre simbólico “Jezabel” señala una influencia de enseñanza destructiva en esa iglesia específica. Nunca debe convertirse en un insulto contra las mujeres ni en una manera de avergonzarlas. Jesús confronta la explotación y llama al arrepentimiento.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 1–2 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 1–2'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 1–2')
  },
  {
   number:2,
   title:'Despierta y adora al que está en el trono',
   scripture:'Apocalipsis 3–4',
   supporting:[],
   question:'¿Cómo despierta la adoración celestial a iglesias complacientes?',
   truth:'El Creador santo merece lealtad total, expone la autosuficiencia y renueva un testimonio fiel.',
   goal:'Esta lección ayuda a leer Apocalipsis 3–4 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 3–4 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'Sardis: la reputación no es vida',body:'Sardis tiene fama de estar viva, pero está dormida espiritualmente. Jesús llama a recordar, obedecer y arrepentirse. La reputación, la asistencia y la actividad no sustituyen una fe viva.'},
    {heading:'Filadelfia: una puerta abierta para los fieles',body:'Una iglesia con poco poder guarda la palabra de Jesús. Su debilidad no es fracaso. La promesa de Cristo dignifica a comunidades perseverantes sin convertir la influencia o el crecimiento en la medida de fidelidad.'},
    {heading:'Laodicea: autosuficiencia complaciente',body:'Laodicea afirma ser rica y no necesitar nada, pero no ve su condición. El punto no es que Dios prefiera a las personas espiritualmente frías; la reprensión confronta complacencia y falsa seguridad. Cristo ofrece corrección, comunión y visión restaurada.'},
    {heading:'La puerta abierta en el cielo',body:'Juan ve un trono antes de recibir explicación de todo el caos. La adoración reorganiza la perspectiva: ni el imperio ni la crisis tienen la última palabra. El gobierno de Dios no es pánico ni tiranía; es santo, vivo y digno.'},
    {heading:'La creación se une a la alabanza',body:'Los seres vivientes y los ancianos alaban al Creador de todas las cosas. La adoración resiste la idolatría al devolver a Dios el valor supremo. Los seres humanos somos criaturas y mayordomos, no dueños de otras personas ni de la creación.'},
    {heading:'Coronas puestas a sus pies',body:'Los ancianos entregan ante Dios los símbolos de honor. El liderazgo maduro suelta el estatus en vez de protegerlo. La autoridad se convierte en servicio adorador y responsable ante el que está en el trono.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 3–4 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 3–4'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 3–4')
  },
  {
   number:3,
   title:'El Cordero abre los sellos',
   scripture:'Apocalipsis 5–7',
   supporting:[],
   question:'¿Por qué es digno el Cordero inmolado de abrir la historia y juzgar el mal?',
   truth:'Jesús vence mediante fidelidad sacrificial, reúne un pueblo incontable y sostiene a quienes sufren en la presencia de Dios.',
   goal:'Esta lección ayuda a leer Apocalipsis 5–7 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 5–7 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'El Cordero digno',body:'Juan oye hablar de un León y ve de pie a un Cordero inmolado. Apocalipsis redefine la victoria mediante la muerte sacrificial y la resurrección de Jesús. Por eso el poder cristiano debe parecerse al testimonio fiel, no a la dominación.'},
    {heading:'Un cántico nuevo para todos los pueblos',body:'El Cordero reúne personas de toda tribu, lengua, pueblo y nación. La visión rechaza la supremacía étnica y crea un reino que adora sin borrar su diversidad.'},
    {heading:'Los sellos exponen la violencia humana',body:'Conquista, guerra, escasez y muerte revelan sistemas devastadores que afligen la creación. Los jinetes no son entretenimiento ni herramientas para identificar políticos actuales. La iglesia responde con perseverancia, misericordia y verdad.'},
    {heading:'Los mártires claman por justicia',body:'Los testigos asesinados preguntan hasta cuándo. La Escritura da lenguaje a quienes han sido heridos para pedir justicia sin tomar la venganza en sus propias manos. El lamento es habla fiel, no falta de confianza.'},
    {heading:'Sellados antes de la tormenta',body:'Los 144,000 aparecen con imágenes de las tribus de Israel. Los cristianos interpretan el número y el grupo de maneras distintas. Debemos sostener esas diferencias con humildad y afirmar el centro compartido: Dios conoce y guarda a su pueblo.'},
    {heading:'Una multitud que nadie puede contar',body:'La visión se amplía a una multitud internacional delante del Cordero. Sus vestiduras son limpiadas por gracia y Dios enjuga sus lágrimas. El sufrimiento no se ignora ni se hace permanente; la adoración apunta a refugio, provisión y sanidad.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 5–7 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 5–7'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 5–7')
  },
  {
   number:4,
   title:'Trompetas, testimonio y el reino de Dios',
   scripture:'Apocalipsis 8–11',
   supporting:[],
   question:'¿Cómo llama Dios a la iglesia a dar testimonio mientras el juicio expone a un mundo rebelde?',
   truth:'La oración importa, el juicio advierte y el testimonio fiel señala el reino de Dios sin copiar la violencia del mundo.',
   goal:'Esta lección ayuda a leer Apocalipsis 8–11 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 8–11 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'Silencio y las oraciones de los santos',body:'El cielo guarda silencio y las oraciones suben delante de Dios. La espera dignifica el lamento y la dependencia. La oración no es escape de la acción; confía la justicia a Dios y prepara un servicio fiel.'},
    {heading:'Las trompetas como advertencias misericordiosas',body:'Los juicios de las trompetas hacen eco de las plagas de Egipto y afectan porciones, no la totalidad. Advierten a un mundo entregado a la destrucción. No debemos asociar cada imagen con un desastre moderno ni explotar el miedo para controlar.'},
    {heading:'El rollo dulce y amargo',body:'Juan come el rollo: la palabra de Dios es dulce por su verdad y amarga por el costo de su mensaje. La enseñanza fiel no persigue solamente temas agradables ni disfruta anunciando juicio.'},
    {heading:'Medidos y guardados',body:'La medición de Dios comunica pertenencia y protección en medio de la vulnerabilidad. Protección no significa que los creyentes evitarán todo sufrimiento. Significa que su identidad y futuro final permanecen en las manos de Dios.'},
    {heading:'Los dos testigos',body:'Los testigos encarnan un testimonio empoderado por el Espíritu en una ciudad hostil. Las interpretaciones sobre su identidad difieren. Su llamado se centra en verdad pública, fidelidad costosa y vindicación de Dios, no en resistencia religiosa armada.'},
    {heading:'El reino es anunciado',body:'La séptima trompeta declara que el reino del mundo pertenece a Dios y a su Cristo. Esta esperanza desafía a todo imperio y partido que reclama lealtad absoluta. El reino de Dios trae juicio, recompensa y renovación de la creación.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 8–11 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 8–11'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 8–11')
  },
  {
   number:5,
   title:'El dragón, las bestias y el Cordero fiel',
   scripture:'Apocalipsis 12–14',
   supporting:[],
   question:'¿Cómo pueden los creyentes discernir el poder engañoso y permanecer leales al Cordero?',
   truth:'El mal imita la autoridad y busca forzar lealtad, pero el Cordero forma un pueblo veraz, paciente y adorador.',
   goal:'Esta lección ayuda a leer Apocalipsis 12–14 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 12–14 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'La mujer, el niño y el dragón',body:'El drama simbólico reúne a Israel, al Mesías y al pueblo de Dios en un conflicto cósmico. Nunca debe usarse para demonizar a mujeres ni a un grupo étnico moderno. El dragón se opone al propósito salvador de Dios.'},
    {heading:'Victoria por medio del testimonio',body:'El acusador es vencido por la obra del Cordero y el testimonio fiel. Esto no ordena buscar daño ni permanecer en abuso. El testimonio cristiano valora la vida mientras se niega a negar a Cristo bajo coerción.'},
    {heading:'La bestia que sube del mar',body:'La bestia encarna poder imperial blasfemo y hace eco de los reinos de Daniel. Los lectores deben resistir sistemas autoritarios sin llamar casualmente “la bestia” a sus oponentes actuales. El discernimiento simbólico exige humildad.'},
    {heading:'La bestia que sube de la tierra',body:'La propaganda religiosa hace que la dominación parezca sagrada. La adoración falsa a menudo sirve al poder político y económico. Las iglesias necesitan liderazgo transparente y libertad para examinar afirmaciones.'},
    {heading:'La marca y la lealtad',body:'La marca identifica una lealtad expresada mediante adoración y conformidad económica. El texto no justifica afirmaciones seguras acerca de vacunas, microchips o tecnología ordinaria. La pregunta urgente es a quién sirven nuestras vidas.'},
    {heading:'El pueblo fiel del Cordero',body:'Los 144,000 están con el Cordero y se caracterizan por una lealtad fiel. Los detalles se interpretan de manera distinta entre tradiciones cristianas. El llamado compartido es perseverancia paciente, habla veraz y adoración al Creador.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 12–14 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 12–14'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 12–14')
  },
  {
   number:6,
   title:'Las copas, Babilonia y la caída del imperio',
   scripture:'Apocalipsis 15–18',
   supporting:[],
   question:'¿Qué revela Babilonia acerca de la riqueza seductora, la explotación y la justicia de Dios?',
   truth:'Dios juzga sistemas que obtienen ganancias de la violencia y de vidas humanas, y llama a su pueblo a separarse de sus pecados mientras lamenta con esperanza.',
   goal:'Esta lección ayuda a leer Apocalipsis 15–18 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 15–18 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'El cántico junto al mar',body:'Los vencedores alaban a Dios con imágenes del éxodo. La liberación pertenece a Dios y todas las naciones son invitadas a adorar. El cántico no debe convertirse en nacionalismo; celebra los caminos justos de Dios por encima de todo imperio.'},
    {heading:'Las copas y la seriedad moral',body:'Las copas representan juicio completo contra una rebelión endurecida. Las imágenes son severas y no deben usarse para aterrorizar a personas vulnerables hasta someterlas. Llaman al arrepentimiento y a confiar en la justicia de Dios.'},
    {heading:'La seducción de Babilonia',body:'Babilonia simboliza una ciudad-mundo rica y violenta opuesta a Dios. No puede reducirse con seguridad a una sola nación actual, grupo étnico o denominación. Su patrón aparece donde el lujo depende de la dominación.'},
    {heading:'Mercaderes y vidas humanas como mercancía',body:'La lista de comercio culmina en vidas humanas. Los sistemas económicos se vuelven idolátricos cuando la ganancia oculta explotación. El discipulado cristiano pregunta quién paga el costo de nuestro consumo y apoya prácticas justas y humanas.'},
    {heading:'Salgan de ella',body:'Separarse de Babilonia significa rechazar sus pecados y lealtades, no retirarse del amor al prójimo. Los creyentes pueden participar en la vida pública sin bendecir codicia, crueldad ni propaganda.'},
    {heading:'Lamento sin nostalgia',body:'Reyes y mercaderes lloran la pérdida de ganancias mientras el cielo celebra la justicia. El lamento fiel llora por quienes sufren durante el colapso sin añorar una prosperidad explotadora. Justicia y compasión permanecen unidas.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 15–18 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 15–18'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 15–18')
  },
  {
   number:7,
   title:'El Jinete, el juicio final y la derrota del mal',
   scripture:'Apocalipsis 19–20',
   supporting:[],
   question:'¿Cómo derrota finalmente Cristo al mal y establece justicia?',
   truth:'El Cristo fiel y verdadero juzga el mal, mientras la venganza permanece exclusivamente en sus manos y el futuro final pertenece a Dios.',
   goal:'Esta lección ayuda a leer Apocalipsis 19–20 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 19–20 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'La cena de bodas',body:'El cielo se alegra porque la justicia de Dios ha expuesto a Babilonia y el Cordero recibe a su novia. La celebración se centra en fidelidad al pacto, no en disfrutar del sufrimiento. La adoración debe conservar ternura hacia las víctimas.'},
    {heading:'El Jinete fiel y verdadero',body:'Cristo cabalga para juzgar con justicia y su ropa aparece marcada con sangre antes de describirse la batalla, señalando primero su propio sacrificio. La imagen no autoriza guerra cristiana ni represalia.'},
    {heading:'La derrota de las bestias',body:'Los poderes políticos y religiosos engañosos caen. Su final asegura a comunidades oprimidas que la tiranía es temporal. Los cristianos resisten el mal mediante verdad, perseverancia, servicio y una lealtad que no idolatra.'},
    {heading:'El milenio y la humildad',body:'Cristianos fieles entienden los mil años de varias maneras. Son comunes las lecturas premilenial, amilenial y posmilenial. El centro compartido del pasaje es la victoria de Cristo y el poder limitado y condenado de Satanás.'},
    {heading:'El gran trono blanco',body:'Todos comparecen ante Dios y el juicio se realiza según la verdad. La escena afirma seriedad moral y justicia divina. No debe usarse como amenaza para controlar a las personas ni para reclamar certeza sobre el destino eterno de individuos específicos.'},
    {heading:'La muerte es derribada',body:'La muerte y el Hades terminan en el lago de fuego. El enemigo final de Dios no es un grupo humano, sino la muerte y el mal. La esperanza descansa en que Dios derrota todo lo que destruye su creación.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 19–20 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 19–20'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 19–20')
  },
  {
   number:8,
   title:'Nueva creación y el río de vida',
   scripture:'Apocalipsis 21–22',
   supporting:[],
   question:'¿Qué futuro prepara el Cordero para la creación de Dios?',
   truth:'Dios habitará con su pueblo, terminará con la muerte y el lamento, sanará a las naciones y hará nuevas todas las cosas.',
   goal:'Esta lección ayuda a leer Apocalipsis 21–22 dentro del mensaje más amplio del libro, reconocer tanto la gracia como la advertencia y responder con verdad, humildad, compasión y adoración fiel.',
   opening:revelationOpening,
   context:'Lee Apocalipsis 21–22 en secciones manejables. Observa palabras repetidas, cambios de escena, voces y conexiones con Escrituras anteriores. Pregunta primero qué podía reconocer la audiencia original antes de pasar a una aplicación moderna. Las imágenes difíciles deben interpretarse desde el contexto literario y del pacto, no separarse como consignas.',
   teaching:[
    {heading:'Una creación renovada',body:'Juan ve cielo nuevo y tierra nueva, no almas escapando hacia una existencia permanentemente sin cuerpo. La esperanza bíblica es corporal, comunitaria y cósmica. Cuidar hoy los cuerpos, al prójimo y la creación anticipa la renovación de Dios.'},
    {heading:'Dios habita con la humanidad',body:'La gran promesa es que Dios habita con su pueblo. Cada lágrima es vista y la muerte, el lamento, el llanto y el dolor terminarán. Esta esperanza consuela el duelo sin apresurar a las personas para que dejen de lamentar.'},
    {heading:'La ciudad santa como pueblo',body:'La ciudad es también la novia y lleva imágenes de las tribus de Israel y de los apóstoles. Esto une la historia del pacto de Dios y nunca debe alimentar antisemitismo. El pueblo de Dios está seguro, hermoso y abierto a las naciones.'},
    {heading:'Sin templo y sin noche',body:'Dios y el Cordero son el templo y la luz de la ciudad. Nada manipulador u oculto permanece. Las comunidades que anticipan ese futuro practican desde ahora transparencia, seguridad y adoración verdadera.'},
    {heading:'El río y el árbol de vida',body:'La vida fluye del trono de Dios y las hojas del árbol son para la sanidad de las naciones. La diversidad no es borrada; las naciones son sanadas de hostilidad y explotación.'},
    {heading:'Ven, Señor Jesús',body:'El libro termina con invitación, advertencia y anhelo. No calculamos fechas ni fabricamos pánico. Damos testimonio, ofrecemos gratuitamente el agua de vida y vivimos preparados mediante un amor fiel.'}
   ],
   questions:['¿Qué detalle de Apocalipsis 21–22 llama primero tu atención y por qué?',...revelationQuestionsTail],
   examination:revelationExamination,
   challenge:revelationPractice('Apocalipsis 21–22'),
   caution:revelationLeaderGuidance,
   prayer:revelationPrayer('Apocalipsis 21–22')
  }
 ]
};
