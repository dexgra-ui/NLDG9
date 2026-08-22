(function(){
  const loadScript=(src,test,next)=>{
    if(test()){next?.();return;}
    const script=document.createElement('script');
    script.src=src;
    script.onload=()=>next?.();
    document.head.appendChild(script);
  };
  const loadLeadership=()=>loadScript('leadership-library.js?v=1.0.0',()=>Boolean(window.NLDG_LEADERSHIP_LIBRARY_LOADED));
  const loadDifficultQuestions=()=>loadScript('difficult-questions-library.js?v=1.0.0',()=>Boolean(window.NLDG_DIFFICULT_QUESTIONS_LIBRARY_LOADED),loadLeadership);
  const loadMarriage=()=>loadScript('marriage-family-library.js?v=1.0.0',()=>Boolean(window.NLDG_MARRIAGE_FAMILY_LIBRARY_LOADED),loadDifficultQuestions);
  const loadGrowingWithJesus=()=>loadScript('growing-with-jesus-library.js?v=1.0.0',()=>Boolean(window.NLDG_GROWING_WITH_JESUS_LIBRARY_LOADED),loadMarriage);
  if(window.NLDG_LIBRARY){loadGrowingWithJesus();return;}
  if(document.readyState==='loading'){
    document.write('<script src="content-library.js?v=20260814-1"><\/script><script src="growing-with-jesus-library.js?v=1.0.0"><\/script><script src="marriage-family-library.js?v=1.0.0"><\/script><script src="difficult-questions-library.js?v=1.0.0"><\/script><script src="leadership-library.js?v=1.0.0"><\/script>');
    return;
  }
  const script=document.createElement('script');
  script.src='content-library.js?v=20260814-1';
  script.onload=loadGrowingWithJesus;
  document.head.appendChild(script);
})();