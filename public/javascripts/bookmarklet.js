(function(){

  if(!window.whosINscript){
    window.whosINscript = document.createElement('script');
    window.whosINscript.type = 'text/javascript';
    window.whosINscript.src = 'http://localhost:7890/js/whosin.js';
    document.getElementsByTagName('body')[0].appendChild(window.whosINscript);
  }
  else {
    WhosINObject.run();
  }

})();

// Compress version for bookmarklet:
(function(){if(!window.whosINscript){window.whosINscript=document.createElement('script');window.whosINscript.type='text/javascript';window.whosINscript.src='http://localhost:7890/js/whosin.js';document.getElementsByTagName('body')[0].appendChild(window.whosINscript)}else{WhosINObject.run()}})();