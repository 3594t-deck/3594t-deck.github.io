if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return i[e]||(r=new Promise(async r=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=r}else importScripts(e),r()})),r.then(()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]})},r=(r,i)=>{Promise.all(r.map(e)).then(e=>i(1===e.length?e[0]:e))},i={require:Promise.resolve(r)};self.define=(r,n,s)=>{i[r]||(i[r]=Promise.resolve().then(()=>{let i={};const c={uri:location.origin+r.slice(1)};return Promise.all(n.map(r=>{switch(r){case"exports":return i;case"module":return c;default:return e(r)}})).then(e=>{const r=s(...e);return i.default||(i.default=r),i})}))}}define("./service-worker.js",["./workbox-a867ce74"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"icons/icon-180.png",revision:"ec4efdf1e2c5774773504eac4754ae64"},{url:"icons/icon-192.png",revision:"bda55b0fbf3bf038742ee43f04afc5e1"},{url:"icons/icon-64.png",revision:"2e3cb2f7b34c3d6d9ea8e1f52029f9a1"},{url:"manifest.webmanifest",revision:"02de5ce97b9e7860053413c212f36e0c"},{url:"scripts/deck.0b014b32c9a518c7099a.js",revision:"7042752e26244757df0016ab51337186"},{url:"scripts/vendor.4817e6bd34b07e857150.js",revision:"63e6d98eaeca558667a705233b9f5654"},{url:"styles/deck.0b014b32c9a518c7099a.css",revision:"d6f2469589cd9d43d4c0affb996bce07"}],{}),e.registerRoute("/index.html",new e.NetworkFirst,"GET"),e.registerRoute(({url:e})=>!(!e||e.origin!==location.origin)&&"/"===e.pathname,({event:r})=>(new e.NetworkFirst).handle({request:"/index.html",event:r}),"GET"),e.registerRoute(/\.md5$/i,new e.NetworkFirst,"GET"),e.registerRoute(/^https:\/\/3594t\.net\/img\/.*\.(:?jpg|png|gif)$/i,new e.CacheFirst({cacheName:"3594t.net/img",plugins:[new e.ExpirationPlugin({maxAgeSeconds:259200,purgeOnQuotaError:!0})]}),"GET")}));
