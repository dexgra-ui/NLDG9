(()=>{
if(window.NLDG_ES_I18N_SHIM_LOADED)return;
window.NLDG_ES_I18N_SHIM_LOADED=true;
const script=document.createElement('script');
script.src=new URL('../nldg-i18n.js?v=1.0.0',document.currentScript?.src||location.href).href;
script.async=false;
document.head.appendChild(script);
})();
