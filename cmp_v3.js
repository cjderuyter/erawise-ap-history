// Audit helper: compares a PDF (from the audit branch) against the text of the current page.
// Loaded into the page with fetch()+Function; defines window.__cmp(pdfFile, selector) and window.__both(slugBase, selector).
async function __load(src){ await new Promise((ok,bad)=>{ const s=document.createElement('script'); s.src=src; s.onload=ok; s.onerror=()=>bad(new Error('load '+src)); document.head.appendChild(s); }); }
window.__DIV = /\[\s*\.\s*\.\s*\.\s*\]|\[\s*…\s*\]|…|\*\s*\*\s*\*|(?:^|\s)\.\s\.\s\.(?:\s|$)/g;
window.__norm = t => (t.normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[’‘`´]/g,"'").replace(/[—–‑]/g,' ').replace(/&/g,' and ').toLowerCase().match(/[a-z0-9']+/g)||[]).map(w=>w.replace(/^'+|'+$/g,'')).filter(w=>w);
window.__pdfText = async function(name){
  if(!window.pdfjsLib){ await __load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
  const url = name.startsWith('http') ? name : 'https://raw.githubusercontent.com/cjderuyter/erawise-ap-history/audit-tools/docs/' + encodeURIComponent(name);
  const r = await fetch(url); if(!r.ok) throw new Error('pdf fetch '+r.status+' '+url);
  const doc = await pdfjsLib.getDocument({data: await r.arrayBuffer()}).promise;
  let t = '';
  for(let i=1;i<=doc.numPages;i++){ const pg=await doc.getPage(i); const tc=await pg.getTextContent(); t += tc.items.map(it=>it.str+(it.hasEOL?'\n':' ')).join('') + '\n'; }
  return t;
};
// match one fragment F (word array) inside source S: returns span and the differences inside it
window.__matchFrag = function(S, F, max){
  const parts = Diff.diffArrays(S, F);
  let pos=0, firstC=-1, lastC=-1, pFirst=-1, pLast=-1, ppos=0;
  for(const p of parts){ if(!p.added && !p.removed && p.value.length>=8){ if(firstC<0){firstC=pos; pFirst=ppos;} lastC=pos+p.value.length; pLast=ppos+p.value.length; } if(!p.added) pos+=p.value.length; if(!p.removed) ppos+=p.value.length; }
  let ch=[], common=0, commons=[]; pos=0; ppos=0;
  for(const p of parts){
    const n=p.value.length, inside = pos>firstC && pos<lastC;
    if(p.added){ if(inside && ppos>=pFirst && ppos<pLast) ch.push(['PDF+', pos, n, p.value.slice(0,12).join(' ')]); ppos+=n; }
    else if(p.removed){ if(inside) ch.push(['SRC+', pos, n, p.value.slice(0,12).join(' ')]); pos+=n; }
    else { if(pos>=firstC && pos<lastC){ common+=n; if(n>=8) commons.push([pos,n]); } pos+=n; ppos+=n; }
  }
  return {fragWords:F.length, srcSpan:[firstC,lastC], matched:common, pdfOnly: ch.filter(c=>c[0]=='PDF+').reduce((a,c)=>a+c[2],0), omitted: ch.filter(c=>c[0]=='SRC+').reduce((a,c)=>a+c[2],0), n: ch.length, changes: ch.slice(0, max||25)};
};
window.__cmp = async function(pdfName, sel, max){
  if(!window.Diff){ await __load('https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js'); }
  const srcEl = sel ? document.querySelector(sel) : document.body;
  const S = __norm(srcEl.innerText);
  const raw = await __pdfText(pdfName);
  const frags = raw.split(__DIV).map(__norm).filter(f=>f.length>3);
  const res = frags.map(f=>__matchFrag(S, f, max));
  return {pdf:pdfName, srcWords:S.length, pdfWords:__norm(raw).length, fragments:frags.length, frags:res};
};
window.__both = async function(base, sel, max){ return [await __cmp(base+'_FULL_TEXT.pdf', sel, max), await __cmp(base+'_EXCERPT.pdf', sel, max)]; };
"cmp loaded";
