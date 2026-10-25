/* ==========================================================
   HELP KIT MANIPUR — app.js
   All interactive behaviour. Loaded after data.js, which must
   define POIS / PLACES / ROUTES / CONNECTIONS / RESTS /
   ROUTE_REVIEWS / SITE_REVIEWS before this file runs.

   ── TO GO LIVE WITH REAL GOOGLE PLACES DATA ──────────────
   Paste a free Google Places API key on the line directly
   below (between the quotes). Leave it blank and the site
   runs perfectly on the built-in sample data in data.js —
   nothing breaks either way. See README.md for how to get
   a key. (There is no separate config file — this is the
   only place the key lives.)
   ========================================================== */
const GOOGLE_PLACES_API_KEY = "";

/* ---------- App behaviour ----------------------------------
   All interactive behaviour. Reads POIS / PLACES / ROUTES /
   CONNECTIONS / RESTS / ROUTE_REVIEWS / SITE_REVIEWS from
   the sample data above.
   ========================================================== */

let userLoc = null; // {lat, lng}

function haversineKm(a, b){
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s));
}
function isLateHour(){
  return new Date().getHours() >= 16;
}
function setUserLoc(loc){
  userLoc = loc;
  const whereLabel = document.getElementById('whereLabel');
  if (whereLabel) whereLabel.textContent = loc ? `Pinned: ${loc.lat.toFixed(3)}, ${loc.lng.toFixed(3)}` : 'Location not set';
  const status = document.getElementById('locStatus');
  if (status) {
    status.textContent = loc ? 'Location set — distances below are live.' : 'Turn location on to see how far each place is from you.';
    status.classList.toggle('ready', !!loc);
  }
  renderNearby();
}

/* ============================================================
   Nav / drawer
   ============================================================ */
(function initNav(){
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  function openDrawer(){ drawer.classList.add('open'); scrim.classList.add('open'); }
  function closeDrawer(){ drawer.classList.remove('open'); scrim.classList.remove('open'); }
  hamburgerBtn.addEventListener('click', openDrawer);
  scrim.addEventListener('click', closeDrawer);

  document.querySelectorAll('.navlink').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.navlink').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const target = document.getElementById('view-' + btn.dataset.view);
      if (target) target.classList.add('active');
      closeDrawer();
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    });
  });
})();

/* ============================================================
   EXPLORE NEARBY
   ============================================================ */
