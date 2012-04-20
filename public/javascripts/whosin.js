(function(){
  var body    = null,
      iframe  = null,
      urls    = {
        iframe: 'http://localhost/',
        css: 'http://localhost/css/whosin.css'
      };

  function appendIFrame() {
    if(!iframe){
      iframe = document.createElement('iframe');
    }
    iframe.src    = urls.iframe;
    iframe.id     = 'whosinIframe';
    iframe.name   = 'whosiniframe';
    resizeIframe();
    body.appendChild(iframe);
  }

  function appendForm() {
      var form    = document.createElement('form');
      form.method = 'post';
      form.action = '';
      form.target = 'whosiniframe';

      body.appendChild(form);
  }

  function appendCSS() {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.type = 'text/css';
      css.href = urls.css;
      body.appendChild(css);
  }

  function resizeIframe(){
    iframe.style.height = window.innerHeight + 'px';
  }

  function init() {
    if(!body) {
      body = document.getElementsByTagName('body')[0];
      appendCSS();
      appendIFrame();
      window.addEventListener('resize', resizeIframe, false);
    }
  }

  init();
})();