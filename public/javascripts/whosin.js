(function(){
  var body    = null,
      iframe  = null,
      form    = null,
      input   = null,
      css     = null,
      spinner = null,
      btnExit = null,
      rootUrl = 'http://omonshiz-ld.linkedin.biz:7890',
      urls    = {
        iframe:   rootUrl + '/process',
        css:      rootUrl + '/css/whosin.css',
        spinner:  rootUrl + '/img/loading_spinner.gif',
        btnExit:  rootUrl + '/img/close_icon.gif'
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
//    input.value = getSelectedText() || body.innerHTML;
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

  function getSelectedText(){
    var text = "",
        sel = null,
        container = null,
        i,
        len;

    if(typeof window.getSelection !== 'undefined') {
      sel = window.getSelection();
      if(sel.rangeCount){
        container = document.createElement('div');
        for(i = 0, len = sel.rangeCount; i < len; i += 1 ){
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        text = container.textContent;
      }
    }
    else if(typeof document.selection !== 'undefined') {
      if(document.selection.type === 'text'){
        text = document.selection.createRange().text;
      }
    }

    return text.replace(/^\s+|\s+$/g,'');
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