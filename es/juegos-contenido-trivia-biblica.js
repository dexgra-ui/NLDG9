(()=>{
const prompts={
"This man interpreted Pharaoh’s dreams and later governed Egypt.":"Este hombre interpretó los sueños del faraón y más tarde gobernó en Egipto.",
"This Gospel begins by calling Jesus the Word.":"Este Evangelio comienza llamando a Jesús «la Palabra».",
"This woman became queen of Persia and risked her life for her people.":"Esta mujer llegó a ser reina de Persia y arriesgó su vida por su pueblo.",
"This person the first man.":"Esta persona fue el primer hombre.",
"This person the first woman.":"Esta persona fue la primera mujer.",
"This person built the ark.":"Esta persona construyó el arca.",
"This person was called the father of many nations.":"Esta persona fue llamada padre de muchas naciones.",
"This person gave birth to Isaac in old age.":"Esta persona dio a luz a Isaac en su vejez.",
"This person was the promised son of Abraham and Sarah.":"Esta persona fue el hijo prometido de Abraham y Sara.",
"This person was renamed Israel.":"Esta persona recibió el nombre de Israel.",
"This person interpreted Pharaoh’s dreams.":"Esta persona interpretó los sueños del faraón.",
"This person led Israel out of Egypt.":"Esta persona guió a Israel fuera de Egipto.",
"This person served as Israel’s first high priest.":"Esta persona sirvió como el primer sumo sacerdote de Israel.",
"This person watched over infant Moses and later led worship.":"Esta persona cuidó de Moisés cuando era bebé y más tarde dirigió la adoración.",
"This person led Israel into the promised land.":"Esta persona guió a Israel a la tierra prometida.",
"This person hid the spies in Jericho.":"Esta persona escondió a los espías en Jericó.",
"This person judged Israel under a palm tree.":"Esta persona juzgó a Israel bajo una palmera.",
"This person defeated Midian with three hundred men.":"Esta persona derrotó a Madián con trescientos hombres.",
"This person was known for extraordinary strength.":"Esta persona fue conocida por su fuerza extraordinaria.",
"This person pledged loyalty to Naomi.":"Esta persona prometió lealtad a Noemí.",
"This person served as Ruth’s kinsman-redeemer.":"Esta persona sirvió como pariente-redentor de Rut.",
"This person prayed for a son and dedicated Samuel to God.":"Esta persona oró por un hijo y dedicó a Samuel a Dios.",
"This person anointed both Saul and David.":"Esta persona ungió tanto a Saúl como a David.",
"This person was Israel’s first king.":"Esta persona fue el primer rey de Israel.",
"This person defeated Goliath and became king.":"Esta persona derrotó a Goliat y llegó a ser rey.",
"This person was David’s loyal friend.":"Esta persona fue un amigo leal de David.",
"This person asked God for wisdom.":"Esta persona le pidió sabiduría a Dios.",
"This person called down fire on Mount Carmel.":"Esta persona hizo descender fuego en el monte Carmelo.",
"This person received a double portion of Elijah’s spirit.":"Esta persona recibió una doble porción del espíritu de Elías.",
"This person prayed when Jerusalem was threatened by Assyria.":"Esta persona oró cuando Jerusalén fue amenazada por Asiria.",
"This person found the Book of the Law and led reform.":"Esta persona dirigió reformas después de escuchar el Libro de la Ley.",
"This person was a scribe devoted to God’s law.":"Esta persona fue un escriba dedicado a la ley de Dios.",
"This person rebuilt Jerusalem’s walls.":"Esta persona reconstruyó las murallas de Jerusalén.",
"This person risked her life before the Persian king.":"Esta persona arriesgó su vida ante el rey persa.",
"This person raised Esther and exposed a plot against the king.":"Esta persona crió a Ester y descubrió una conspiración contra el rey.",
"This person remained faithful through severe suffering.":"Esta persona permaneció fiel en medio de un sufrimiento intenso.",
"This person saw the Lord in the temple.":"Esta persona vio al Señor en el templo.",
"This person was called the weeping prophet.":"Esta persona es conocida tradicionalmente como el profeta llorón.",
"This person saw the valley of dry bones.":"Esta persona vio el valle de huesos secos.",
"This person survived the lions’ den.":"Esta persona sobrevivió al foso de los leones.",
"This person was thrown into a fiery furnace with two friends.":"Esta persona fue arrojada a un horno de fuego junto con dos amigos.",
"This person used his marriage as a picture of covenant faithfulness.":"Esta persona vivió un matrimonio que sirvió como imagen profética de la fidelidad al pacto.",
"This person was sent to preach to Nineveh.":"Esta persona fue enviada a predicar a Nínive.",
"This person prepared the way for Jesus.":"Esta persona preparó el camino para Jesús.",
"This person was the mother of Jesus.":"Esta persona fue la madre de Jesús.",
"This person was Jesus’ earthly guardian.":"Esta persona fue el padre terrenal que cuidó de Jesús.",
"This person confessed Jesus as the Messiah.":"Esta persona confesó que Jesús es el Mesías.",
"This person brought his brother Peter to Jesus.":"Esta persona llevó a su hermano Pedro a Jesús.",
"This person was the brother of John and son of Zebedee.":"Esta persona fue hermano de Juan e hijo de Zebedeo.",
"This person was called the disciple Jesus loved.":"Esta persona es identificada tradicionalmente como el discípulo a quien Jesús amaba.",
"This person left tax collecting to follow Jesus.":"Esta persona dejó la recaudación de impuestos para seguir a Jesús.",
"This person wanted evidence of the resurrection.":"Esta persona quiso ver evidencia de la resurrección.",
"This person served Jesus and confessed faith in the resurrection.":"Esta persona sirvió a Jesús y confesó su fe en la resurrección.",
"This person anointed Jesus with costly perfume.":"Esta persona ungió a Jesús con un perfume costoso.",
"This person was raised after four days in the tomb.":"Esta persona fue resucitada después de cuatro días en la tumba.",
"This person climbed a sycamore tree to see Jesus.":"Esta persona subió a un sicómoro para ver a Jesús.",
"This person announced the risen Christ to the disciples.":"Esta persona anunció a los discípulos que Cristo había resucitado.",
"This person was martyred after testifying before the council.":"Esta persona fue martirizada después de dar testimonio ante el concilio.",
"This person explained Isaiah to an Ethiopian official.":"Esta persona explicó Isaías a un funcionario etíope.",
"This person was known as a son of encouragement.":"Esta persona fue conocida como hijo de consolación o ánimo.",
"This person carried the gospel to many Gentile cities.":"Esta persona llevó el evangelio a muchas ciudades gentiles.",
"This person sang hymns with Paul in prison.":"Esta persona cantó himnos con Pablo en la cárcel.",
"This person sold purple cloth and welcomed Paul’s team.":"Esta persona vendía tela púrpura y recibió al equipo de Pablo.",
"Who built the ark?":"¿Quién construyó el arca?",
"This city’s walls fell after Israel marched around it.":"Las murallas de esta ciudad cayeron después de que Israel marchó a su alrededor.",
"This book opens with creation.":"Este libro comienza con la creación.",
"Jesus called this the greatest commandment.":"Jesús llamó a esto el mandamiento más importante.",
"The Holy Spirit came upon believers during this feast.":"El Espíritu Santo vino sobre los creyentes durante esta fiesta."
};
const names={
'Adam':'Adán','Eve':'Eva','Noah':'Noé','Abraham':'Abraham','Sarah':'Sara','Isaac':'Isaac','Jacob':'Jacob','Joseph':'José','Moses':'Moisés','Aaron':'Aarón','Miriam':'Miriam','Joshua':'Josué','Rahab':'Rahab','Deborah':'Débora','Gideon':'Gedeón','Samson':'Sansón','Ruth':'Rut','Boaz':'Booz','Hannah':'Ana','Samuel':'Samuel','Saul':'Saúl','David':'David','Jonathan':'Jonatán','Solomon':'Salomón','Elijah':'Elías','Elisha':'Eliseo','Hezekiah':'Ezequías','Josiah':'Josías','Ezra':'Esdras','Nehemiah':'Nehemías','Esther':'Ester','Mordecai':'Mardoqueo','Job':'Job','Isaiah':'Isaías','Jeremiah':'Jeremías','Ezekiel':'Ezequiel','Daniel':'Daniel','Shadrach':'Sadrac','Hosea':'Oseas','Jonah':'Jonás','John the Baptist':'Juan el Bautista','Mary':'María','Joseph of Nazareth':'José de Nazaret','Peter':'Pedro','Andrew':'Andrés','James':'Santiago','John':'Juan','Matthew':'Mateo','Thomas':'Tomás','Martha':'Marta','Mary of Bethany':'María de Betania','Lazarus':'Lázaro','Zacchaeus':'Zaqueo','Mary Magdalene':'María Magdalena','Stephen':'Esteban','Philip':'Felipe','Barnabas':'Bernabé','Paul':'Pablo','Silas':'Silas','Lydia':'Lidia'
};
const answers={};
Object.entries(names).forEach(([source,translated])=>{answers[`Who is ${source}?`]=`¿Quién es ${translated}?`;});
Object.assign(answers,{
'What is John?':'¿Cuál es el Evangelio de Juan?',
'What is Jericho?':'¿Qué es Jericó?',
'What is Genesis?':'¿Qué es Génesis?',
'What is loving God?':'¿Qué es amar a Dios?',
'What is Pentecost?':'¿Qué es Pentecostés?'
});
const referenceBooks={
'Genesis':'Génesis','Exodus':'Éxodo','Joshua':'Josué','Judges':'Jueces','Ruth':'Rut','1 Samuel':'1 Samuel','2 Samuel':'2 Samuel','1 Kings':'1 Reyes','2 Kings':'2 Reyes','Ezra':'Esdras','Nehemiah':'Nehemías','Esther':'Ester','Job':'Job','Isaiah':'Isaías','Jeremiah':'Jeremías','Ezekiel':'Ezequiel','Daniel':'Daniel','Hosea':'Oseas','Jonah':'Jonás','Matthew':'Mateo','Mark':'Marcos','Luke':'Lucas','John':'Juan','Acts':'Hechos'
};
window.NLDG_ES_BIBLE_TRIVIA={prompts,answers,referenceBooks,sourceQuestionCount:63,sourcePackCount:2,fallbackQuestionCount:5};
})();