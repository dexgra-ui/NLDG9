(function(){const s=window.NLDG_BOOK_STUDY;if(!s)return;Object.assign(s,{
  "themeLabel": "Key Truth",
  "seriesMainScripture": "2 Chronicles 1–36; Matthew 1:11–17; John 2:18–22",
  "seriesQuestion": "What happens when worship, leadership, and reform truly seek God, and what happens when religion protects pride, injustice, or refusal to listen?",
  "seriesOpening": "Trace seek, humble, heart, house, forsake, return, prophet, and word of the LORD. Compare parallel accounts where they genuinely clarify, ask who bears each royal decision’s cost, and distinguish covenant judgment from modern disaster blame. Give content warnings and allow participants to pass or step out.",
  "seriesContext": "Second Chronicles continues directly from David’s final assembly into Solomon’s reign, the temple, and the history of Judah’s Davidic kings. The northern kingdom appears mainly where it intersects Judah, so the book is a selective theological retelling rather than a complete political chronicle. Written for a community after the Babylonian exile, it repeatedly uses seek, humble, forsake, return, heart, house, and prophetic speech to interpret worship, leadership, judgment, and restoration. Parallel accounts in Kings often add material Chronicles omits; each witness should be heard without collapsing their distinct emphases.\n\nDistinguish narrator evaluation, quoted royal or prophetic speech, reasonable inference, disputed reconstruction, parallel material in Kings, and later Christian fulfillment. Judah’s covenant judgments are not universal formulas for modern disaster, illness, poverty, or death. Divine providence never turns every royal method into an ethical model. Ancient warfare, executions, hereditary offices, temple sacrifice, and coerced labor are not church practices.",
  "seriesTeaching": [
    {
      "heading": "The Temple Serves Presence, Prayer, and Justice",
      "body": "Solomon’s house becomes a center for covenant worship, foreigners, repentance, and exile prayer, yet even heaven cannot contain God and splendor cannot excuse exploited labor."
    },
    {
      "heading": "Seeking God Must Remain Wholehearted and Teachable",
      "body": "Kings seek, forsake, return, and harden across generations. Past victory or reform never makes a leader immune from correction."
    },
    {
      "heading": "Prophets Confront Power and False Security",
      "body": "Azariah, Hanani, Micaiah, Jehu, Jahaziel, Zechariah, Oded, Huldah, and other messengers interpret events and expose alliances, injustice, idolatry, and retaliation."
    },
    {
      "heading": "Reform Can Be Sincere and Still Incomplete",
      "body": "Temple repair, covenant renewal, Passover, and idol removal matter, but coercion, recurring blind spots, shallow formation, and surviving harm require ongoing accountability."
    },
    {
      "heading": "Covenant Judgment Never Authorizes Modern Blame or Violence",
      "body": "War, disease, invasion, and exile are interpreted within Judah’s history. They do not prove personal sin in modern sufferers or authorize Christian force, antisemitism, or nationalism."
    },
    {
      "heading": "Exile Opens Toward Return and Jesus",
      "body": "Cyrus’s decree sends people up to rebuild, while the Davidic line continues through exile to Jesus, the faithful King and true temple who brings people home to God."
    }
  ],
  "seriesQuestions": [
    "How do seek, humble, forsake, and return structure the book?",
    "Where does temple worship require justice and welcome outsiders?",
    "Which royal successes conceal exploitation, pride, or unteachable power?",
    "How do prophets confront majorities, alliances, retaliation, and shallow reform?",
    "Where does the narrator report violence without giving Christians a method to imitate?",
    "How do Chronicles and Kings offer distinct but complementary portraits?",
    "What separates repentance from restitution, restored trust, and completed reform?",
    "How do exile, Cyrus, David’s line, and temple hope reach Jesus?"
  ],
  "seriesExamination": "Where have I used worship, success, political loyalty, or past reform to avoid correction? Who bears the cost of my community’s systems? What repentance, repair, boundary, or invitation is needed?",
  "seriesPractice": "Read one royal or reform story from both the leader’s viewpoint and that of a worker, captive, child, patient, dissenter, or exile. Review one safeguarding, financial, medical-support, or decision process and make one measurable correction.",
  "seriesLeaderGuidance": "Prepare participants for forced labor, war, mass casualties, child sacrifice, family murder, assassination, captivity, public humiliation, severe illness, religious violence, siege, displacement, and financial abuse. Participants may pass or step out without explanation. Do not promise absolute confidentiality. Follow approved safeguarding and reporting duties, and connect present danger, abuse, trauma, illness, or exploitation with qualified help. Do not use revival, temple purity, authority, unity, submission, healing, or giving to demand money, silence concerns, pressure disclosure, stigmatize illness, excuse abuse, or promote nationalism and violence.",
  "seriesPrayer": "Holy and merciful God, teach us to seek you without using worship to hide pride or harm. Make leaders teachable, protect people burdened by power, and give us courage to repent with repair. Through Jesus, the faithful Son of David and true meeting place with God, lead us from exile toward home. Amen.",
  "seriesJesusConnection": "Jesus is the faithful Son of David, truthful prophet, just king, and true temple. He bears judgment, welcomes outsiders, refuses coercive rule, rises from death, and gathers exiles into God’s presence.",
  "seriesGuardrail": "Judah’s covenant is not a modern national contract; illness is not a moral label; reform does not erase victims; and ancient violence is never the church’s method.",
  "seriesClosingTakeaway": "Second Chronicles calls God’s people to seek him with teachable hearts, worship with justice, repent with repair, and walk through exile toward the open door of restoration in Jesus."
});})();

