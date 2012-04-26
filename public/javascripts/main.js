(function(){
  var node,
    textNodes = [],
    body = null,
    inCSS = null,
    inScript = null,
    inInner,
    whosInLayout,
    peopleList = [],
    pCallCounter = 0,
    cCallCounter = 0,
//    walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null,false),
    urls = {
      root: 'http://omonshiz-ld.linkedin.biz:7890',
      css: '/css/main.css',
      noImage:'/img/icon_no_photo_no_border_60x60.png'
    },
    $ = jQuery,
    listContainer = $('ul');

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
      return WhosINData.result;
//      return text.replace(/^\s+|\s+$/g,'');
    }

    function doSearch() {
      if(IN.User.isAuthorized()){
        createLayout();
        callSearch(getSelectionText().people[pCallCounter], getSelectionText().companies[cCallCounter])
      }
      else{
        IN.User.authorize();
      }
    }

    function callSearch(person, company){
      IN.API.PeopleSearch()
        .fields(['first-name', 'last-name', 'headline', 'picture-url', 'public-profile-url'])
        .params({
          'keywords': person,
//          'company-name': company,
          'sort': 'relevance',
          'count': 2
        })
        .result(addToResults);
    }

    function addToResults(res){
      if(res){
        for(i = 0, len = res.people._count; i < len; i++){
          profile = res.people.values[i];
          if($.inArray(profile['publicProfileUrl'], peopleList) === -1 && typeof profile['publicProfileUrl'] !== 'undefined'){
            peopleList.push(profile['publicProfileUrl']);
            $('<li />').append(
              '<img src="' + (profile.pictureUrl || urls.noImage) + '" />' +
              '<h2><a href="' + profile.publicProfileUrl + '" target="_blank">'  + profile.firstName + ' ' + profile.lastName + '</a></h2>' +
              '<h3>' + profile.headline + '</h3>'
            ).appendTo(listContainer);
          }
        }

        console.log(peopleList);

        whosInLayout.innerHTML = '<a href="#" class="close-button">close</a><h1>' + res.numResults + ' record(s) found!</h1>';
        IN.Util.removeClass(whosInLayout, 'hide-module');

        pCallCounter++;
        cCallCounter++;

        if(pCallCounter < 4 && getSelectionText().people[pCallCounter].indexOf(' ') !== -1){
          callSearch(getSelectionText().people[pCallCounter], getSelectionText().companies[cCallCounter]);
        }
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
        whosInLayout = $('#whosInWrapper');
//        whosInLayout = document.createElement('div');
//        whosInLayout.setAttribute('id', 'whosInWrapper');
//        body.appendChild(whosInLayout);
        whosInLayout.click(onClick);
      }
    }

    WhosIN = {
      search: doSearch
    };

    initINFramework();
})();
