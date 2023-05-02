"use strict";function e(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=e(require("fs"));class r{constructor(e){this.req=e}getUserId(){return this.req.accountability.user}isAuthenticated(){return"false"===(!("RIS_REQUIRED_AUTH"in process.env)||process.env.RIS_REQUIRED_AUTH)||!!this.getUserId()&&this.getUserId()}getApiUrl(){return this.req.protocol+"://"+this.req.get("host")}getBody(){return this.req.body}}const s=__dirname+"/providers";let i=[];function a(e){const t=e.toUpperCase();return i.find((e=>e.key===t))}function o(e){return e.status(500),e.send({data:"User is not authorized to make this request"})}t.default.readdir(s,(function(e,t){t.forEach((e=>{const t=new(require(s+`/${e}`));t.key===process.env.RIS_DEFAULT_PROVIDER?i.unshift(t):i.push(t)}))})),module.exports=function(e,{services:t,exceptions:s}){e.get("/",((e,t)=>{if(!new r(e).isAuthenticated())return o(t);t.send({"/":"List the available endpoints for this extension. (You are here)","/providers":"Get the information of all the providers","/providers/[provider]":"Get the information about a single provider","/providers/[provider]/featured":"Fetch the featured images the provider provides","/providers/[provider]/search?query=Dog&page=2":"Search for provider images based on the users query","/providers/[provider]/download":"Post request of a URL to download an image from the provider allowing a hidden prefix of api_key"})})),e.get("/providers",((e,t)=>{if(!new r(e).isAuthenticated())return o(t);t.send({data:i})})),e.get("/providers/:provider",((e,t)=>{if(!new r(e).isAuthenticated())return o(t);const s=a(e.params.provider);s||(t.status(500),t.send({data:"This provider does not exist"})),s.is_configured||(t.status(500),t.send({data:"This provider has not been configured"})),t.send({data:{provider:s}})})),e.get("/providers/:provider/featured",(async(e,t)=>{if(!new r(e).isAuthenticated())return o(t);try{const r=a(e.params.provider),s=await r.getFeatured();t.send({data:s})}catch(e){t.status(500),t.send({data:"Failed to get featured results"})}})),e.get("/providers/:provider/search",(async(e,t)=>{if(!new r(e).isAuthenticated())return o(t);try{const r=a(e.params.provider),s=await r.getSearch(e.query.query,e.query.page);t.send({data:s})}catch(e){t.status(500),t.send({data:"Failed to get search results"})}})),e.post("/providers/:provider/download",(async(e,t)=>{const s=new r(e);if(!s.isAuthenticated())return o(t);try{const r=a(e.params.provider),i=await r.downloadImage(s);t.send({data:i})}catch(e){t.status(500),t.send({data:"Failed to import image. Ensure URL is the same as your HOST."})}}))};
//# sourceMappingURL=index.js.map