(function initNearbyControls(){
  const tabGeo = document.getElementById('tabGeo');
  const tabManual = document.getElementById('tabManual');
  const geoPane = document.getElementById('geoPane');
  const manualPane = document.getElementById('manualPane');

  tabGeo.addEventListener('click', () => {
    tabGeo.classList.add('active'); tabManual.classList.remove('active');
    geoPane.style.display = ''; manualPane.classList.remove('show');
  });
  tabManual.addEventListener('click', () => {
    tabManual.classList.add('active'); tabGeo.classList.remove('active');
    manualPane.classList.add('show'); geoPane.style.display = 'none';
  });

  document.getElementById('geoBtn').addEventListener('click', () => {
    const status = document.getElementById('locStatus');
    const showStatus = (msg, isError) => {
      status.textContent = msg;
      status.classList.toggle('error', !!isError);
      status.classList.remove('ready');
    };
    if (!('geolocation' in navigator)) {
      showStatus('Geolocation is not available in this browser. Use "Enter location manually" instead.', true);
      return;
    }
    const btn = document.getElementById('geoBtn');
    const prevLabel = btn.textContent;
    let settled = false;
    const finish = () => { if (settled) return; settled = true; btn.textContent = prevLabel; btn.disabled = false; };

    btn.textContent = 'Locating…';
    btn.disabled = true;
    showStatus('Requesting your location…', false);

    // Watchdog: some embedded/sandboxed previews (including this chat's own
    // artifact preview) silently block geolocation — neither callback ever
    // fires, which would otherwise leave the button stuck forever. This
    // guarantees it always recovers with a clear message.
    const watchdog = setTimeout(() => {
      finish();
      showStatus('Location request did not respond. This can happen inside an embedded preview (including this chat) — it should work normally once deployed on its own site. Use "Enter location manually" for now.', true);
    }, 8000);

    try {
      navigator.geolocation.getCurrentPosition(
        pos => {
          clearTimeout(watchdog);
          finish();
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        err => {
          clearTimeout(watchdog);
          finish();
          let msg = 'Could not get your location.';
          if (err.code === err.PERMISSION_DENIED) msg = 'Location permission was denied. Use "Enter location manually" instead, or allow location access for this site in your browser settings.';
          else if (err.code === err.TIMEOUT) msg = 'Location request timed out. Please try again.';
          else if (err.code === err.POSITION_UNAVAILABLE) msg = 'Location unavailable right now. Try again or use "Enter location manually".';
          showStatus(msg, true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } catch (e) {
      clearTimeout(watchdog);
      finish();
      showStatus('This browser blocked the location request outright. Use "Enter location manually" instead.', true);
    }
  });

  document.getElementById('setManualBtn').addEventListener('click', () => {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);
    if (isNaN(lat) || isNaN(lng)) { alert('Enter both latitude and longitude.'); return; }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) { alert('That doesn\'t look like a valid coordinate pair.'); return; }
    setUserLoc({ lat, lng });
  });

  document.getElementById('washroomBtn').addEventListener('click', () => {
    const loc = userLoc || IMPHAL_CENTER;
    window.open(`https://www.google.com/maps/search/public+toilet/@${loc.lat},${loc.lng},15z`, '_blank', 'noopener');
  });
})();

/* ---- distance anchor: real location once set, Kangla Fort (city
   centre landmark) as a sensible default before that — so cards
   always show a real distance instead of a placeholder ---------- */
function getAnchor(){ return userLoc || KANGLA_FORT; }
function fmtDist(km){ return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km'; }
function distSuffix(){ return userLoc ? '' : ' from Kangla'; }

const CATEGORY_PLURAL = {
  Hotel:'hotels', Restaurant:'restaurants', Cafe:'cafes', Hospital:'hospitals',
  Police:'police', Pharmacy:'pharmacies', ATM:'ATMs'
};
const CATEGORIES = Array.from(new Set(POIS.map(p => p.cat)));
let activeCategory = 'Hotel';
let searchTerm = '';

/* ---- Landmark search + spot chips ---------------------------- */
let activeLandmark = LANDMARK_NAMES[0];
function renderLandmarkChips(){
  document.getElementById('landmarkChips').innerHTML = LANDMARK_NAMES.map(n =>
    `<button data-name="${n}" class="${n === activeLandmark ? 'active' : ''}">📍 ${n}</button>`
  ).join('');
  document.querySelectorAll('#landmarkChips button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLandmark = btn.dataset.name;
      renderLandmarkChips();
      renderLandmarkCard();
    });
  });
}
function renderLandmarkCard(){
  const p = PLACES[activeLandmark];
  if (!p) { document.getElementById('landmarkCard').innerHTML = ''; return; }
  document.getElementById('landmarkCard').innerHTML = `
    <div class="landmark-card"><span class="entry">${p.entry}</span><span class="lname">${activeLandmark}</span> — ${p.desc}</div>`;
}
document.getElementById('landmarkSearch').addEventListener('input', (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderNearby();
});

/* ---- Live Google Places integration -------------------------------
   If GOOGLE_PLACES_API_KEY (top of this file) is set, this loads the
   Maps JavaScript API and queries real nearby places per category —
   name, rating, review count, price level, address and open-now come
   back free with the nearby search; phone number and website need a
   separate Place Details call, so those are fetched lazily, only for
   the category currently on screen, to keep API usage/cost low.
   If the key is blank, the script fails to load, or a query errors
   out, everything falls back to the sample POIS list in data.js
   automatically — the page never breaks either way. */
const LIVE_CATEGORY_TYPES = {
  'Hotel': 'lodging', 'Restaurant': 'restaurant', 'Cafe': 'cafe',
  'Hospital': 'hospital', 'Police': 'police', 'Pharmacy': 'pharmacy', 'ATM': 'atm'
};
const RESULTS_PER_CATEGORY = 8;

let placesService = null;
let liveModeReady = false;
let liveCache = {};
let liveCacheLoc = null;
let liveFetchInFlight = 0;
let detailsFetchedFor = {}; // { 'Hotel': true, ... } once details have been requested for that category at this location

