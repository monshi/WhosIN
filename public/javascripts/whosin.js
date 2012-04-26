(function(){
  var body    = null,
      iframe  = null,
      form    = null,
      input   = null,
      css     = null,
      spinner = null,
      btnExit = null,
      urls    = {
        iframe:   'http://localhost:7890/process',
        css:      'http://localhost:7890/css/whosin.css',
        spinner:  'http://localhost:7890/img/loading_spinner.gif',
        btnExit:  'http://localhost:7890/img/close_icon.gif'
      },
      isDestroyed = true;

  function appendIFrame() {
    //if(!iframe){
    iframe      = document.createElement('iframe');
    //}
    iframe.id     = 'whosinIframe';
    iframe.name   = 'whosiniframe';
    resizeIframe();
    body.appendChild(iframe);
  }

  function appendForm() {
      //if(!form){
      form      = document.createElement('form');
      input     = document.createElement('input');
      //}
      form.method = 'post';
      form.target = 'whosiniframe';
      form.action = urls.iframe;

      input.type  = 'hidden';
      input.name  = 'whosinhtml'
      form.appendChild(input);
      body.appendChild(form);
  }

  function appendCSS() {
      css = document.createElement('link');
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
    iframe.onload = onIframeLoad;
    form.submit();
    indicateLoading();
  }

  function indicateLoading(){
    spinner = document.createElement('img');
    spinner.id = 'whosInPreloading';
    spinner.src = urls.spinner;
    body.appendChild(spinner);
  }

  function onIframeLoad(){
    spinner.style.display = 'none';
  }
  
  function appendCloseButton(){
    btnExit = document.createElement('img');
    btnExit.src = urls.btnExit;
    btnExit.id = 'whosInCloseIcon';
    btnExit.onclick = destroy;
    body.appendChild(btnExit);
  }

  function destroy(){
    body.removeChild(btnExit);
    body.removeChild(iframe);
    body.removeChild(css);
    body.removeChild(form);
    isDestroyed = true;
  }
  
  function run(){
    if(isDestroyed) {
      appendCSS();
      appendIFrame();
      appendCloseButton();
      appendForm();
      submitForm();
      isDestroyed = false;
    }
  }

  function init() {
    if(!body) {
      body = document.getElementsByTagName('body')[0];
      window.addEventListener('resize', resizeIframe, false);
      run();
      window.WhosINObject = {
        run: run
      };
    }
  }

  init();
})();