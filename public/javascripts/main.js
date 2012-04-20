(function(){
  var node,
    textNodes = [],
    body = null,
    inCSS = null,
    inScript = null,
    inInner,
    whosInLayout,
    walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),
    urls = {
      css: 'http://localhost/css/main.css',
      noImage:'http://localhost/img/icon_no_photo_no_border_60x60.png'
    };
    /*
    function walk() {
      while(node = walker.nextNode()) {
        if(node.nodeValue!=="\n"){
          textNodes.push(node.nodeValue);
        }
      }
    }
    */

    function initINFramework() {
      if(!body) {
        body = document.getElementsByTagName('body')[0];
        appendJS();
      }
    }

    function appendCSS() {
      inCSS       = document.createElement('link');
      inCSS.rel   = 'stylesheet';
      inCSS.type  = 'text/css';
      inCSS.href  = urls.css;

      body.appendChild(inCSS);
    }

    function appendJS() {
      inScript      = document.createElement('script');
      inScript.type = 'text/javascript';
      inScript.src  = 'http://platform.linkedin.com/in.js';
      inInner       = 'api_key: x2tkqnnvqo4d\n\
                      onLoad: WhosIN.search\n\
                      authorize: true';

      inScript.innerHTML = inInner;
      body.appendChild(inScript);
    }

    function getSelectionText() {
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

    function doSearch() {
      var peopleDiv = '<ul>',
          profile,
          i;
      if(IN.User.isAuthorized()){
        createLayout();
        IN.API.PeopleSearch()
          .fields(['first-name', 'last-name', 'headline', 'picture-url', 'public-profile-url'])
          .params({
            'keywords': getSelectionText(),
            'sort': 'distance'
          })
          .result(function(res){
            if(res){
              for(i = 0, len = res.people._count; i < len; i++){
                profile = res.people.values[i];
                peopleDiv += '<li>' + 
                                '<img src="' + (profile.pictureUrl || urls.noImage) + '" />' +
                                '<h2><a href="' + profile.publicProfileUrl + '" target="_blank">'  + profile.firstName + ' ' + profile.lastName + '</a></h2>' +
                                '<h3>' + profile.headline + '</h3>' +
                              '</li>';
              }

              peopleDiv += '</ul>';

              whosInLayout.innerHTML = '<a href="#" class="close-button">close</a><h1>' + res.numResults + ' record(s) found!</h1>' + peopleDiv;
              IN.Util.removeClass(whosInLayout, 'hide-module');
            }
          }
        );
      }
      else{
        IN.User.authorize();
      }
      
    }

    function onClick(e) {
      if(e.target.className === 'close-button') {
        e.preventDefault();
        IN.Util.addClass(whosInLayout, 'hide-module');
      }
    }

    function createLayout(){
      if(!whosInLayout){
        whosInLayout = document.createElement('div');
        whosInLayout.setAttribute('id', 'whosInWrapper');
        body.appendChild(whosInLayout);
        IN.Event.on(whosInLayout, 'click', onClick, null);
      }
    }

    WhosIN = {
      search: doSearch
    };

    initINFramework();
})();