function initGooglePlaces(onReady){
  if (typeof GOOGLE_PLACES_API_KEY === 'undefined' || !GOOGLE_PLACES_API_KEY || !GOOGLE_PLACES_API_KEY.trim()) {
    onReady(false);
    return;
  }
  let settled = false;
  const finish = (ok) => { if (settled) return; settled = true; onReady(ok); };

  window.__hkmPlacesReady = function(){
    try {
      placesService = new google.maps.places.PlacesService(document.createElement('div'));
      finish(true);
    } catch (e) { finish(false); }
  };
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_PLACES_API_KEY)}&libraries=places&callback=__hkmPlacesReady`;
  script.async = true;
  script.onerror = () => finish(false);
  document.head.appendChild(script);
  setTimeout(() => finish(false), 7000);
}

function tagFor(rating, reviews, distKm){
  if (rating >= 4.5 && reviews >= 400) return 'Popular';
  if (distKm !== null && distKm < 1) return 'Central location';
  return null; // falls back to the price-tier label in the UI
}

function fetchLiveCategory(cat, loc, callback){
  const type = LIVE_CATEGORY_TYPES[cat];
  if (!placesService || !type) { callback([]); return; }
  placesService.nearbySearch(
    { location: new google.maps.LatLng(loc.lat, loc.lng), rankBy: google.maps.places.RankBy.DISTANCE, type },
    (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) { callback([]); return; }
      const mapped = results.slice(0, RESULTS_PER_CATEGORY).map(r => {
        const lat = r.geometry && r.geometry.location ? r.geometry.location.lat() : loc.lat;
        const lng = r.geometry && r.geometry.location ? r.geometry.location.lng() : loc.lng;
        const rating = typeof r.rating === 'number' ? r.rating : null;
        const reviews = typeof r.user_ratings_total === 'number' ? r.user_ratings_total : 0;
        return {
          name: r.name, cat, placeId: r.place_id,
          emoji: (POIS.find(p => p.cat === cat) || {}).emoji || '📍',
          lat, lng,
          rating, reviews,
          priceTier: typeof r.price_level === 'number' ? r.price_level : null,
          address: r.vicinity || '',
          openNow: r.opening_hours ? !!r.opening_hours.open_now : null,
          tag: tagFor(rating || 0, reviews, null),
          phone: null, website: null, detailsLoaded: false
        };
      });
      callback(mapped);
    }
  );
}

function fetchDetailsForCategory(cat){
  if (!placesService || detailsFetchedFor[cat] || !liveCache[cat]) return;
  detailsFetchedFor[cat] = true;
  liveCache[cat].forEach((item, i) => {
    setTimeout(() => {
      placesService.getDetails(
        { placeId: item.placeId, fields: ['international_phone_number', 'website'] },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            item.phone = place.international_phone_number || null;
            item.website = place.website || null;
          }
          item.detailsLoaded = true;
          renderNearby();
        }
      );
    }, i * 180);
  });
}

function refreshLiveData(loc){
  liveCache = {};
  liveCacheLoc = loc;
  detailsFetchedFor = {};
  const cats = Object.keys(LIVE_CATEGORY_TYPES);
  liveFetchInFlight = cats.length;
  setNearbyStatus('🔄 Finding live places near you…', false);
  cats.forEach((cat, i) => {
    setTimeout(() => {
      fetchLiveCategory(cat, loc, (results) => {
        liveCache[cat] = results;
        liveFetchInFlight -= 1;
        if (liveFetchInFlight <= 0) {
          const gotAny = Object.values(liveCache).some(arr => arr.length > 0);
          setNearbyStatus(gotAny ? '' : '⚠️ Live results unavailable right now (check the API key, billing, or your quota at the top of this file) — showing the saved sample list instead.', !gotAny);
        }
        renderNearby();
      });
    }, i * 220);
  });
}

function renderFilterChips(){
  const wrap = document.getElementById('filterChips');
  wrap.innerHTML = CATEGORIES.map(c =>
    `<button data-cat="${c}" class="${c === activeCategory ? 'active' : ''}">${c === 'ATM' ? 'ATM' : c + 's'}</button>`
  ).join('');
  wrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderFilterChips();
      renderNearby();
    });
  });
}

function setNearbyStatus(text, isWarn){
  const el = document.getElementById('nearbyStatus');
  if (!text) { el.style.display = 'none'; return; }
  el.textContent = text;
  el.className = 'nearby-status' + (isWarn ? ' warn' : '');
  el.style.display = 'block';
}

function usingLiveForThisLoc(){
  return liveModeReady && liveCacheLoc && getAnchor().lat === liveCacheLoc.lat && getAnchor().lng === liveCacheLoc.lng &&
    Object.values(liveCache).some(arr => arr.length > 0);
}

function renderNearestStats(){
  const anchor = getAnchor();
  const live = usingLiveForThisLoc();
  document.getElementById('nearestStats').innerHTML = CATEGORIES.map(cat => {
    const source = live ? (liveCache[cat] || []) : POIS.filter(p => p.cat === cat);
    if (!source.length) return '';
    const nearest = source.map(p => haversineKm(anchor, p)).sort((a, b) => a - b)[0];
    return `<div class="stat-card"><div class="num">${fmtDist(nearest)}</div><div class="lbl">nearest ${CATEGORY_PLURAL[cat] || cat.toLowerCase()}</div></div>`;
  }).join('');
}

function priceBoxFor(p){
  if (p.cat === 'Hotel') {
    const tier = HOTEL_PRICE_TIERS[p.priceTier != null ? p.priceTier : 2];
    return `<div class="price-box">🛏 <span class="tier">${tier.label}</span> approx/night — Non-AC ₹${tier.nonAC[0]}–${tier.nonAC[1]} · AC ₹${tier.ac[0]}–${tier.ac[1]}<span class="note">(estimate — confirm with hotel)</span></div>`;
  }
  if (p.cat === 'Restaurant') {
    const tier = FOOD_PRICE_TIERS[p.priceTier != null ? p.priceTier : 2];
    return `<div class="price-box">🍽️ <span class="tier">${tier.label}</span> — ${tier.cost}<span class="note">(estimate)</span></div>`;
  }
  if (p.cat === 'Cafe') {
    const tier = CAFE_PRICE_TIERS[p.priceTier != null ? p.priceTier : 1];
    return `<div class="price-box">☕ <span class="tier">${tier.label}</span> — ${tier.cost}<span class="note">(estimate)</span></div>`;
  }
  return '';
}

function actionsFor(p){
  const mapsHref = p.placeId
    ? `https://www.google.com/maps/place/?q=place_id:${p.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + (p.address || 'Imphal Manipur'))}`;
  const dirHref = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}${p.placeId ? '&destination_place_id=' + p.placeId : ''}`;
  return `
    <div class="actions">
      <a class="primary" href="${mapsHref}" target="_blank" rel="noopener">🗺️ View on Maps</a>
      <a href="${dirHref}" target="_blank" rel="noopener">🧭 Directions</a>
      <a href="https://www.jugnoo.in/" target="_blank" rel="noopener">🛺 Jugnoo</a>
    </div>`;
}

function websiteBtnFor(p){
  if (p.website) {
    return `<a class="full-btn website" href="${p.website}" target="_blank" rel="noopener">🌐 Official Website</a>`;
  }
  // live result whose Place Details call hasn't come back yet — don't show a
  // search link that would just disappear a moment later once it loads
  if (p.placeId && !p.detailsLoaded) return '';
  // sample data (these are placeholder business names, so there's no real
  // website to link to) or a live result Google has no site on file for —
  // offer to search instead of fabricating a URL
  const q = encodeURIComponent(`${p.name} ${p.address || 'Imphal Manipur'} official website`);
  return `<a class="full-btn website" href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener">🔍 Find Website</a>`;
}

