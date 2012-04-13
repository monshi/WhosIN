(function(){

  if(!window.whosINscript){
    window.whosINscript = document.createElement('script');
    window.whosINscript.type = 'text/javascript';
    window.whosINscript.src = 'http://localhost/js/whosin.js';
    document.getElementsByTagName('body')[0].appendChild(window.whosINscript);
  }
  else{
    WhosIN.search();
  }
})();