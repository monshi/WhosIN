(function(){
  var body    = null,
      iframe  = null,
      form    = null,
      input   = null,
      urls    = {
        iframe: 'http://omonshiz-ld.linkedin.biz:7890/process',
        css: 'http://omonshiz-ld.linkedin.biz:7890/css/whosin.css'
      };

  function appendIFrame() {
    if(!iframe){
      iframe      = document.createElement('iframe');
    }
    iframe.id     = 'whosinIframe';
    iframe.name   = 'whosiniframe';
    resizeIframe();
    body.appendChild(iframe);
  }

  function appendForm() {
      if(!form){
        form      = document.createElement('form');
        input     = document.createElement('input');
      }
      form.method = 'post';
      form.target = 'whosiniframe';
      form.action = urls.iframe;

      input.type  = 'hidden';
      input.name  = 'whosinhtml'
      form.appendChild(input);
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

  function submitForm(){
    input.value = body.innerHTML;
    form.submit();
  }

  function init() {
    if(!body) {
      body = document.getElementsByTagName('body')[0];
      appendCSS();
      appendIFrame();
      appendForm();
      submitForm();
      window.addEventListener('resize', resizeIframe, false);
    }
  }

  init();
})();