function reviewsBtnFor(p){
  if (p.placeId) {
    return `<a class="full-btn reviews" href="https://search.google.com/local/writereview?placeid=${p.placeId}" target="_blank" rel="noopener">⭐ Read/write reviews</a>`;
  }
  return `<button class="full-btn reviews" onclick="document.querySelector('.navlink[data-view=reviews]').click()">⭐ Read/write reviews</button>`;
}

function phoneRowFor(p){
  if (p.phone) {
    return `<div class="phone-row"><a href="tel:${p.phone.replace(/\s+/g, '')}">📞 Call ${p.phone}</a><button class="copyPhoneBtn" data-phone="${p.phone}">Copy</button></div>`;
  }
  if (p.placeId && !p.detailsLoaded) {
    return `<div class="no-phone">Loading contact info…</div>`;
  }
  return `<div class="no-phone">No phone listed</div>`;
}

function renderNearby(){
  const late = isLateHour();
  const lateBanner = document.getElementById('lateBanner');
  if (lateBanner) lateBanner.style.display = late ? 'block' : 'none';

  const live = usingLiveForThisLoc();
  if (live && activeCategory !== 'All') fetchDetailsForCategory(activeCategory);

  const anchor = getAnchor();
  const source = live ? (liveCache[activeCategory] || []) : POIS.filter(p => p.cat === activeCategory);

  let list = source
    .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm))
    .map(p => ({ ...p, dist: haversineKm(anchor, p) }));

  list.sort((a, b) => {
    if (late && activeCategory === 'All') {
      const aHotel = a.cat === 'Hotel', bHotel = b.cat === 'Hotel';
      if (aHotel !== bHotel) return aHotel ? -1 : 1;
    }
    return a.dist - b.dist;
  });

  document.getElementById('nearbyCount').textContent =
    `${list.length} place${list.length === 1 ? '' : 's'} · ${activeCategory}${live ? ' · live from Google Places' : ' · sample data'}`;

  document.getElementById('nearbyList').innerHTML = list.map(p => {
    const ratingHtml = p.rating ? `<span class="rate-pill">★ ${p.rating.toFixed(1)} (${p.reviews})</span>` : '';
    const priceSym = p.priceTier != null ? `<span class="price-sym">${'₹'.repeat(Math.max(1, p.priceTier))}</span>` : '';
    const tagHtml = p.tag ? `<span class="tag-pill">${p.tag}</span>` : '';
    const openHtml = p.openNow === true ? `<span class="open-pill open">Open now</span>` : (p.openNow === false ? `<span class="open-pill closed">Closed</span>` : '');
    return `
    <div class="biz-card">
      <div class="top">
        <div><div class="bname">${p.name}</div><div class="baddr">${p.address || ''}</div></div>
        <div class="bdist">${fmtDist(p.dist)}<span class="sub">${distSuffix()}</span></div>
      </div>
      <div class="meta">${ratingHtml}${priceSym}${tagHtml}${openHtml}</div>
      ${priceBoxFor(p)}
      ${actionsFor(p)}
      ${websiteBtnFor(p)}
      ${reviewsBtnFor(p)}
      ${phoneRowFor(p)}
    </div>`;
  }).join('');

  renderNearestStats();
}