(function(){
 if(typeof document==='undefined')return;
 function showFoundation(){
  const s=window.NLDG_BOOK_STUDY,view=document.getElementById('book-view');
  if(!s||!view||s.lessons.some(x=>x.number===Number(new URLSearchParams(location.search).get('lesson')))||document.getElementById('second-chronicles-foundation'))return;
  const es=s.slug==='segunda-cronicas-estudio',section=document.createElement('section');
  section.id='second-chronicles-foundation';section.className='series-guide';
  function panel(title,text,items){const a=document.createElement('article');a.className='lesson-panel';const h=document.createElement('h2');h.textContent=title;a.append(h);for(const t of String(text||'').split('\n\n').filter(Boolean)){const p=document.createElement('p');p.textContent=t;a.append(p);}if(items){const ol=document.createElement('ol');for(const t of items){const li=document.createElement('li');li.textContent=t;ol.append(li);}a.append(ol);}section.append(a);}
  panel(es?'Pasaje principal de la serie':'Series Main Scripture',s.seriesMainScripture);
  panel(es?'Pregunta central':'Central Question',s.seriesQuestion);
  panel(es?'Apertura':'Opening',s.seriesOpening);
  panel(es?'Contexto bíblico':'Scripture Context',s.seriesContext);
  for(const t of s.seriesTeaching||[])panel(t.heading,t.body);
  panel(es?'Conexión con Jesús':'Jesus Connection',s.seriesJesusConnection);
  panel(es?'No pases por alto esto':'Do Not Miss This',s.seriesGuardrail);
  panel(es?'Preguntas para conversar':'Discussion Questions','',s.seriesQuestions);
  panel(es?'Examen personal':'Personal Examination',s.seriesExamination);
  panel(es?'Práctica semanal':'Weekly Practice',s.seriesPractice);
  panel(es?'Orientación para líderes':'Leader Guidance',s.seriesLeaderGuidance);
  panel(es?'Conclusión':'Closing Takeaway',s.seriesClosingTakeaway);
  const prayer=view.querySelector('.series-prayer');view.insertBefore(section,prayer||null);
  window.NLDG_SCRIPTURE_LINKS?.linkReferences(section);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',showFoundation,{once:true});else showFoundation();
})();
