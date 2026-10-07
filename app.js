
let currentPractice = [];
let practiceIndex = 0;
let practiceScore = 0;
let practiceAnswered = false;
let compRound = null, compQuestions = [], compIndex = 0, compScore = 0, compAnswered = false;

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));

function renderMaterial(){
  const box=document.getElementById('material-list');
  box.innerHTML=MATERIAL.sections.map(s=>`
    <article class="material-card"><h3>${s.title}</h3><ul>${s.points.map(x=>`<li>${x}</li>`).join('')}</ul></article>
  `).join('');
}
renderMaterial();

document.querySelectorAll('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    let f=btn.dataset.filter;
    let pool = [...PRELIM,...FINAL];
    if(f==='mcq') pool=pool.filter(q=>q.type==='mcq'&&!q.hots);
    if(f==='hots') pool=pool.filter(q=>q.hots);
    if(f==='short') pool=pool.filter(q=>q.type==='short');
    currentPractice=pool.sort(()=>Math.random()-.5);
    practiceIndex=0; practiceScore=0; practiceAnswered=false;
    renderPractice();
  });
});
currentPractice=[...PRELIM,...FINAL].sort(()=>Math.random()-.5);
renderPractice();

function renderPractice(){
  const box=document.getElementById('practice-box');
  if(practiceIndex>=currentPractice.length){
    box.innerHTML=`<div class="result"><div class="result-score">${practiceScore}/${currentPractice.length}</div><h3>Latihan selesai 🎉</h3><button class="primary" onclick="currentPractice.sort(()=>Math.random()-.5);practiceIndex=0;practiceScore=0;renderPractice()">Ulangi</button></div>`;
    return;
  }
  const q=currentPractice[practiceIndex];
  box.innerHTML=quizMarkup(q,practiceIndex+1,currentPractice.length,'practice');
}

function quizMarkup(q,num,total,mode){
  let body='';
  if(q.type==='mcq'){
    body=`<div class="options">${q.options.map((o,i)=>`<button class="option" onclick="answerMCQ(${i},'${mode}')"><b>${String.fromCharCode(65+i)}.</b> ${o}</button>`).join('')}</div>`;
  }else{
    body=`<input id="${mode}-answer" class="input-answer" placeholder="Ketik jawaban singkat...">
      <div style="margin-top:10px"><button class="primary" onclick="answerShort('${mode}')">Cek jawaban</button></div>`;
  }
  return `<div class="quiz-meta"><span>Soal ${num} / ${total}</span><span>${q.hots?'🔥 HOTS':'📘 Dasar'} • ${q.type==='short'?'Isian':'Pilihan Ganda'}</span></div>
  <div class="question">${q.question}</div>${body}<div id="${mode}-feedback"></div>
  <div class="quiz-footer"><span id="${mode}-score">${mode==='practice'?'Skor: '+practiceScore:''}</span><button id="${mode}-next" class="secondary hidden" onclick="nextQuestion('${mode}')">Soal berikutnya →</button></div>`;
}

function answerMCQ(i,mode){
  let q=mode==='practice'?currentPractice[practiceIndex]:compQuestions[compIndex];
  if((mode==='practice'?practiceAnswered:compAnswered))return;
  if(mode==='practice')practiceAnswered=true; else compAnswered=true;
  let buttons=document.querySelectorAll('#'+(mode==='practice'?'practice-box':'competition-box')+' .option');
  buttons.forEach((b,idx)=>{if(idx===q.answer)b.classList.add('correct');if(idx===i&&i!==q.answer)b.classList.add('wrong');b.disabled=true});
  let ok=i===q.answer;
  if(ok){if(mode==='practice')practiceScore++;else compScore++;}
  document.getElementById(mode+'-feedback').innerHTML=`<div class="explanation"><b>${ok?'Benar!':'Belum tepat.'}</b> ${q.explanation}</div>`;
  document.getElementById(mode+'-next').classList.remove('hidden');
  if(mode==='practice')document.getElementById('practice-score').textContent='Skor: '+practiceScore;
}
function normalize(s){return s.toLowerCase().trim().replace(/[.,!?]/g,'')}
function answerShort(mode){
  let q=mode==='practice'?currentPractice[practiceIndex]:compQuestions[compIndex];
  if((mode==='practice'?practiceAnswered:compAnswered))return;
  let val=normalize(document.getElementById(mode+'-answer').value);
  if(!val)return;
  let ok=q.accepted.some(a=>val.includes(normalize(a)));
  if(mode==='practice')practiceAnswered=true; else compAnswered=true;
  if(ok){if(mode==='practice')practiceScore++;else compScore++;}
  document.getElementById(mode+'-answer').disabled=true;
  document.getElementById(mode+'-feedback').innerHTML=`<div class="explanation"><b>${ok?'Benar!':'Jawaban perlu diperbaiki.'}</b> ${q.explanation}<br><small>Kata kunci: ${q.accepted.join(', ')}</small></div>`;
  document.getElementById(mode+'-next').classList.remove('hidden');
  if(mode==='practice')document.getElementById('practice-score').textContent='Skor: '+practiceScore;
}
function nextQuestion(mode){
  if(mode==='practice'){practiceIndex++;practiceAnswered=false;renderPractice();}
  else{compIndex++;compAnswered=false;renderCompetition();}
}

function startCompetition(round){
  compRound=round;
  compQuestions=round==='prelim'?[...PRELIM]:[...FINAL];
  compIndex=0;compScore=0;compAnswered=false;
  document.getElementById('competition-menu').classList.add('hidden');
  document.getElementById('competition-box').classList.remove('hidden');
  renderCompetition();
}
function renderCompetition(){
  const box=document.getElementById('competition-box');
  if(compIndex>=compQuestions.length){
    const pct=Math.round(compScore/compQuestions.length*100);
    box.innerHTML=`<div class="result"><div class="eyebrow">${compRound==='prelim'?'PENYISIHAN':'FINAL'} SELESAI</div><div class="result-score">${compScore}/${compQuestions.length}</div><h3>${pct}% benar</h3><p>${pct>=80?'🔥 Mantap! Kamu sudah punya modal kuat.':'🌱 Jangan berhenti—review materi dan coba lagi.'}</p><button class="primary" onclick="resetCompetition()">Kembali ke pilihan babak</button></div>`;
    return;
  }
  const q=compQuestions[compIndex];
  box.innerHTML=quizMarkup(q,compIndex+1,compQuestions.length,'competition');
}
function resetCompetition(){
  document.getElementById('competition-menu').classList.remove('hidden');
  document.getElementById('competition-box').classList.add('hidden');
}