renderLandmarkChips();
renderLandmarkCard();
renderFilterChips();
renderNearby();
initGooglePlaces((ok) => {
  liveModeReady = ok;
  if (ok) refreshLiveData(getAnchor());
});

const _origSetUserLoc = setUserLoc;
setUserLoc = function(loc){
  _origSetUserLoc(loc);
  if (liveModeReady) refreshLiveData(getAnchor());
};

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('copyPhoneBtn')) {
    const phone = e.target.dataset.phone;
    const prev = e.target.textContent;
    const done = () => { e.target.textContent = 'Copied!'; setTimeout(() => { e.target.textContent = prev; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(phone).then(done).catch(() => alert('Number: ' + phone));
    } else {
      alert('Number: ' + phone);
    }
  }
});

/* ============================================================
   TRIP PLANNER — schedules stops in order, stops adding new
   sightseeing once the next stop would land after 4:30 PM, and
   suggests a nearby restaurant + hotel for the night instead.
   ============================================================ */
function buildPlaceChecks(){
  const wrap = document.getElementById('placeChecks');
  wrap.innerHTML = Object.keys(PLACES).map(name => {
    const checked = PLACES[name].popular ? 'checked' : '';
    return `<label><input type="checkbox" value="${name}" ${checked}> ${name}</label>`;
  }).join('');
}

const DAY_START_MIN = 9 * 60;      // 9:00 AM
const CUTOFF_MIN = 16 * 60 + 30;   // 4:30 PM
const AVG_SPEED_KMH = 25;          // conservative hill-road average

function travelMinutes(a, b){
  return Math.max(10, Math.round((haversineKm(a, b) / AVG_SPEED_KMH) * 60));
}

function nearestOfCategory(cat, point){
  const pool = POIS.filter(p => p.cat === cat);
  if (!pool.length) return null;
  return pool.map(p => ({ ...p, dist: haversineKm(point, p) })).sort((a, b) => a.dist - b.dist)[0];
}

/* Split an ordered list into `days` groups that are as equal in size as
   possible (sizes never differ by more than 1), as contiguous runs so each
   day's places stay geographically close to each other in the given order —
   e.g. 8 places over 3 days -> [3, 3, 2], never [6, 1, 1]. */
