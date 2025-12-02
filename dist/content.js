const l="xpath-tester-highlight",s="xpath-tester-focused",h="xpath-tester-styles";let o=[],c=null,d=0;const E=5e3;function g(){if(document.getElementById(h))return;const t=document.createElement("style");t.id=h,t.textContent=`
    .${l} {
      outline: 2px solid #10b981 !important;
      outline-offset: 1px !important;
      background-color: rgba(16, 185, 129, 0.15) !important;
      transition: all 0.15s ease !important;
    }
    .${s} {
      outline: 3px solid #f59e0b !important;
      outline-offset: 2px !important;
      background-color: rgba(245, 158, 11, 0.25) !important;
      animation: xpath-tester-pulse 0.6s ease-in-out 2 !important;
    }
    @keyframes xpath-tester-pulse {
      0%, 100% { outline-width: 3px; }
      50% { outline-width: 5px; }
    }
  `,document.head.appendChild(t)}function f(){o.forEach(t=>{t.classList.remove(l,s)}),o=[]}function x(t,n){var a;const e=((a=t.textContent)==null?void 0:a.trim())||"";return{index:n,tagName:t.tagName.toLowerCase(),id:t.id||"",className:typeof t.className=="string"?t.className:"",textPreview:e.length>60?e.slice(0,60)+"...":e}}function L(t){const n=[];try{const e=document.evaluate(t,document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(let a=0;a<e.snapshotLength;a++){const r=e.snapshotItem(a);r instanceof Element&&n.push(r)}}catch(e){throw new Error(`Invalid XPath: ${e.message}`)}return n}function S(t){try{return Array.from(document.querySelectorAll(t))}catch(n){throw new Error(`Invalid CSS selector: ${n.message}`)}}function I(t,n){if(g(),f(),!t.trim())return{success:!0,count:0,elements:[]};try{o=n==="xpath"?L(t):S(t),o.forEach(a=>{a.classList.add(l)});const e=o.map((a,r)=>x(a,r));return{success:!0,count:o.length,elements:e}}catch(e){return{success:!1,count:0,elements:[],error:e.message}}}function b(t){const n=o[t];n&&(o.forEach(e=>e.classList.remove(s)),n.classList.add(s),n.scrollIntoView({behavior:"smooth",block:"center"}))}function w(t){const n=o[t];n&&n.classList.add(s)}function N(){o.forEach(t=>{t.classList.remove(s)})}function C(){const t=Date.now();if(c&&t-d<E)return c;const n=new Set,e=new Set,a=document.createTreeWalker(document.body,NodeFilter.SHOW_ELEMENT,null);let r=a.currentNode;const p=5e3;let i=0;for(;r&&i<p;){n.add(r.tagName.toLowerCase());for(const m of r.attributes)m.name.startsWith("xpath-tester-")||e.add(m.name);r=a.nextNode(),i++}const u={tagNames:Array.from(n).sort(),attributeNames:Array.from(e).sort()};return c=u,d=t,u}chrome.runtime.onMessage.addListener((t,n,e)=>{switch(t.type){case"EVALUATE":e(I(t.query,t.mode));break;case"CLEAR":f(),e({success:!0});break;case"SCROLL_TO":b(t.index),e({success:!0});break;case"HIGHLIGHT":w(t.index),e({success:!0});break;case"UNHIGHLIGHT":N(),e({success:!0});break;case"GET_DOM_INFO":e(C());break}return!0});
