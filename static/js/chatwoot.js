(function(d,t) {
  var BASE_URL="https://help.monk.io";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 'tT8eHipK7hc1wmSem92ztdyw',
      baseUrl: BASE_URL
    })
  }
})(document,"script");