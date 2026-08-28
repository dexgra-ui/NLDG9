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
  const loadFollowingJesusForYourself=()=>loadScript('following-jesus-for-yourself-library.js?v=1.0.0',()=>Boolean(window.NLDG_FOLLOWING_JESUS_FOR_YOURSELF_LIBRARY_LOADED),loadGrowingWithJesus);
  const loadAfterBenediction=()=>loadScript('after-benediction-library.js?v=1.0.0',()=>Boolean(window.NLDG_AFTER_BENEDICTION_LIBRARY_LOADED),loadFollowingJesusForYourself);
  const loadGriefOfAging=()=>loadScript('grief-of-aging-library.js?v=1.0.0',()=>Boolean(window.NLDG_GRIEF_OF_AGING_LIBRARY_LOADED),loadAfterBenediction);
  if(window.NLDG_LIBRARY){loadGriefOfAging();return;}
  if(document.readyState==='loading'){
    document.write('<script src="content-library.js?v=20260814-1"><\/script><script src="grief-of-aging-library.js?v=1.0.0"><\/script><script src="after-benediction-library.js?v=1.0.0"><\/script><script src="following-jesus-for-yourself-library.js?v=1.0.0"><\/script><script src="growing-with-jesus-library.js?v=1.0.0"><\/script><script src="marriage-family-library.js?v=1.0.0"><\/script><script src="difficult-questions-library.js?v=1.0.0"><\/script><script src="leadership-library.js?v=1.0.0"><\/script>');
    return;
  }
  const script=document.createElement('script');
  script.src='content-library.js?v=20260814-1';
  script.onload=loadGriefOfAging;
  document.head.appendChild(script);
})();