let userLoc = null;
let activeSpot = TOURIST_SPOTS[0];
let activeCat = 'hotel';
let searchTerm = '';

function haversine(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180, dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function fmtKm(km){ return km<1 ? Math.round(km*1000)+' m' : km.toFixed(1)+' km'; }
function mapsViewUrl(p){
  return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.n+' '+p.a)+(p.pid?('&query_place_id='+p.pid):'');
}
function mapsDirUrl(p){
  return 'https://www.google.com/maps/dir/?api=1&destination='+p.lat+','+p.lng+(p.pid?('&destination_place_id='+p.pid):'')+'&travelmode=driving';
}
function priceRangeFor(pl){
  const bands = {
    0: {tier:'Budget',      nonAC:[600,1000],  ac:[900,1500]},
    1: {tier:'Budget',      nonAC:[600,1000],  ac:[900,1500]},
    2: {tier:'Mid-range',   nonAC:[1000,1600], ac:[1600,2600]},
    3: {tier:'Comfort',     nonAC:[1800,2600], ac:[2600,4200]},
    4: {tier:'Premium',     nonAC:[3000,4500], ac:[4200,7000]},
  };
  return bands[pl] || bands[0];
}
function fmtRupee(range){ return '₹'+range[0].toLocaleString('en-IN')+'–'+range[1].toLocaleString('en-IN'); }
function categoryIllustration(cat){
  const illos = {
    hotel: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="var(--accent-soft)"/>
      <rect x="30" y="55" width="140" height="45" rx="4" fill="var(--accent)"/>
      <rect x="45" y="65" width="25" height="25" fill="#fff" opacity="0.85"/>
      <rect x="87" y="65" width="25" height="25" fill="#fff" opacity="0.85"/>
      <rect x="130" y="65" width="25" height="25" fill="#fff" opacity="0.85"/>
      <rect x="90" y="90" width="20" height="10" fill="var(--accent-dark)"/>
      <circle cx="170" cy="30" r="14" fill="#ffd166"/>
      <path d="M20 100 L180 100" stroke="var(--accent-dark)" stroke-width="3"/>
    </svg>`,
    restaurant: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="var(--accent-soft)"/>
      <circle cx="100" cy="60" r="34" fill="#fff" stroke="var(--accent)" stroke-width="4"/>
      <circle cx="100" cy="60" r="18" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>
      <rect x="40" y="30" width="4" height="40" fill="var(--accent-dark)"/>
      <rect x="34" y="30" width="4" height="18" fill="var(--accent-dark)"/>
      <rect x="46" y="30" width="4" height="18" fill="var(--accent-dark)"/>
      <path d="M158 30 v18 a6 6 0 0 0 6 6 v16" stroke="var(--accent-dark)" stroke-width="4" fill="none"/>
    </svg>`,
    cafe: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="var(--accent-soft)"/>
      <rect x="70" y="55" width="55" height="40" rx="6" fill="#fff" stroke="var(--accent)" stroke-width="4"/>
      <path d="M125 62 h12 a10 10 0 0 1 0 20 h-12" fill="none" stroke="var(--accent)" stroke-width="4"/>
      <path d="M85 40 q5 -10 0 -18" stroke="var(--accent-dark)" stroke-width="3" fill="none"/>
      <path d="M100 40 q5 -10 0 -18" stroke="var(--accent-dark)" stroke-width="3" fill="none"/>
      <path d="M115 40 q5 -10 0 -18" stroke="var(--accent-dark)" stroke-width="3" fill="none"/>
    </svg>`,
    hospital: `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="120" fill="var(--accent-soft)"/>
      <rect x="55" y="35" width="90" height="65" rx="4" fill="#fff" stroke="var(--accent)" stroke-width="4"/>
      <rect x="93" y="48" width="14" height="38" fill="var(--accent)"/>
      <rect x="81" y="60" width="38" height="14" fill="var(--accent)"/>
    </svg>`,
  };
  return illos[cat] || illos.hotel;
}
function isEveningNow(){
  const h = new Date().getHours();
  return (h>=17 || h<6);
}

/* ---------- TAB SWITCHING ---------- */
document.getElementById('tabExploreBtn').onclick=()=>{
  document.getElementById('tabExploreBtn').classList.add('active');
  document.getElementById('tabPlanBtn').classList.remove('active');
  document.getElementById('tabExplore').style.display='block';
  document.getElementById('tabPlan').style.display='none';
};
document.getElementById('tabPlanBtn').onclick=()=>{
  document.getElementById('tabPlanBtn').classList.add('active');
  document.getElementById('tabExploreBtn').classList.remove('active');
  document.getElementById('tabPlan').style.display='block';
  document.getElementById('tabExplore').style.display='none';
  renderPlan(currentPlan);
};

/* ---------- CUSTOM LOCATION ---------- */
document.getElementById('customLocBtn').onclick=()=>{
  document.getElementById('customLocPanel').classList.toggle('open');
};
document.getElementById('applyCoordBtn').onclick=()=>{
  const lat=parseFloat(document.getElementById('latInput').value);
  const lng=parseFloat(document.getElementById('lngInput').value);
  const statusEl=document.getElementById('locStatus');
  if(isNaN(lat) || isNaN(lng) || lat<-90 || lat>90 || lng<-180 || lng>180){
    statusEl.textContent='⚠️ Please enter valid latitude (-90 to 90) and longitude (-180 to 180).';
    return;
  }
  userLoc = {lat, lng};
  statusEl.textContent='✅ Custom location set — distances "from you" now shown below.';
  renderList();
};
document.getElementById('locBtn').onclick=()=>{
  const statusEl=document.getElementById('locStatus');
  if(!navigator.geolocation){
    statusEl.textContent="Location isn't supported on this browser.";
    return;
  }
  statusEl.textContent='Requesting permission…';
  navigator.geolocation.getCurrentPosition(
    pos=>{
      userLoc={lat:pos.coords.latitude, lng:pos.coords.longitude};
      statusEl.textContent='✅ Location on — distances "from you" now shown below.';
      renderList();
    },
    ()=>{ statusEl.textContent="Location permission not granted. You'll still see distances from the tourist spot."; },
    { enableHighAccuracy:true, timeout:8000 }
  );
};

/* ---------- SEARCH ---------- */
document.getElementById('searchInput').addEventListener('input', (e)=>{
  searchTerm = e.target.value.trim().toLowerCase();
  renderList();
});

/* ---------- EXPLORE TAB RENDER ---------- */
function renderSpots(){
  const row = document.getElementById('spotRow');
  row.innerHTML='';
  TOURIST_SPOTS.forEach(s=>{
    const el=document.createElement('div');
    el.className='spot-chip'+(s.id===activeSpot.id?' active':'');
    el.textContent='📍 '+s.name;
    el.onclick=()=>{ activeSpot=s; renderSpots(); renderList(); };
    row.appendChild(el);
  });
  document.getElementById('spotDesc').innerHTML =
    `<b>${activeSpot.name}</b> — ${activeSpot.desc} <b style="float:right; color:var(--accent-dark)">${activeSpot.fee||''}</b>`;
  document.getElementById('eveningNote').style.display = isEveningNow() ? 'block' : 'none';
  renderStats();
}
function renderStats(){
  const row = document.getElementById('statsRow');
  row.innerHTML='';
  CATEGORIES.filter(c=>c.id!=='washroom').forEach(c=>{
    const nearest = PLACES.filter(p=>p.c===c.id)
      .map(p=>haversine(activeSpot.lat,activeSpot.lng,p.lat,p.lng))
      .sort((a,b)=>a-b)[0];
    const el=document.createElement('div');
    el.className='stat';
    el.innerHTML = `<b>${nearest!=null ? fmtKm(nearest) : '—'}</b><span>${c.icon} nearest ${c.label.toLowerCase()}</span>`;
    row.appendChild(el);
  });
}
function renderCats(){
  const row=document.getElementById('catRow');
  row.innerHTML='';
  CATEGORIES.forEach(c=>{
    const el=document.createElement('div');
    el.className='cat-chip'+(c.id===activeCat?' active':'');
    el.innerHTML=c.icon+' '+c.label;
    el.onclick=()=>{ activeCat=c.id; renderCats(); renderList(); };
    row.appendChild(el);
  });
}
function renderList(){
  const list=document.getElementById('list');
  const washNote=document.getElementById('washroomNote');
  list.innerHTML='';

  if(!searchTerm && activeCat==='washroom'){
    washNote.style.display='block';
    const q = 'public toilet near '+activeSpot.name+' Manipur';
    document.getElementById('washroomSearchLink').href =
      'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
    list.innerHTML = '<div class="empty">Tip: most temples, markets and lake viewpoints in Manipur have a paid or free public toilet at the entrance — ask any shopkeeper nearby, or use the live search above.</div>';
    return;
  }
  washNote.style.display='none';

  let base = searchTerm
    ? PLACES.filter(p=>p.n.toLowerCase().includes(searchTerm) || (p.tag||'').toLowerCase().includes(searchTerm))
    : PLACES.filter(p=>p.c===activeCat);

  let items = base.map(p=>{
    const dSpot = haversine(activeSpot.lat, activeSpot.lng, p.lat, p.lng);
    const dUser = userLoc ? haversine(userLoc.lat, userLoc.lng, p.lat, p.lng) : null;
    return {...p, dSpot, dUser};
  }).sort((a,b)=>a.dSpot-b.dSpot);

  if(items.length===0){
    list.innerHTML='<div class="empty">'+(searchTerm ? 'No matches for "'+searchTerm+'".' : 'No listings yet for this category near '+activeSpot.name+'.')+'</div>';
    return;
  }

  const catIcon = {hotel:'🛏️',hospital:'🏥',cafe:'☕',restaurant:'🍽️'};
  items.forEach((p, idx)=>{
    const card=document.createElement('div');
    card.className='card';
    const priceStr = p.pl ? '₹'.repeat(p.pl) : '';
    const detailId = 'detail-'+idx;
    let priceRow = '';
    if(p.c==='hotel'){
      const pr = priceRangeFor(p.pl);
      priceRow = `<div class="price-row">
          🛌 <b>${pr.tier}</b> approx/night — Non-AC ${fmtRupee(pr.nonAC)} · AC ${fmtRupee(pr.ac)}
          <span class="price-caveat">(estimate — confirm with hotel)</span>
        </div>`;
    }
    card.innerHTML = `
      <div class="card-top">
        <div>
          <h3>${searchTerm ? (catIcon[p.c]||'')+' ' : ''}${p.n}</h3>
          <p class="addr">${p.a}</p>
          <div class="badges">
            <span class="badge rating">⭐ ${p.r} (${p.rc})</span>
            ${priceStr ? `<span class="badge">${priceStr}</span>` : ''}
            ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
          </div>
        </div>
        <div class="dist">
          <b>${fmtKm(p.dSpot)}</b>from ${activeSpot.name.split(' ')[0]}
          ${p.dUser!=null ? `<br><b style="margin-top:4px">${fmtKm(p.dUser)}</b>from you` : ''}
        </div>
      </div>
      ${priceRow}
      <div class="actions">
        <a class="a-map" href="${mapsViewUrl(p)}" target="_blank" rel="noopener">🗺️ View on Maps</a>
        <a class="a-dir" href="${mapsDirUrl(p)}" target="_blank" rel="noopener">🧭 Directions</a>
        <button class="a-dir" onclick="togglePreview('${detailId}')" style="cursor:pointer;">🖼️ Preview</button>
      </div>
      <div class="preview-box" id="${detailId}" style="display:none;">
        ${categoryIllustration(p.c)}
        <p>This is a generic illustration, not an actual photo of ${p.n}.
        <a href="${mapsViewUrl(p)}" target="_blank" rel="noopener">See real photos on Google Maps →</a></p>
      </div>
      ${p.ph
        ? `<div class="contact-row">
             <a class="a-call" href="tel:${p.ph.replace(/\s/g,'')}">📞 Call ${p.ph}</a>
             <button class="a-copy" onclick="copyPhone('${p.ph.replace(/\s/g,'')}', this)">Copy</button>
           </div>`
        : `<div class="contact-row muted">☎️ No phone listed for this place —
             <a href="${mapsViewUrl(p)}" target="_blank" rel="noopener">check contact on Maps</a></div>`
      }
    `;
    list.appendChild(card);
  });
}
function copyPhone(num, btn){
  const done=()=>{ const old=btn.textContent; btn.textContent='Copied ✓'; setTimeout(()=>btn.textContent=old,1500); };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(num).then(done).catch(()=>{ btn.textContent='Tap & hold number'; });
  } else {
    btn.textContent='Tap & hold number';
  }
}
function togglePreview(id){
  const el = document.getElementById(id);
  if(!el) return;
  el.style.display = (el.style.display==='none' || !el.style.display) ? 'block' : 'none';
}

/* ---------- 5-DAY PLAN RENDER ---------- */
let currentPlan = ITINERARY;

function renderSpotChecks(){
  const grid = document.getElementById('spotCheckGrid');
  grid.innerHTML='';
  TOURIST_SPOTS.forEach(s=>{
    const id='chk_'+s.id;
    const wrap=document.createElement('label');
    wrap.className='spot-check';
    wrap.innerHTML = `<input type="checkbox" id="${id}" checked value="${s.id}"> ${s.name}`;
    grid.appendChild(wrap);
  });
}
function orderByProximity(spots){
  if(spots.length<=1) return [...spots];
  let remaining=[...spots];
  let route=[remaining.shift()];
  while(remaining.length){
    const last=route[route.length-1];
    let nearestIdx=0, nearestD=Infinity;
    remaining.forEach((s,i)=>{
      const d=haversine(last.lat,last.lng,s.lat,s.lng);
      if(d<nearestD){nearestD=d; nearestIdx=i;}
    });
    route.push(remaining.splice(nearestIdx,1)[0]);
  }
  return route;
}
function timeForIndex(i, count){
  if(count<=1) return '9:00 AM';
  const startH=8.5, endH=16.5;
  const h = startH + i*((endH-startH)/(count-1));
  let hour = Math.floor(h);
  const min = Math.round((h-hour)*60);
  const ampm = hour>=12 ? 'PM' : 'AM';
  let hr12 = hour%12; if(hr12===0) hr12=12;
  return hr12+':'+String(min).padStart(2,'0')+' '+ampm;
}
function buildCustomPlan(days, spotIds){
  const chosen = TOURIST_SPOTS.filter(s=>spotIds.includes(s.id));
  if(chosen.length===0) return [];
  const route = orderByProximity(chosen);
  const plan=[];
  const perDay = Math.max(1, Math.ceil(route.length/days));
  let idx=0, dayNum=0;
  while(idx < route.length && dayNum < days){
    const chunk = route.slice(idx, idx+perDay);
    idx += perDay; dayNum++;
    plan.push({
      title: chunk.map(s=>s.name.split(' (')[0]).join(' + '),
      stops: chunk.map((s,i)=>({ id:s.id, time:timeForIndex(i, chunk.length), note:s.desc }))
    });
  }
  // If user asked for more days than we had stops for, add relaxed/buffer days
  while(dayNum < days){
    dayNum++;
    const lastSpotId = plan.length ? plan[plan.length-1].stops.slice(-1)[0].id : chosen[0].id;
    plan.push({
      title:'Free / Buffer Day',
      stops:[{ id:lastSpotId, time:'Flexible', note:'No fixed sight today — great day to revisit a favourite spot, rest, or explore local markets and cafés at your own pace.' }]
    });
  }
  return plan;
}
document.getElementById('generatePlanBtn').onclick=()=>{
  const days = Math.max(1, Math.min(10, parseInt(document.getElementById('dayCountInput').value)||5));
  const spotIds = TOURIST_SPOTS.map(s=>s.id).filter(id=>document.getElementById('chk_'+id).checked);
  if(spotIds.length===0){
    alert('Pick at least one place to visit.');
    return;
  }
  currentPlan = buildCustomPlan(days, spotIds);
  renderPlan(currentPlan);
};
document.getElementById('resetPlanBtn').onclick=()=>{
  currentPlan = ITINERARY;
  document.getElementById('dayCountInput').value = 5;
  TOURIST_SPOTS.forEach(s=>document.getElementById('chk_'+s.id).checked=true);
  renderPlan(currentPlan);
};

function spotById(id){ return TOURIST_SPOTS.find(s=>s.id===id); }
function nearestHotels(lat,lng,n){
  return PLACES.filter(p=>p.c==='hotel')
    .map(p=>({...p, d:haversine(lat,lng,p.lat,p.lng)}))
    .sort((a,b)=>a.d-b.d)
    .slice(0,n);
}
function renderPlan(plan){
  plan = plan || currentPlan;
  const wrap=document.getElementById('planList');
  wrap.innerHTML='';
  if(plan.length===0){
    wrap.innerHTML='<div class="empty">No plan yet — pick some places above and tap Generate.</div>';
    return;
  }
  plan.forEach((day, idx)=>{
    const lastStop = spotById(day.stops[day.stops.length-1].id);
    const hotels = nearestHotels(lastStop.lat, lastStop.lng, 3);
    const card=document.createElement('div');
    card.className='day-card';
    card.innerHTML = `
      <div class="day-head">
        <div class="day-num">${idx+1}</div>
        <div>
          <h2>${day.title}</h2>
          <span>Day ${idx+1} of ${plan.length}</span>
        </div>
      </div>
      ${day.stops.map(st=>{
        const spot=spotById(st.id);
        return `<div class="stop">
          <div class="stop-time">${st.time}</div>
          <div class="stop-body">
            <h4>${spot.name}</h4>
            <p>${st.note}</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}&travelmode=driving" target="_blank" rel="noopener">🧭 Directions →</a>
          </div>
        </div>`;
      }).join('')}
      <div class="night-box">
        <div class="nb-head">🌙 Sky turning dark? Night stay near ${lastStop.name.split(' ')[0]}</div>
        ${hotels.map(h=>{
          const pr = priceRangeFor(h.pl);
          return `
          <div class="night-item" style="flex-direction:column; align-items:flex-start; gap:4px;">
            <div style="display:flex; justify-content:space-between; width:100%;">
              <span>${h.n} <span style="color:var(--muted)">(${fmtKm(h.d)} away, ⭐${h.r})</span></span>
            </div>
            <div style="font-size:0.76rem; color:var(--muted);">💰 Non-AC ${fmtRupee(pr.nonAC)} · AC ${fmtRupee(pr.ac)} <i>(est./night)</i></div>
            <div style="display:flex; gap:10px;">
              ${h.ph ? `<a href="tel:${h.ph.replace(/\s/g,'')}">📞 ${h.ph}</a>` : `<a href="${mapsViewUrl(h)}" target="_blank" rel="noopener">Contact on Maps</a>`}
              <a href="${mapsDirUrl(h)}" target="_blank" rel="noopener">Directions</a>
            </div>
          </div>
        `;}).join('')}
      </div>
    `;
    wrap.appendChild(card);
  });
}

renderSpotChecks();
renderSpots();
renderCats();
renderList();
