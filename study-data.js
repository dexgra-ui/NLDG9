(function(){
  if(window.NLDG_LIBRARY)return;
  if(document.readyState==='loading'){
    document.write('<script src="content-library.js"><\/script>');
    return;
  }
  const script=document.createElement('script');
  script.src='content-library.js';
  document.head.appendChild(script);
})();
