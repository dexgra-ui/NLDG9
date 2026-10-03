(function(){
  if(window.NLDG_LESSON_REFLECTIONS_LOADED)return;
  const current=document.currentScript;
  const source=new URL('../lesson-reflections.js?v=1.0.0',current?.src||window.location.href).href;
  const normalized=source.split('?')[0];
  if([...document.scripts].some(script=>script!==current&&script.src.split('?')[0]===normalized))return;
  const script=document.createElement('script');
  script.src=source;
  script.async=false;
  document.body.appendChild(script);
})();
