(function(){
const root=document.documentElement,tb=document.querySelectorAll('.theme button');
function theme(t){root.dataset.theme=t;tb.forEach(b=>b.setAttribute('aria-pressed',b.dataset.theme===t))}
theme(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
tb.forEach(b=>b.onclick=()=>theme(b.dataset.theme));
const T=document.getElementById('toast');let tm;
function say(m){T.textContent=m;T.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>T.classList.remove('on'),2600)}
const K=['id','name','role','city','exp','notice','ctc','src','rec','applied','status'];
const D=[['C-1042','Pranshu Sharma','Backend Engineer','Ahmedabad',4,30,18,'LinkedIn','Riya Shah','2026-11-12','Active'],
['C-1043','Ananya Iyer','Senior Backend Engineer – Payments Platform (Contract)','Bengaluru',8,60,42.5,'Referral','Karan Mehta','2026-11-10','Pending'],
['C-1044','Rohan Desai','Frontend Engineer','Pune',3,null,14,'Careers page','Riya Shah','2026-11-09','Rejected'],
['C-1045','Meera Nair','UI Designer','Mumbai',0,15,0,'Campus','Neha Joshi','2026-11-08','Draft'],
['C-1046','Vikram Patel','DevOps Engineer','Ahmedabad',6,45,26,'Agency','Karan Mehta','2026-11-06','On hold'],
['C-1047','Sara Khan','QA Engineer','Hyderabad',5,30,16,'LinkedIn','Neha Joshi','2026-11-05','New'],
['C-1048','Arjun Rao','Data Analyst','Chennai',2,0,9.5,'Referral','Riya Shah','2026-11-03','Active'],
['C-1049','Ishita Gupta','Product Manager','Delhi',7,90,38,'Agency','Karan Mehta','2026-11-02','Pending'],
['C-1050','Dev Malhotra','Backend Engineer','Surat',1,15,8,'Careers page','Neha Joshi','2026-10-30','Archived'],
['C-1051','Tanvi Shah','Support Engineer','Ahmedabad',3,30,11,'Campus','Riya Shah','2026-10-28','Rejected']]
.map(r=>Object.fromEntries(K.map((k,i)=>[k,r[i]]).concat([['dis',r[10]==='Archived']])));
const BM={Active:'suc',Pending:'war',Rejected:'err','On hold':'inf',New:'pri',Draft:'neu',Archived:'neu'};
const L={sel:'',name:'Candidate',role:'Role',city:'City',exp:'Experience',notice:'Notice period',ctc:'Expected CTC',src:'Source',rec:'Recruiter',applied:'Applied on',status:'Status',acts:'Actions',st:'Row state'};
const NUM=['exp','notice','ctc'],NS=['sel','acts','st'];
const ic=n=>`<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const fmt={exp:v=>v+' yrs',notice:v=>v==null?'<span class="nil" title="Not provided">—</span>':v===0?'Immediate':v+' days',
ctc:v=>v===0?'<span class="nil">Not set</span>':'₹ '+v+' L',applied:v=>new Date(v).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})};
function acts(r,m){const d=r.dis?'disabled':'';const b=(a,c,i,l)=>`<button type="button" class="btn ${c}${m==='icon'?' i':''}" data-act="${a}" data-n="${r.name}" ${d} aria-label="${l} ${r.name}" title="${l}">${ic(i)}${m==='icon'?'':l}</button>`;
return `<div class="acts">${b('View','v','eye','View')}${b('Edit','','pen','Edit')}${b('Delete','d','trash','Delete')}</div>`}
function mount(el,c){
const s={q:'',k:null,d:0,p:0,sel:new Set()};const per=c.per||99;
const cls=(k,h)=>(k==='sel'?'cb ':'')+(NUM.includes(k)?'num ':'')+(c.stick?(k==='sel'?'sl ':k==='name'?'sl2 ':k==='acts'?'sr ':''):'');
const th=(k,i)=>{const lab=c.lab?c.lab[i]:L[k],f=c.hf?c.hf[i]:'';const a=f==='asc'?'ascending':f==='desc'?'descending':s.k===k&&s.d?(s.d>0?'ascending':'descending'):'';
if(k==='sel')return `<th class="${cls(k)}" scope="col"><label class="check"><input type="checkbox" data-all aria-label="Select all rows"></label></th>`;
if(NS.includes(k))return `<th class="${cls(k)}" scope="col">${lab}</th>`;
return `<th class="${cls(k)}" scope="col"${a?` aria-sort="${a}"`:''}><button type="button" class="sb ${f.startsWith('is-')?f:''}" data-k="${k}">${lab}<svg class="sort" aria-hidden="true"><path class="u" d="m8 10 4-4 4 4"/><path class="d" d="m8 14 4 4 4-4"/></svg></button></th>`};
const td=(k,r,i)=>{let h;
if(k==='sel')h=`<label class="check"><input type="checkbox" data-id="${r.id}" aria-label="Select ${r.name}" ${s.sel.has(r.id)?'checked':''} ${r.dis?'disabled':''}></label>`;
else if(k==='name')h=`<a href="#" class="lnk" data-n="${r.name}">${r.name}</a>`;
else if(k==='role')h=`<span class="trunc" title="${r.role}">${r.role}</span>`;
else if(k==='status')h=`<span class="badge b-${BM[r.status]}">${r.status}</span>`;
else if(k==='acts')h=acts(r,c.acts);else if(k==='st')h=c.rowLab[i];else h=fmt[k]?fmt[k](r[k]):r[k];
return `<td class="${cls(k)}">${h}</td>`};
const esc=v=>v.replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
function draw(){
const fa=document.activeElement,key=fa&&el.contains(fa)?(fa.dataset.id?`[data-id="${fa.dataset.id}"]`:fa.hasAttribute('data-all')?'[data-all]':fa.dataset.k?`[data-k="${fa.dataset.k}"]`:fa.dataset.pg?`[data-pg="${fa.dataset.pg}"]`:''):'';
let all=(c.rows||D).slice(0,c.n||10).filter(r=>!s.q||(r.name+r.role).toLowerCase().includes(s.q));
if(s.k&&s.d)all=[...all].sort((a,b)=>{const x=a[s.k],y=b[s.k];if(x==null)return 1;if(y==null)return -1;return(typeof x==='number'?x-y:String(x).localeCompare(y))*s.d});
const pages=Math.max(1,Math.ceil(all.length/per));s.p=Math.min(s.p,pages-1);const rows=all.slice(s.p*per,(s.p+1)*per);
const st=c.state||(all.length?'':'none');const n=c.cols.length;
const S={loading:'',empty:`<div class="state">${ic('inbox')}<h3>No candidates yet</h3><p>Add a candidate to start tracking applications.</p><button class="btn solid" data-act="Add">Add candidate</button></div>`,
none:`<div class="state">${ic('search')}<h3>No results for “${esc(s.q)}”</h3><p>Check the spelling or clear the search.</p><button class="btn" data-clear>Clear search</button></div>`,
error:`<div class="state err">${ic('alert')}<h3>We could not load candidates</h3><p>Check your connection and try again.</p><button class="btn" data-act="Retry">Try again</button></div>`};
let body;
if(st==='loading')body=[...Array(5)].map(()=>`<tr>${c.cols.map((k,i)=>`<td class="${cls(k)}">${k==='sel'?'':`<span class="sk" style="width:${[70,120,90,60][i%4]}px"></span>`}</td>`).join('')}</tr>`).join('');
else if(st)body=`<tr><td colspan="${n}" style="padding:0;height:auto">${S[st]}</td></tr>`;
else body=rows.map((r,i)=>{const f=c.force&&c.force[i]||'';return `<tr class="${[c.click&&!r.dis?'clickable':'',s.sel.has(r.id)?'is-sel':'',r.dis?'is-dis':'',f].join(' ')}" data-n="${r.name}">${c.cols.map(k=>td(k,r,i)).join('')}</tr>`}).join('');
const sc=s.sel.size;
el.querySelector('[data-body]').innerHTML=`<div class="bulk" role="status" ${sc?'':'hidden'}><strong>${sc} selected</strong><button class="btn" data-act="Export">${ic('dl')}Export</button><button class="btn d" data-act="Delete selected">${ic('trash')}Delete</button><button class="btn" data-sel-clear>Clear</button></div>
<div class="scroll" tabindex="0" role="region" aria-label="${c.name} table, scrollable"><table${st==='loading'?' aria-busy="true"':''}><caption class="sr" style="position:absolute;left:-9999px">${c.name}</caption><thead><tr>${c.cols.map(th).join('')}</tr></thead><tbody>${body}</tbody></table></div>`+
(c.per?`<div class="foot"><span>${all.length?s.p*per+1:0}–${s.p*per+rows.length} of ${all.length}</span><span class="acts"><button class="btn i" data-pg="-1" aria-label="Previous page" ${s.p?'':'disabled'}>${ic('l')}</button><button class="btn i" data-pg="1" aria-label="Next page" ${s.p<pages-1?'':'disabled'}>${ic('r')}</button></span></div>`:'');
const a=el.querySelector('[data-all]');if(a){const ids=rows.filter(r=>!r.dis).map(r=>r.id),k=ids.filter(i=>s.sel.has(i)).length;a.checked=ids.length&&k===ids.length;a.indeterminate=k>0&&k<ids.length}
if(key){const f=el.querySelector(key);if(f&&!f.disabled)f.focus()}}
el.innerHTML=`<div class="tw${c.dense?' dense':''}">${c.tools?`<div class="bar"><input class="sinput" type="search" placeholder="Search name or role" aria-label="Search candidates"><span class="gap"></span>${c.dens?'<span class="seg" role="group" aria-label="Row density"><button type="button" data-dens="" aria-pressed="true">Comfortable</button><button type="button" data-dens="dense" aria-pressed="false">Compact</button></span>':''}<button class="btn" data-act="Export">${ic('dl')}Export</button><button class="btn solid" data-act="Add">Add candidate</button></div>`:''}<div data-body></div></div>`;
draw();const w=el.firstChild;
el.addEventListener('input',e=>{if(e.target.matches('.sinput')){s.q=e.target.value.trim().toLowerCase();s.p=0;draw()}});
el.addEventListener('click',e=>{const t=e.target;let x;
if(x=t.closest('.sb')){const k=x.dataset.k;s.d=s.k===k?(s.d===1?-1:s.d===-1?0:1):1;s.k=k;draw();return}
if(x=t.closest('[data-dens]')){w.classList.toggle('dense',!!x.dataset.dens);el.querySelectorAll('[data-dens]').forEach(b=>b.setAttribute('aria-pressed',b===x));return}
if(x=t.closest('[data-pg]')){s.p+=+x.dataset.pg;draw();return}
if(t.closest('[data-clear]')){s.q='';el.querySelector('.sinput').value='';draw();return}
if(t.closest('[data-sel-clear]')){s.sel.clear();draw();return}
if(x=t.closest('[data-act]')){if(x.disabled)return;say(x.dataset.n?x.dataset.act+': '+x.dataset.n:x.dataset.act+' (demo)');return}
if(t.matches('input[data-all]')){const ids=[...el.querySelectorAll('input[data-id]:not(:disabled)')].map(i=>i.dataset.id);ids.forEach(i=>t.checked?s.sel.add(i):s.sel.delete(i));draw();return}
if(t.matches('input[data-id]')){t.checked?s.sel.add(t.dataset.id):s.sel.delete(t.dataset.id);draw();return}
if(t.closest('.check'))return;
if(x=t.closest('a.lnk')){e.preventDefault();say('Opened '+x.dataset.n);return}
if((x=t.closest('tr.clickable'))&&!t.closest('button,a,input'))say('Opened '+x.dataset.n)})}
const C={
four:{name:'Candidates',cols:['name','role','status','acts'],acts:'text',n:6},
sel:{name:'Candidates with selection',cols:['sel','name','role','applied','status'],click:1,tools:1,per:5,dens:0},
wide:{name:'Candidates, all columns',cols:['sel','name','role','city','exp','notice','ctc','src','rec','applied','status','acts'],stick:1,tools:1,dens:1,acts:'icon',click:1},
hdr:{name:'Header states',cols:['name','role','city','exp','status'],lab:['Default','Hover','Focus','Ascending','Descending'],hf:['','is-hover','is-focus','asc','desc'],n:2},
rows:{name:'Row states',cols:['st','name','role','status','acts'],rowLab:['Default','Hover','Selected','Focus','Disabled'],force:{1:'is-hover',2:'is-sel',3:'is-focus'},acts:'icon',n:5,order:[0,1,2,3,8]},
loading:{name:'Loading',cols:['name','role','status','acts'],state:'loading'},
empty:{name:'Empty',cols:['name','role','status','acts'],state:'empty'},
error:{name:'Error',cols:['name','role','status','acts'],state:'error'}};
C.rows.n=undefined;
document.querySelectorAll('[data-t]').forEach(e=>{const c=C[e.dataset.t];if(e.dataset.t==='rows'){const o=[0,1,2,3,8];c.rows=o.map(i=>D[i])}mount(e,c)});
})();
