(function(){
  var node,
    textNodes = [],
    body = null,
    inStyles = null,
    inScript = null,
    inInner,
    whosInLayout,
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

    function initINFramework() {
      if(!body) {
        inStyles = document.createElement('link');
        inStyles.rel = 'stylesheet';
        inStyles.type = 'text/css';
        inStyles.href = 'http://localhost/css/whosin.css';

        body = document.getElementsByTagName('body')[0];
        inScript = document.createElement('script');
        inScript.type = 'text/javascript';
        inInner = 'api_key: x2tkqnnvqo4d\n\
                   onLoad: WhosIN.search\n\
                   authorize: true';
        inScript.innerHTML = inInner;
        inScript.src = 'http://platform.linkedin.com/in.js';
        body.appendChild(inStyles);
        body.appendChild(inScript);
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
                peopleDiv += '<li>' + 
                                '<img src="' + res.people.values[i].pictureUrl + '" />' +
                                '<h2><a href="' + res.people.values[i].publicProfileUrl + '" target="_blank">'  + res.people.values[i].firstName + ' ' + res.people.values[i].lastName + '</a></h2>' +
                                '<h3>' + res.people.values[i].headline + '</h3>' +
                              '</li>';
              }

              peopleDiv += '</ul>';

              whosInLayout.innerHTML = '<h1>' + res.numResults + ' record(s) found!</h1>' + peopleDiv;
            }
          }
        );
      }
      else{
        IN.User.authorize();
      }
      
    }

    function createLayout(){
      if(!whosInLayout){
        whosInLayout = document.createElement('div');
        whosInLayout.setAttribute('id', 'whosInWrapper');
        whosInLayout.style.height = window.innerHeight + 'px';
        body.appendChild(whosInLayout);
      }
    }

    WhosIN = {
      search: doSearch
    };

    initINFramework();
})();
