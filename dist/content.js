const c="xpath-tester-highlight",r="xpath-tester-focused",i="xpath-tester-styles";let a=[];function u(){if(document.getElementById(i))return;const t=document.createElement("style");t.id=i,t.textContent=`
    .${c} {
      outline: 2px solid #10b981 !important;
      outline-offset: 1px !important;
      background-color: rgba(16, 185, 129, 0.15) !important;
      transition: all 0.15s ease !important;
    }
    .${r} {
      outline: 3px solid #f59e0b !important;
      outline-offset: 2px !important;
      background-color: rgba(245, 158, 11, 0.25) !important;
      animation: xpath-tester-pulse 0.6s ease-in-out 2 !important;
    }
    @keyframes xpath-tester-pulse {
      0%, 100% { outline-width: 3px; }
      50% { outline-width: 5px; }
    }
  `,document.head.appendChild(t)}function l(){a.forEach(t=>{t.classList.remove(c,r)}),a=[]}function h(t,n){var s;const e=((s=t.textContent)==null?void 0:s.trim())||"";return{index:n,tagName:t.tagName.toLowerCase(),id:t.id||"",className:typeof t.className=="string"?t.className:"",textPreview:e.length>60?e.slice(0,60)+"...":e}}function m(t){const n=[];try{const e=document.evaluate(t,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let s=0;s<e.snapshotLength;s++){const o=e.snapshotItem(s);o instanceof Element&&n.push(o)}}catch(e){throw new Error(`Invalid XPath: ${e.message}`)}return n}function d(t){try{return Array.from(document.querySelectorAll(t))}catch(n){throw new Error(`Invalid CSS selector: ${n.message}`)}}function f(t,n){if(u(),l(),!t.trim())return{success:!0,count:0,elements:[]};try{a=n==="xpath"?m(t):d(t),a.forEach(s=>{s.classList.add(c)});const e=a.map((s,o)=>h(s,o));return{success:!0,count:a.length,elements:e}}catch(e){return{success:!1,count:0,elements:[],error:e.message}}}function p(t){const n=a[t];n&&(a.forEach(e=>e.classList.remove(r)),n.classList.add(r),n.scrollIntoView({behavior:"smooth",block:"center"}))}function E(t){const n=a[t];n&&n.classList.add(r)}function g(){a.forEach(t=>{t.classList.remove(r)})}chrome.runtime.onMessage.addListener((t,n,e)=>{switch(t.type){case"EVALUATE":e(f(t.query,t.mode));break;case"CLEAR":l(),e({success:!0});break;case"SCROLL_TO":p(t.index),e({success:!0});break;case"HIGHLIGHT":E(t.index),e({success:!0});break;case"UNHIGHLIGHT":g(),e({success:!0});break}return!0});
