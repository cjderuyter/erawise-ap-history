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
    if(p.added){ if(inside && ppos>=pFirst && ppos<pLast) ch.push('PDF+ @'+pos+' x'+n+': '+p.value.slice(0,12).join(' ')); ppos+=n; }
    else if(p.removed){ if(inside) ch.push('SRC+ @'+pos+' x'+n+': '+p.value.slice(0,12).join(' ')); pos+=n; }
    else { if(pos>=firstC && pos<lastC){ common+=n; if(n>=8) commons.push([pos,n]); } pos+=n; ppos+=n; }
  }
  return {fragWords:F.length, srcSpan:[firstC,lastC], matched:common, pdfOnly: ch.filter(c=>c.startsWith('PDF+')).reduce((a,c)=>a+ +c.match(/x(\d+):/)[1],0), omitted: ch.filter(c=>c.startsWith('SRC+')).reduce((a,c)=>a+ +c.match(/x(\d+):/)[1],0), headUnmatched: pFirst, tailUnmatched: F.length-pLast, n: ch.length, changes: ch.slice(0, max||25)};
};
window.__span = function(S, F, K){ // locate fragment F in S: densest window of K-gram hits
  K=K||8; if(!window.__gramCache || window.__gramCache.S!==S){ const m=new Map(); for(let i=0;i+K<=S.length;i++){ const g=S.slice(i,i+K).join(' '); if(!m.has(g)) m.set(g,i); } window.__gramCache={S:S,m:m}; }
  const m=window.__gramCache.m; const hits=[]; for(let i=0;i+K<=F.length;i++){ const p=m.get(F.slice(i,i+K).join(' ')); if(p!==undefined) hits.push(p); }
  if(!hits.length) return [-1,-1]; hits.sort((a,b)=>a-b); const W=Math.max(400, F.length*3); let best=0, bi=0, j=0;
  for(let i=0;i<hits.length;i++){ while(hits[j]<hits[i]-W) j++; if(i-j+1>best){best=i-j+1; bi=i;} }
  let hi=hits[bi]+K, lo=hi-W-K; while(bi>0 && hits[bi-1]>=lo) bi--; lo=hits[bi]; return [lo,hi];
};
window.__cmp = async function(pdfName, sel, max){
  if(!window.Diff){ await __load('https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js'); }
  const srcEl = sel ? document.querySelector(sel) : document.body;
  const S = __norm(srcEl.innerText);
  const raw = await __pdfText(pdfName);
  const frags = raw.split(__DIV).map(__norm).filter(f=>f.length>3);
  const res = frags.map(f=>{
    let off=0, Ssub=S;
    if(S.length>3000){ const [lo,hi]=__span(S,f,8); if(lo<0) return {fragWords:f.length, srcSpan:[-1,-1], matched:0, note:'no 8-gram of this fragment found in source'}; off=Math.max(0,lo-60); Ssub=S.slice(off, Math.min(S.length,hi+60)); if(Ssub.length>20000) return {fragWords:f.length, srcSpan:[lo,hi], note:'region too large for diff'}; }
    const r=__matchFrag(Ssub, f, max); r.srcSpan=r.srcSpan.map(x=>x<0?x:x+off); r.changes=r.changes.map(c=>c.replace(/@(\d+)/, (m,d)=>'@'+(+d+off))); return r;
  });
  return {pdf:pdfName, srcWords:S.length, pdfWords:__norm(raw).length, fragments:frags.length, frags:res};
};
// fast mode for huge sources: 8-gram coverage, no diff. Reports stretches of the PDF not found in the source.
window.__fast = async function(pdfName, sel, K){
  K = K||8; const srcEl = sel ? document.querySelector(sel) : document.body;
  const S = __norm(srcEl.innerText); const grams = new Map(); for(let i=0;i+K<=S.length;i++){ const g=S.slice(i,i+K).join(' '); if(!grams.has(g)) grams.set(g,i); }
  const raw = await __pdfText(pdfName); const frags = raw.split(__DIV).map(__norm).filter(f=>f.length>3);
  return {pdf:pdfName, srcWords:S.length, fragments:frags.length, frags: frags.map(F=>{
    const hit = new Array(F.length).fill(false), pos=new Array(F.length).fill(-1);
    for(let i=0;i+K<=F.length;i++){ const p=grams.get(F.slice(i,i+K).join(' ')); if(p!==undefined){ pos[i]=p; for(let j=i;j<i+K;j++) hit[j]=true; } }
    const miss=[], jumps=[]; let i=0; while(i<F.length){ if(!hit[i]){ let j=i; while(j<F.length && !hit[j]) j++; miss.push('@'+i+' x'+(j-i)+': '+F.slice(i,Math.min(j,i+12)).join(' ')); i=j; } else i++; }
    for(let i=0;i+1<F.length;i++){ if(pos[i]>=0 && pos[i+1]>=0 && pos[i+1]!==pos[i]+1) jumps.push('@'+(i+K)+' src '+pos[i]+'->'+pos[i+1]+' (gap '+(pos[i+1]-pos[i]-1)+'): …'+F.slice(i+K-3,i+K+3).join(' ')); }
    const first = pos.find(p=>p>=0), lastIdx = pos.map((p,i)=>p>=0?i:-1).filter(i=>i>=0).pop();
    return {fragWords:F.length, covered: hit.filter(x=>x).length, srcSpan:[first, lastIdx>=0?pos[lastIdx]+K:-1], missStretches: miss.length, miss: miss.slice(0,15), jumps: jumps.slice(0,15)};
  })};
};
window.__both = async function(base, sel, max){ return [await __cmp(base+'_FULL_TEXT.pdf', sel, max), await __cmp(base+'_EXCERPT.pdf', sel, max)]; };
"cmp loaded";
