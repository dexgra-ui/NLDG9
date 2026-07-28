(function(){
  const loadExtension=()=>{
    if(window.NLDG_MARRIAGE_FAMILY_LIBRARY_LOADED)return;
    const script=document.createElement('script');
    script.src='marriage-family-library.js?v=1.0.0';
    document.head.appendChild(script);
  };
  if(window.NLDG_LIBRARY){loadExtension();return;}
  if(document.readyState==='loading'){
    document.write('<script src="content-library.js?v=20260728-4"><\/script><script src="marriage-family-library.js?v=1.0.0"><\/script>');
    return;
  }
  const script=document.createElement('script');
  script.src='content-library.js?v=20260728-4';
  script.onload=loadExtension;
  document.head.appendChild(script);
})();
