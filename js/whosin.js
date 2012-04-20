(function(){
  var node,
    textNodes = [],
    body = null,
    inStyles = null,
    inScript = null,
    inInner,
    whosInLayout,
    noProfileImage = 'http://localhost/whosin/img/icon_no_photo_no_border_60x60.png',
    walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false);
    /*
    function walk() {
      while(node = walker.nextNode()) {
        if(node.nodeValue!=="\n"){
          textNodes.push(node.nodeValue);
        }
      }
    }
    */

    function createTheIFrame () {
      var iframe = document.createElement('iframe');
      iframe.src = 'http://localhost/whosin';
      iframe.id = 'whosinIframe';
      body.appendChild(iframe);
    }

    function initINFramework() {
      if(!body) {

        inStyles = document.createElement('link');
        inStyles.rel = 'stylesheet';
        inStyles.type = 'text/css';
        inStyles.href = 'http://localhost/whosin/css/whosin.css';

        body = document.getElementsByTagName('body')[0];
        /*
        inScript = document.createElement('script');
        inScript.type = 'text/javascript';
        inInner = 'api_key: x2tkqnnvqo4d\n\
                   onLoad: WhosIN.search\n\
                   authorize: true';
        inScript.innerHTML = inInner;
        inScript.src = 'http://platform.linkedin.com/in.js';
        */
        body.appendChild(inStyles);
        //body.appendChild(inScript);
        createTheIFrame();
      }
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
                                '<img src="' + (profile.pictureUrl || noProfileImage) + '" />' +
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
        whosInLayout.style.height = window.innerHeight + 'px';
        body.appendChild(whosInLayout);
        IN.Event.on(whosInLayout, 'click', onClick, null);
      }
    }

    WhosIN = {
      search: doSearch
    };

    initINFramework();
})();
