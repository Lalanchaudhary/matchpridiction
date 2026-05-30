// Sample dataset of matches
const matches = [
  {id:1,sport:'Cricket',teamA:'India',teamB:'Australia',datetime:'2026-06-02T14:30:00',prediction:62,win:'India',confidence:'High',analysis:'India favored due to home conditions and strong batting order.',premium:false,featured:true},
  {id:2,sport:'Football',teamA:'Barcelona',teamB:'Real Madrid',datetime:'2026-06-03T19:00:00',prediction:54,win:'Barcelona',confidence:'Medium',analysis:'Tactical advantage in midfield expected.',premium:false,featured:true},
  {id:3,sport:'Basketball',teamA:'Lakers',teamB:'Bulls',datetime:'2026-06-04T02:00:00',prediction:48,win:'Bulls',confidence:'Low',analysis:'Even matchup; slight edge on defense.',premium:true,featured:true},
  {id:4,sport:'Cricket',teamA:'England',teamB:'Pakistan',datetime:'2026-06-05T10:00:00',prediction:70,win:'England',confidence:'High',analysis:'Pitch suits England spin attack.',premium:true,featured:false},
  {id:5,sport:'Football',teamA:'Juventus',teamB:'AC Milan',datetime:'2026-06-06T18:30:00',prediction:65,win:'Juventus',confidence:'High',analysis:'Strong recent form and better defensive record.',premium:false,featured:false}
];

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleString();
}

function isPremium(){return localStorage.getItem('isPremium')==='1'}

function renderTicker(){
  const el = document.getElementById('liveTicker');
  if(!el) return;
  const live = matches.slice(0,5).map(m=>`${m.sport}: ${m.teamA} vs ${m.teamB} — ${m.prediction}% ${m.win}`).join('  •  ');
  el.textContent = live;
}

function renderFeatured(){
  const el = document.getElementById('featuredPredictions');
  if(!el) return;
  const featured = matches.filter(m=>m.featured);
  el.innerHTML = '';
  featured.forEach(m=>{
    const div = document.createElement('div');div.className='card'+(m.premium?' locked':'');
    div.innerHTML = `
      <div class="match-title">${m.teamA} vs ${m.teamB}</div>
      <div class="meta">${m.sport} • ${formatDate(m.datetime)}</div>
      <div class="prediction">${m.prediction}% — <span class="muted">${m.win}</span></div>
      <div class="meta small">Confidence: <span class="confidence conf-${m.confidence.toLowerCase()}">${m.confidence}</span></div>
      <p class="small">${m.analysis}</p>
    `;
    if(m.premium && !isPremium()){
      const overlay = document.createElement('div');overlay.className='lock-overlay';overlay.innerHTML=`<div><a class="btn-ghost" href="premium.html">Unlock VIP</a></div>`;div.style.position='relative';div.appendChild(overlay);
    }
    el.appendChild(div);
  });
}

function renderLatest(filter){
  const el = document.getElementById('latestList')||document.getElementById('matchesList');
  if(!el) return;
  const list = (filter && filter!=='All')?matches.filter(m=>m.sport===filter):matches;
  el.innerHTML='';
  list.forEach(m=>{
    const d = document.createElement('div');d.className='card'+(m.premium && !isPremium()?' locked':'');
    d.innerHTML=`
      <div class="match-title">${m.teamA} vs ${m.teamB}</div>
      <div class="meta">${m.sport} • ${formatDate(m.datetime)}</div>
      <div class="prediction">${m.prediction}% — <span class="muted">${m.win}</span></div>
      <div class="meta small">Confidence: <span class="confidence conf-${m.confidence.toLowerCase()}">${m.confidence}</span></div>
      <p class="small">${m.analysis}</p>
    `;
    if(m.premium && !isPremium()){
      const overlay = document.createElement('div');overlay.className='lock-overlay';overlay.innerHTML=`<div><button class="btn-ghost" data-action="unlock">Join VIP to view</button></div>`;d.style.position='relative';d.appendChild(overlay);
    }
    el.appendChild(d);
  });
}

function animateCounters(){
  document.querySelectorAll('.stat-number').forEach(el=>{
    const target = +el.dataset.target||0;let cur=0;const step=Math.max(1,Math.floor(target/60));
    const t = setInterval(()=>{cur+=step;el.textContent=cur; if(cur>=target){el.textContent=target;clearInterval(t);}},16);
  });
}

function setupFilter(){
  const sel = document.getElementById('sportFilter');
  if(!sel) return;
  sel.addEventListener('change',e=>renderLatest(e.target.value));
}

function bindUnlock(){
  document.addEventListener('click',e=>{
    const btn = e.target.closest('[data-action="unlock"]');
    if(btn){window.location.href='premium.html';}
  });
}

function bindWhatsappPopupClose(){
  const popup = document.getElementById('whatsappPopup');
  const closeBtn = document.querySelector('.whatsapp-popup-close');
  if(popup && closeBtn){
    closeBtn.addEventListener('click',()=>popup.classList.add('hidden'));
  }
}

function setupPremiumButtons(){
  document.querySelectorAll('[data-subscribe]').forEach(b=>{
    b.addEventListener('click',()=>{
      const plan = b.dataset.subscribe;localStorage.setItem('isPremium','1');alert('Subscribed to '+plan+' — Premium unlocked!');
      window.location.href='predictions.html';
    });
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  // common UI
  const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
  renderTicker();renderFeatured();renderLatest();animateCounters();bindUnlock();bindWhatsappPopupClose();setupPremiumButtons();
  // predictions page filter
  const filter = document.getElementById('sportFilter'); if(filter){
    // populate unique sports
    const sports = ['All',...new Set(matches.map(m=>m.sport))];
    sports.forEach(s=>{const opt=document.createElement('option');opt.value=s;opt.textContent=s;filter.appendChild(opt);});
    filter.addEventListener('change',e=>renderLatest(e.target.value));
  }
});

// Placeholder for payment integration hook
function integratePayment(provider,options){
  console.info('Integrate with',provider,options);
}

// Exported for potential inline use
window.MP = {matches,renderLatest,isPremium,integratePayment};