function chunkEqually(items, days){
  const n = items.length;
  const base = Math.floor(n / days), rem = n % days;
  const chunks = [];
  let idx = 0;
  for (let d = 0; d < days; d++) {
    const size = base + (d < rem ? 1 : 0);
    chunks.push(items.slice(idx, idx + size));
    idx += size;
  }
  return chunks;
}

function buildDaySchedule(orderedNames, totalDays){
  const usableDays = Math.min(totalDays, orderedNames.length) || 1;
  const chunks = chunkEqually(orderedNames, usableDays);
  const days = [];
  let cursor = userLoc || IMPHAL_CENTER;

  chunks.forEach((chunk, i) => {
    let time = DAY_START_MIN;
    const dayPlaces = [];
    chunk.forEach(name => {
      const coord = PLACES[name];
      const travel = travelMinutes(cursor, coord);
      time += travel;
      dayPlaces.push({ name, arrival: time, late: time >= CUTOFF_MIN });
      time += (coord.visitMins || 90);
      cursor = coord;
    });
    days.push({ day: i + 1, places: dayPlaces, lastPoint: cursor });
  });

  // extra days beyond what the place count needs become explicit free days,
  // rather than silently disappearing
  for (let d = usableDays + 1; d <= totalDays; d++) {
    days.push({ day: d, places: [], lastPoint: cursor, free: true });
  }
  return { days };
}

