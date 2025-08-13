// ЛОГИКА ИГРЫ + АНИМАЦИИ + ТРЕКЕР СООТВЕТСТВИЯ
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const state = {
  stageIndex: 0,
  eventIndex: 0,
  patients: 30,
  staff: 30,
  finance: 30,
  maturity: 10,
  log: [],
  unlocked: {}
};

function clamp(v){ return Math.max(0, Math.min(100, v)); }

function animateNumber(el, from, to, ms=350){
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t - start)/ms);
    const val = Math.round(from + (to-from)*p);
    el.textContent = val;
    if (p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function renderMeters(diff=null){
  const m = (barId,numId,val)=>{
    const bar = document.querySelector(barId);
    const num = document.querySelector(numId);
    const from = parseInt(num.textContent||'0',10);
    bar.style.width = Math.round(val)+'%';
    animateNumber(num, from, Math.round(val));
  };
  m('#m_patients', '#num_patients', state.patients);
  m('#m_staff', '#num_staff', state.staff);
  m('#m_finance', '#num_finance', state.finance);
  m('#m_maturity', '#num_maturity', state.maturity);

  if (diff){
    for (const k of ['patients','staff','finance','maturity']){
      const bar = document.querySelector('#m_'+k);
      bar.parentElement.classList.remove('pulse','shake');
      void bar.parentElement.offsetWidth;
      if (diff[k]>0) bar.parentElement.classList.add('pulse');
      if (diff[k]<0) bar.parentElement.classList.add('shake');
    }
  }
}

function logLine(text){
  state.log.unshift(text);
  const li = document.createElement('li');
  li.textContent = text;
  $('#logList').prepend(li);
}

function applyEffects(effects, label){
  const before = {...state};
  state.patients = clamp(state.patients + (effects.patients||0));
  state.staff    = clamp(state.staff    + (effects.staff||0));
  state.finance  = clamp(state.finance  + (effects.finance||0));
  state.maturity = clamp(state.maturity + (effects.maturity||0));
  const diff = {
    patients: (effects.patients||0),
    staff: (effects.staff||0),
    finance: (effects.finance||0),
    maturity: (effects.maturity||0),
  };
  renderMeters(diff);
  logLine(label + ` [Δ P:${diff.patients||0} S:${diff.staff||0} F:${diff.finance||0} M:${diff.maturity||0}]`);
}

function currentStage(){ return GAME_CONTENT.stages[state.stageIndex]; }
function currentEvent(){ return currentStage().events[state.eventIndex]; }

function renderStage(){
  const st = currentStage();
  $('#stageTitle').textContent = st.title;
  $('#stageIntro').textContent = st.intro;
  $('#badgeStage').textContent = `Этап ${state.stageIndex+1}`;
}

let selectedChoiceIndex = null;

function renderEvent(){
  const ev = currentEvent();
  $('#eventTitle').textContent = ev.title;
  $('#eventText').textContent = ev.text;
  $('#hint').textContent = '';
  $('#choices').innerHTML = '';
  selectedChoiceIndex = null;
  $('#btnNext').disabled = true;

  ev.choices.forEach((ch, idx)=>{
    const div = document.createElement('div');
    div.className = 'choice';
    div.tabIndex = 0;
    div.style.animationDelay = (idx*60)+'ms';
    div.textContent = ch.text;
    div.addEventListener('click', ()=>selectChoice(idx));
    div.addEventListener('keypress', e=>{ if(e.key==='Enter' || e.key===' ') selectChoice(idx); });
    $('#choices').appendChild(div);
  });
}

function selectChoice(idx){
  selectedChoiceIndex = idx;
  $$('.choice').forEach((el,i)=> el.classList.toggle('selected', i===idx));
  const hint = currentEvent().choices[idx].hint || '';
  $('#hint').textContent = hint ? 'Подсказка: ' + hint : '';
  $('#btnNext').disabled = false;
}

function unlockKeys(keys){
  if (!keys) return;
  let newly = 0;
  keys.forEach(k=>{
    if (!state.unlocked[k]){ state.unlocked[k] = true; newly++; }
  });
  if (newly>0){ confettiBurst(); updateBoard(); }
}

function maybeRandomEvent(){
  if (Math.random() < 0.30){
    const rnd = GAME_CONTENT.randomEvents[Math.floor(Math.random()*GAME_CONTENT.randomEvents.length)];
    return new Promise(resolve=>{
      const overlay = document.createElement('div');
      overlay.style.position='fixed';
      overlay.style.inset='0';
      overlay.style.background='rgba(0,0,0,.6)';
      overlay.style.display='flex';
      overlay.style.alignItems='center';
      overlay.style.justifyContent='center';
      overlay.style.zIndex='9999';

      const card = document.createElement('div');
      card.className = 'card';
      card.style.maxWidth='600px';
      card.style.width='92%';
      card.innerHTML = `<h3>${rnd.title}</h3><p>${rnd.text}</p>`;

      const btns = document.createElement('div');
      btns.style.display='grid';
      btns.style.gap='8px';
      rnd.choices.forEach(ch=>{
        const b = document.createElement('button');
        b.textContent = ch.text;
        b.addEventListener('click', ()=>{
          applyEffects(ch.effects, `Случайное событие: ${rnd.title} — ${ch.text}`);
          document.body.removeChild(overlay);
          resolve();
        });
        btns.appendChild(b);
      });
      card.appendChild(btns);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    });
  }
  return Promise.resolve();
}

function next(){
  if (selectedChoiceIndex===null) return;
  const ev = currentEvent();
  const ch = ev.choices[selectedChoiceIndex];
  applyEffects(ch.effects, `${ev.title}: ${ch.text}`);
  unlockKeys(ch.unlocks);

  if (state.eventIndex < currentStage().events.length - 1){
    state.eventIndex += 1;
    renderEvent();
  } else {
    state.stageIndex += 1;
    state.eventIndex = 0;

    if (state.stageIndex >= GAME_CONTENT.stages.length){
      showEnding();
      return;
    }
    maybeRandomEvent().then(()=>{
      renderStage();
      renderEvent();
    });
  }
}

function showEnding(){
  const s = {patients: state.patients, staff: state.staff, finance: state.finance, maturity: state.maturity};
  const ending = GAME_CONTENT.endings.find(e=>e.condition(s));

  const overlay = document.createElement('div');
  overlay.style.position='fixed'; overlay.style.inset='0';
  overlay.style.background='rgba(0,0,0,.7)';
  overlay.style.display='flex'; overlay.style.alignItems='center'; overlay.style.justifyContent='center';
  overlay.style.zIndex='9999';

  const card = document.createElement('div');
  card.className = 'card';
  card.style.maxWidth='640px'; card.style.width='92%';
  card.innerHTML = `<h2>${ending.title}</h2>
                    <p>${ending.text}</p>
                    <p><b>Показатели:</b> Пациенты ${Math.round(state.patients)}%, Персонал ${Math.round(state.staff)}%, Финансы ${Math.round(state.finance)}%, Зрелость ${Math.round(state.maturity)}%.</p>`;

  const restart = document.createElement('button');
  restart.textContent = 'Начать заново';
  restart.addEventListener('click', ()=>{
    document.body.removeChild(overlay);
    reset();
  });
  card.appendChild(restart);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  confettiBurst(300);
}

function save(){
  localStorage.setItem('hospital_pc_save_v2', JSON.stringify(state));
  logLine('Игра сохранена.');
}
function load(){
  const raw = localStorage.getItem('hospital_pc_save_v2');
  if (!raw){ logLine('Нет сохранений.'); return; }
  const obj = JSON.parse(raw);
  Object.assign(state, obj);
  renderMeters();
  renderStage();
  renderEvent();
  updateBoard();
  logLine('Сохранение загружено.');
}
function reset(){
  state.stageIndex = 0;
  state.eventIndex = 0;
  state.patients = 30;
  state.staff = 30;
  state.finance = 30;
  state.maturity = 10;
  state.log = [];
  state.unlocked = {};
  $('#logList').innerHTML='';
  renderMeters();
  renderStage();
  renderEvent();
  updateBoard();
}

// ====== ТРЕКЕР СООТВЕТСТВИЯ ICI ======
function updateBoard(){
  const list = $('#boardList');
  list.innerHTML='';
  STANDARD_MAP.forEach(it=>{
    const li = document.createElement('li');
    li.className = 'board-item';
    const ok = !!state.unlocked[it.id];
    const status = ok ? 'ok' : 'mid';
    const label = ok ? 'Выполняется' : 'В процессе';
    li.innerHTML = `<div class="status ${status}">●</div>
                    <div>
                      <div><b>${it.title}</b> <small>(${it.section})</small></div>
                      <div class="muted">${it.req}</div>
                      <small class="muted">Ключ: ${it.id}</small>
                    </div>`;
    list.appendChild(li);
  });
}

function bindBoard(){
  $('#btnBoard').addEventListener('click', ()=>{
    updateBoard();
    $('#board').classList.remove('hidden');
  });
  $('#btnBoardClose').addEventListener('click', ()=>{
    $('#board').classList.add('hidden');
  });
}

// ====== Конфетти ======
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];

function resizeCanvas(){
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function confettiBurst(n=120){
  const colors = ['#7aa3ff','#2de2ff','#47ffa3','#ffd76b','#ff6b6b'];
  for (let i=0;i<n;i++){
    confettiPieces.push({
      x: Math.random()*confettiCanvas.width,
      y: -10,
      vx: (Math.random()-0.5)*2,
      vy: Math.random()*3+2,
      size: Math.random()*4+2,
      color: colors[Math.floor(Math.random()*colors.length)],
      life: Math.random()*60+60
    });
  }
}

function confettiLoop(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p=>{
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size*0.6);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.life--;
  });
  confettiPieces = confettiPieces.filter(p=>p.life>0 && p.y<confettiCanvas.height+20);
  requestAnimationFrame(confettiLoop);
}
confettiLoop();

function bindUI(){
  $('#btnNext').addEventListener('click', next);
  $('#btnSave').addEventListener('click', save);
  $('#btnLoad').addEventListener('click', load);
  $('#btnReset').addEventListener('click', reset);
  bindBoard();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderMeters();
  renderStage();
  renderEvent();
  bindUI();
  updateBoard();
});
