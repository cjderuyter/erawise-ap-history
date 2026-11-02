// Audit helper: compares a PDF on the EraWise site against the text of the current page.
// Loaded into the page with fetch()+Function; defines window.__cmp(pdfName, selector).
async function __load(src){ await new Promise((ok,bad)=>{ const s=document.createElement('script'); s.src=src; s.onload=ok; s.onerror=()=>bad(new Error('load '+src)); document.head.appendChild(s); }); }
window.__norm = t => (t.replace(/\[\s*\.\s*\.\s*\.\s*\]|…|\*\s*\*\s*\*|\.\s\.\s\./g,' ELLIPSIS ').normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[’‘`´]/g,"'").replace(/[—–‑]/g,' ').replace(/&/g,' and ').replace(/ELLIPSIS/g,' zzellipsis ').toLowerCase().match(/[a-z0-9']+/g)||[]).map(w=>w.replace(/^'+|'+$/g,'')).filter(w=>w);
window.__pdfText = async function(name){
  if(!window.pdfjsLib){ await __load('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
  const url = name.startsWith('http') ? name : 'https://cjderuyter.github.io/erawise-ap-history/files/documents/' + name;
  const buf = await (await fetch(url)).arrayBuffer();
  const doc = await pdfjsLib.getDocument({data: buf}).promise;
  let t = '';
  for(let i=1;i<=doc.numPages;i++){ const pg=await doc.getPage(i); const tc=await pg.getTextContent(); t += tc.items.map(it=>it.str+(it.hasEOL?'\n':' ')).join('') + '\n'; }
  return t;
};
window.__cmp = async function(pdfName, sel, maxChanges){
  if(!window.Diff){ await __load('https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.1.0/diff.min.js'); }
  const srcEl = sel ? document.querySelector(sel) : document.body;
  const S = __norm(srcEl.innerText), P = __norm(await __pdfText(pdfName));
  const parts = Diff.diffArrays(S, P);
  let pos=0, firstC=-1, lastC=-1, ppos=0, pFirst=-1, pLast=-1;
  for(const p of parts){ if(!p.added && !p.removed && p.value.length>=6){ if(firstC<0){firstC=pos; pFirst=ppos;} lastC=pos+p.value.length; pLast=ppos+p.value.length; } if(!p.added) pos+=p.value.length; if(!p.removed) ppos+=p.value.length; }
  let changes=[], common=0, commons=[]; pos=0;
  for(const p of parts){
    const n=p.value.length, inside = pos>=firstC && pos<lastC;
    if(p.added){ if(inside) changes.push(['PDF+', pos, n, p.value.slice(0,12).join(' ')]); }
    else if(p.removed){ if(inside) changes.push(['SRC+', pos, n, p.value.slice(0,12).join(' ')]); pos+=n; }
    else { common+=n; if(n>=6) commons.push([pos,n]); pos+=n; }
  }
  // a PDF-side "zzellipsis" marks a cut: SRC+ chunks on either side of it count as MARKED cuts
  const out=[]; for(let i=0;i<changes.length;i++){ const c=changes[i]; if(c[0]=='PDF+' && c[3]=='zzellipsis' && c[2]==1){ for(const nb of [changes[i-1],changes[i+1]]) if(nb && nb[0]=='SRC+') nb[0]='CUT(marked)'; continue; } out.push(c); }
  return {pdf:pdfName, pdfWords:P.length, srcWords:S.length, span:[firstC,lastC], pdfSpan:[pFirst,pLast], common:common,
          pdfOnly: out.filter(c=>c[0]=='PDF+').reduce((a,c)=>a+c[2],0), unmarkedOmitted: out.filter(c=>c[0]=='SRC+').reduce((a,c)=>a+c[2],0),
          commons: commons, markedCut: out.filter(c=>c[0]=='CUT(marked)').reduce((a,c)=>a+c[2],0), n: out.length, changes: out.slice(0, maxChanges||40)};
};
window.__both = async function(slug, sel, maxChanges){ return [await __cmp(slug+'-full-text.pdf', sel, maxChanges), await __cmp(slug+'-excerpt.pdf', sel, maxChanges)]; };
"cmp loaded";
