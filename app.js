let chosen=new Set(),pool=[],i=0,ans=[],lastChosen=[];
const N=Object.keys(SUBJECTS);
function show(x){document.querySelectorAll(".page").forEach(s=>s.classList.remove("active"));document.getElementById(x).classList.add("active");scrollTo({top:0,behavior:"smooth"})}
function home(){show("home")}
function subjectsPage(){render();show("subjects")}
function render(){grid.innerHTML=N.map(n=>{let s=SUBJECTS[n];return `<article class="subject ${chosen.has(n)?"selected":""}" onclick="toggle('${n}')"><div class="check">✓</div><div class="ico">${s.icon}</div><h3>${n}</h3><p>${s.desc}</p></article>`}).join("");sel.textContent=chosen.size?`${chosen.size} pelajaran dipilih.`:"Belum ada pilihan."}
function toggle(n){chosen.has(n)?chosen.delete(n):chosen.add(n);render()}
function startAll(){chosen=new Set(N);startSelected()}
function startSelected(){if(!chosen.size){alert("Pilih minimal satu pelajaran dulu ya 🌱");return}lastChosen=[...chosen];pool=[];chosen.forEach(n=>SUBJECTS[n].questions.forEach(q=>pool.push({...q,sub:n})));pool.sort(()=>Math.random()-.5);i=0;ans=[];show("quiz");draw()}
function draw(){let q=pool[i];meta.textContent=`Soal ${i+1}/${pool.length} • ${q.sub}`;bar.style.width=(i/pool.length*100)+"%";card.innerHTML=`<div class="qmeta"><span>${SUBJECTS[q.sub].icon} ${q.sub}</span><span>🔒 Kunci disembunyikan</span></div><div class="question">${q.q}</div><div class="options">${q.o.map((x,j)=>`<button class="option" onclick="pick(${j})"><b>${String.fromCharCode(65+j)}.</b> ${x}</button>`).join("")}</div><div class="next"><button id="next" class="primary hidden" onclick="next()">Lanjut →</button></div>`}
function pick(j){document.querySelectorAll(".option").forEach(x=>x.disabled=true);document.querySelectorAll(".option")[j].classList.add("pick");ans[i]=j;next.classList.remove("hidden")}
function next(){i++;i>=pool.length?finish():draw()}
function finish(){let score=pool.reduce((s,q,k)=>s+(ans[k]===q.a?1:0),0),pct=Math.round(score/pool.length*100);sc.textContent=score;tot.textContent="/"+pool.length;msg.textContent=pct>=90?"🔥 GILA BAGUS! Bismillah juara UISO!":pct>=75?"🌿 Mantap! Tinggal review yang salah.":pct>=60?"🧪 Lumayan! Gas latihan lagi.":"🌱 Jangan menyerah, belajar lagi dan coba ulang!";review.innerHTML=pool.map((q,k)=>{let ok=ans[k]===q.a;return `<div class="rev ${ok?"ok":"no"}"><b>${k+1}. ${ok?"✓ Benar":"✕ Belum tepat"} • ${q.sub}</b><div>${q.q}</div><small><b>Jawaban:</b> ${q.o[q.a]}<br><b>Pembahasan:</b> ${q.e}</small></div>`}).join("");show("result")}
function again(){chosen=new Set(lastChosen);startSelected()}
render();