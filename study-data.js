(function(){
  if(window.NLDG_LIBRARY)return;
  if(document.readyState==='loading'){
    document.write('<script src="content-library.js?v=20260728-2"><\/script>');
    return;
  }
  const script=document.createElement('script');
  script.src='content-library.js?v=20260728-2';
  document.head.appendChild(script);
})();