function to12hShort(mins){
  const h = Math.floor(mins / 60), m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

function renderPlan(order){
  const days = Math.max(1, Math.min(15, parseInt(document.getElementById('daysInput').value, 10) || 1));
  const { days: schedule } = buildDaySchedule(order, days);

  document.getElementById('planResult').innerHTML = schedule.map(d => {
    if (d.free) {
      return `
      <div class="day">
        <h4>Day ${d.day}</h4>
        <div class="night-block">
          <div class="nb-title">🗓️ Free day</div>
          <div class="nb-row"><span>No new places left to assign — revisit a favourite, rest, or add more places to the list above.</span></div>
        </div>
      </div>`;
    }
    const items = d.places.map(p => `<li>${to12hShort(p.arrival)} — ${p.name}${p.late ? ' <span class="plan-overflow" style="display:inline;margin:0;">⚠️ running past 4:30 PM</span>' : ''}</li>`).join('');
    const rest = nearestOfCategory('Restaurant', d.lastPoint);
    const hotel = nearestOfCategory('Hotel', d.lastPoint);
    return `
      <div class="day">
        <h4>Day ${d.day} <span style="font-weight:400;color:var(--ink-soft);font-size:0.8rem;">(${d.places.length} place${d.places.length === 1 ? '' : 's'})</span></h4>
        <ul>${items}</ul>
        <div class="night-block">
          <div class="nb-title">🌙 After 4:30 PM — settle in for the night</div>
          ${rest ? `<div class="nb-row"><span>🍽️ ${rest.name}</span><span>${fmtDist(rest.dist)}</span></div>` : ''}
          ${hotel ? `<div class="nb-row"><span>🏨 ${hotel.name}</span><span>${fmtDist(hotel.dist)}</span></div>` : ''}
        </div>
      </div>`;
  }).join('');
}

(function initPlanner(){
  buildPlaceChecks();
  document.getElementById('buildPlanBtn').addEventListener('click', () => {
    const picked = Array.from(document.querySelectorAll('#placeChecks input:checked')).map(i => i.value);
    if (picked.length === 0) { document.getElementById('planResult').innerHTML = '<p>Pick at least one place to build a plan.</p>'; return; }
    const start = userLoc || IMPHAL_CENTER;
    const withDist = picked.map(name => ({ name, dist: haversineKm(start, PLACES[name]) }));
    withDist.sort((a, b) => a.dist - b.dist);
    renderPlan(withDist.map(p => p.name));
  });
  document.getElementById('resetPlanBtn').addEventListener('click', () => {
    document.querySelectorAll('#placeChecks input').forEach(cb => cb.checked = EXAMPLE_ORDER.includes(cb.value));
    document.getElementById('daysInput').value = 3;
    renderPlan(EXAMPLE_ORDER);
  });
})();


function timeToMinutes(t){ const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function nowMinutes(){ const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function fmtCountdown(mins){ if (mins < 0) mins += 24 * 60; const h = Math.floor(mins / 60), m = mins % 60; return (h > 0 ? h + 'h ' : '') + m + 'm'; }
function to12h(mins){
  const h = Math.floor(mins / 60), m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

(function initBus(){
  const fromSel = document.getElementById('fromSel');
  const toSel = document.getElementById('toSel');
  const ledger = document.getElementById('ledger');
  const emptyState = document.getElementById('emptyState');
  const ttTitle = document.getElementById('ttTitle');
  const safetyBlock = document.getElementById('safetyBlock');
  const safetyNote = document.getElementById('safetyNote');
  const ratingNum = document.getElementById('ratingNum');
  const reviewsList = document.getElementById('reviewsList');

  reviewsList.innerHTML = ROUTE_REVIEWS.map(r => `
    <div class="review"><div class="who">${r.who} <span class="stars">${r.stars}</span></div><div>${r.text}</div></div>`).join('');

  function renderRoute(){
    const from = fromSel.value, to = toSel.value;
    const key = from + '>' + to;
    ttTitle.textContent = from + ' → ' + to;

    if (from !== 'Imphal') {
      ledger.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = notFromImphalMessage(from);
      safetyBlock.style.display = 'none';
      return;
    }
    const route = ROUTES[key];
    if (!route) {
      ledger.innerHTML = '';
      emptyState.style.display = 'block';
      emptyState.textContent = CONNECTIONS[key] || 'No listing yet for this route.';
      safetyBlock.style.display = 'none';
      return;
    }
    emptyState.style.display = 'none';
    safetyBlock.style.display = 'block';
    safetyNote.textContent = `This is a hill route with mountain curves (${route.distance}) — most operators schedule one meal/rest stop. Night travel is common; keep valuables with you and note your seat and bus number.`;
    const avg = (route.buses.reduce((s, b) => s + b.rating, 0) / route.buses.length).toFixed(1);
    ratingNum.textContent = avg;

    const now = nowMinutes();
    const buses = route.buses.map(b => ({ ...b, depMin: timeToMinutes(b.dep) })).sort((a, b) => a.depMin - b.depMin);

    ledger.innerHTML = buses.map((b, i) => {
      const departed = b.depMin < now;
      const statusClass = departed ? 'departed' : 'upcoming';
      const statusLabel = departed ? 'Departed' : ('in ' + fmtCountdown(b.depMin - now));
      return `
      <div class="row ${statusClass}" data-idx="${i}">
        <div class="rail"></div>
        <div class="op">${b.op}<span class="kind">${b.kind}</span></div>
        <div class="time tabular">${to12h(b.depMin)}<span class="sub">departs</span></div>
        <div class="time tabular">${b.dur}<span class="sub">on the road</span></div>
        <div class="fare tabular">₹${b.fare}</div>
        <div><span class="tag ${statusClass}">${statusLabel}</span></div>
        <div class="action">${departed ? '<button class="missedBtn">Missed it?</button>' : ''}</div>
      </div>
      <div class="missed-panel" id="missed-${i}"></div>`;
    }).join('');

    ledger.querySelectorAll('.missedBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('.row');
        const idx = row.dataset.idx;
        const panel = document.getElementById('missed-' + idx);
        const isOpen = panel.classList.contains('open');
        ledger.querySelectorAll('.missed-panel').forEach(p => p.classList.remove('open'));
        if (isOpen) return;
        const upcoming = buses.filter(b => b.depMin >= now).sort((a, b) => a.depMin - b.depMin);
        let nextHtml;
        if (upcoming.length) {
          const nb = upcoming[0];
          nextHtml = `<h4>Next bus: ${nb.op} (${nb.kind})</h4>
            <div>Departs ${to12h(nb.depMin)} — in ${fmtCountdown(nb.depMin - now)} · ₹${nb.fare}</div>`;
        } else {
          nextHtml = `<h4>No more buses on this route today</h4><div>Earliest option is tomorrow's first departure — check back in the morning.</div>`;
        }
        panel.innerHTML = nextHtml + `
          <div class="rests">
            <div style="font-weight:600; margin-top:0.5rem;">Nearby while you wait:</div>
            ${RESTS.map(r => `<div><span class="name">${r.name}</span><span class="dist">${r.dist}</span></div>`).join('')}
          </div>`;
        panel.classList.add('open');
      });
    });
  }

  document.getElementById('searchBtn').addEventListener('click', renderRoute);
  renderRoute();
})();

/* ============================================================
   REVIEWS & SAFETY (general)
   ============================================================ */
(function initReviews(){
  let signedIn = false;
  let postingName = '';

  const choiceBtns = document.getElementById('signinChoiceBtns');
  const googleForm = document.getElementById('googleForm');
  const phoneForm = document.getElementById('phoneForm');

  function showForm(form){
    choiceBtns.style.display = 'none';
    googleForm.classList.remove('show');
    phoneForm.classList.remove('show');
    form.classList.add('show');
  }
  function hideForms(){
    choiceBtns.style.display = '';
    googleForm.classList.remove('show');
    phoneForm.classList.remove('show');
  }

  function doSignIn(name){
    signedIn = true; postingName = name;
    hideForms();
    document.getElementById('signinBox').classList.add('signed-in');
    document.getElementById('postingAs').classList.add('show');
    document.getElementById('postingName').textContent = name;
    document.getElementById('reviewForm').classList.add('show');
  }

  document.getElementById('googleSignIn').addEventListener('click', () => showForm(googleForm));
  document.getElementById('phoneSignIn').addEventListener('click', () => showForm(phoneForm));
  document.getElementById('googleFormCancel').addEventListener('click', hideForms);
  document.getElementById('phoneFormCancel').addEventListener('click', hideForms);

  document.getElementById('googleFormSubmit').addEventListener('click', () => {
    const name = document.getElementById('googleNameInput').value.trim();
    const email = document.getElementById('googleEmailInput').value.trim();
    if (!name) { alert('Enter your name to continue.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Enter a valid Gmail ID to continue.'); return; }
    doSignIn(name);
  });
  document.getElementById('phoneFormSubmit').addEventListener('click', () => {
    const name = document.getElementById('phoneNameInput').value.trim();
    const phone = document.getElementById('phoneNumberInput').value.trim();
    if (!name) { alert('Enter your name to continue.'); return; }
    if (!/^[0-9+\-\s]{7,15}$/.test(phone)) { alert('Enter a valid mobile number to continue.'); return; }
    doSignIn(name);
  });

  document.getElementById('switchOut').addEventListener('click', () => {
    signedIn = false;
    document.getElementById('signinBox').classList.remove('signed-in');
    document.getElementById('postingAs').classList.remove('show');
    document.getElementById('reviewForm').classList.remove('show');
    document.getElementById('googleNameInput').value = '';
    document.getElementById('googleEmailInput').value = '';
    document.getElementById('phoneNameInput').value = '';
    document.getElementById('phoneNumberInput').value = '';
    hideForms();
  });

  let starVal = 0;
  document.querySelectorAll('#starInput span').forEach(s => {
    s.addEventListener('click', () => {
      starVal = parseInt(s.dataset.v, 10);
      document.querySelectorAll('#starInput span').forEach(x => x.classList.toggle('filled', parseInt(x.dataset.v, 10) <= starVal));
    });
  });

  function renderSiteReviews(){
    document.getElementById('existingList').innerHTML = SITE_REVIEWS.map(r => `
      <div class="review">
        <div class="who">${r.who} <span class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>${r.flag ? ' <span style="color:var(--warn); font-size:0.78rem;">⚠️ safety concern</span>' : ''}</div>
        <div>${r.text}</div>
      </div>`).join('');
  }
  renderSiteReviews();

  document.getElementById('postReviewBtn').addEventListener('click', () => {
    const text = document.getElementById('reviewText').value.trim();
    if (!signedIn) { alert('Sign in first to post a review.'); return; }
    if (starVal === 0 || !text) { alert('Add a star rating and a short review.'); return; }
    SITE_REVIEWS.unshift({ who: postingName, stars: starVal, text, flag: document.getElementById('safetyCheck').checked });
    renderSiteReviews();
    document.getElementById('reviewText').value = '';
    document.getElementById('safetyCheck').checked = false;
    starVal = 0;
    document.querySelectorAll('#starInput span').forEach(x => x.classList.remove('filled'));
  });

  document.getElementById('sendFeedbackBtn').addEventListener('click', () => {
    const text = document.getElementById('feedbackText').value.trim();
    if (!text) return;
    document.getElementById('feedbackThanks').style.display = 'block';
    document.getElementById('feedbackText').value = '';
  });
})();
