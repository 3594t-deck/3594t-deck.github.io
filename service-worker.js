if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise(async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()})),r.then(()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]})},r=(r,i)=>{Promise.all(r.map(e)).then(e=>i(1===e.length?e[0]:e))},i={require:Promise.resolve(r)};self.define=(r,n,s)=>{i[r]||(i[r]=Promise.resolve().then(()=>{let i={};const c={uri:location.origin+r.slice(1)};return Promise.all(n.map(r=>{switch(r){case"exports":return i;case"module":return c;default:return e(r)}})).then(e=>{const r=s(...e);return i.default||(i.default=r),i})}))}}define("./service-worker.js",["./workbox-a867ce74"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"icons/icon-180.png",revision:"ec4efdf1e2c5774773504eac4754ae64"},{url:"icons/icon-192.png",revision:"bda55b0fbf3bf038742ee43f04afc5e1"},{url:"icons/icon-64.png",revision:"2e3cb2f7b34c3d6d9ea8e1f52029f9a1"},{url:"manifest.webmanifest",revision:"02de5ce97b9e7860053413c212f36e0c"},{url:"scripts/deck.913749790b887c062687.js",revision:"4c3718f2b625c627e87eae28e5f187d9"},{url:"scripts/vendor.ea0de2b08d2698557d7d.js",revision:"01e1ce61c794ad0b2d8fd3585f7f88c5"},{url:"styles/deck.913749790b887c062687.css",revision:"328e86d8feb5a7798cc4845647e26751"}],{}),e.registerRoute("/index.html",new e.NetworkFirst,"GET"),e.registerRoute(({url:e})=>!(!e||e.origin!==location.origin)&&"/"===e.pathname,({event:r})=>(new e.NetworkFirst).handle({request:"/index.html",event:r}),"GET"),e.registerRoute(/\.md5$/i,new e.NetworkFirst,"GET"),e.registerRoute(/^https:\/\/3594t\.net\/img\/.*\.(:?jpg|png|gif)$/i,new e.CacheFirst({cacheName:"3594t.net/img",plugins:[new e.ExpirationPlugin({maxAgeSeconds:259200,purgeOnQuotaError:!0})]}),"GET")}));
