(function(d,t) {
  let g=d.createElement(t),s=d.getElementsByTagName(t)[0];
  const BASE_URL="https://chat.monk.io";
  const runChatwootSDK = (token = "Kmbzacatn443pvGdxgY3Jaz5") => window.chatwootSDK.run({
    websiteToken: token,
    baseUrl: BASE_URL
  });

  g.src=BASE_URL+"/packs/js/sdk.js";
  s.parentNode.insertBefore(g,s);

  g.onload=function(){
    fetch('https://chat.monk.io/monktoken/home')
    .then(response => response.json())
    .then((r) => runChatwootSDK(r.token))
    .catch(e => runChatwootSDK())
  }
})(document,"script");