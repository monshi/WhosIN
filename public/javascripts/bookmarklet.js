(function(){

  if(!window.whosINscript){
    window.whosINscript = document.createElement('script');
    window.whosINscript.type = 'text/javascript';
    window.whosINscript.src = 'http://omonshiz-ld.linkedin.biz:7890/js/whosin.js';
    document.getElementsByTagName('body')[0].appendChild(window.whosINscript);
  }
  else {
    WhosINObject.run();
  }

})();

// Compress version for bookmarklet:
javascript:(function(){if(!window.whosINscript){window.whosINscript=document.createElement('script');window.whosINscript.type='text/javascript';window.whosINscript.src='http://omonshiz-ld.linkedin.biz:7890/js/whosin.js';document.getElementsByTagName('body')[0].appendChild(window.whosINscript)}else{WhosINObject.run()}})();