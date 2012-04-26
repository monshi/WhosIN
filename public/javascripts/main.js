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
    peopleListContainer = $('.people-list'),
    companyListContainer = $('.company-list');

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
      /*
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
      */
      return WhosINData.result;
//      return text.replace(/^\s+|\s+$/g,'');
    }

    function doSearch() {
      if(IN.User.isAuthorized()){
        createLayout();
        callCompanySearch(getSelectionText().companies[cCallCounter]);
        callPeopleSearch(getSelectionText().people[pCallCounter]);
      }
      else{
        IN.User.authorize();
        IN.Event.on(IN, "auth", WhosIN.search);
      }
    }

    function callPeopleSearch(person){
      IN.API.PeopleSearch()
        .fields(['first-name', 'last-name', 'headline', 'picture-url', 'public-profile-url'])
        .params({
          'keywords': person,
          'sort': 'relevance',
          'count': 2
        })
        .result(addToPeopleResults);
    }
    
    function callCompanySearch(company){
      IN.API.Raw().url('/company-search:(companies:(id,name,square-logo-url,logo-url,industry))?count=2&keywords='+company).result(addToCompanyResults);

      if(pCallCounter < 4 && getSelectionText().companies[pCallCounter].indexOf(' ') !== -1){
        callPeopleSearch(getSelectionText().companies[pCallCounter]);
      }
    }

    function addToPeopleResults(res){
      var profile;
      if(res){
        for(i = 0, len = res.people._count; i < len; i++){
          profile = res.people.values[i];
          if($.inArray(profile['publicProfileUrl'], peopleList) === -1 && typeof profile['publicProfileUrl'] !== 'undefined'){
            peopleList.push(profile['publicProfileUrl']);
            $('<li />').append(
              '<a href="' + profile.publicProfileUrl + '" target="_blank"><img src="' + (profile.pictureUrl || urls.noImage) + '" /></a>' +
              '<h2><a href="' + profile.publicProfileUrl + '" target="_blank">'  + profile.firstName + ' ' + profile.lastName + '</a></h2>' +
              '<h3>' + profile.headline + '</h3>'
            ).appendTo(peopleListContainer);
          }
        }

        if(res.people._total == 0 && pCallCounter == 0){
          $('<li>No results found in people.</li>').appendTo(companyListContainer);
        }

        whosInLayout.innerHTML = '<a href="#" class="close-button">close</a><h1>' + res.numResults + ' record(s) found!</h1>';
        IN.Util.removeClass(whosInLayout, 'hide-module');

        pCallCounter++;
        cCallCounter++;

        if(pCallCounter < 4 && getSelectionText().people[pCallCounter].indexOf(' ') !== -1){
          callPeopleSearch(getSelectionText().people[pCallCounter]);
        }
      }
    }

    function addToCompanyResults(res){
      var profile;
      if(res){
        for(i = 0, len = res.companies._count; i < len; i++){
          profile = res.companies.values[i];
          $('<li />').append(
            '<a href="http://www.linkedin.com/company/' + profile.id + '" target="_blank"><img src="' + ((profile.squareLogoUrl || profile.logoUrl) || urls.noImage) + '" /></a>' +
            '<h2><a href="http://www.linkedin.com/company/' + profile.id + '" target="_blank">'  + profile.name + '</a></h2>' +
            '<h3>' + profile.industry + '</h3>'
          ).appendTo(companyListContainer);
        }
        if(res.companies._total == 0 && cCallCounter == 0){
          $('<li>No results found in companies.</li>').appendTo(companyListContainer);
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
