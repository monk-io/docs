(function(d,t) {
  var BASE_URL="https://chat.monk.io";
  var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  g.src=BASE_URL+"/packs/js/sdk.js";
  s.parentNode.insertBefore(g,s);
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 'vQPAyqmAwtX9e4pipH2xr5iF',
      baseUrl: BASE_URL
    })
  }
})(document,"script");