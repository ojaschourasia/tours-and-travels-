/* ==========================================================
   Help Kit Manipur — data.js
   All sample data lives here. Replace with a real API (Google
   Places, a transport operator feed, your own backend) later —
   the rest of the app just reads these arrays/objects, so
   swapping the source doesn't require touching app.js's logic,
   only how these variables get filled in.
   ========================================================== */

const IMPHAL_CENTER = { lat: 24.8170, lng: 93.9368 };
const KANGLA_FORT = { lat: 24.8087, lng: 93.9533 }; // default distance anchor when location isn't set yet

/* ---------- Explore Nearby: SAMPLE places around Imphal ----------
   category keys used for the filter chips/tabs: Hotel, Restaurant,
   Cafe, Hospital, Police, Pharmacy, ATM. These are fictional
   placeholder businesses (names, phone numbers, ratings) used only
   when no live Google Places key is configured — see js/config.js. */
const POIS = [
  // Hotels — priceTier 1=Budget 2=Mid-range 3=Comfort 4=Premium
  { name:'Hotel Classic Grande',      cat:'Hotel', emoji:'🏨', lat:24.8130, lng:93.9410, rating:4.2, reviews:2455, priceTier:2, tag:'Central location', address:'North A.O.C, Imphal', phone:'+91 88374 40054', website:'' },
  { name:'Cloud 9 Residency',         cat:'Hotel', emoji:'🏨', lat:24.8200, lng:93.9300, rating:4.0, reviews:310,  priceTier:2, tag:'Mid-range', address:'Keishampat, Imphal', phone:'+91 98560 11223', website:'' },
  { name:'Hotel Daani Continental',   cat:'Hotel', emoji:'🏨', lat:24.8260, lng:93.9420, rating:4.4, reviews:360,  priceTier:2, tag:'Mid-range', address:'Thangmeiband, Imphal', phone:'+91 97740 22310', website:'' },
  { name:'Aurora Boutique Hotel',     cat:'Hotel', emoji:'🏨', lat:24.8090, lng:93.9350, rating:4.7, reviews:679,  priceTier:3, tag:'Popular', address:'Polo Ground Rd, Paona Bazar, Imphal', phone:'+91 70058 36160', website:'' },
  { name:'THE PADMA Hotel',           cat:'Hotel', emoji:'🏨', lat:24.8050, lng:93.9480, rating:4.1, reviews:159,  priceTier:2, tag:'Mid-range', address:'Thangal Bazar, Imphal', phone:'+91 94020 55781', website:'' },
  { name:'Hotel Imphal',              cat:'Hotel', emoji:'🏨', lat:24.8050, lng:93.9390, rating:3.9, reviews:540,  priceTier:2, tag:'Mid-range', address:'North A.O.C, Imphal', phone:'+91 93020 44112', website:'' },

  // Restaurants
  { name:'Ima Keithel Food Court',    cat:'Restaurant', emoji:'🍽️', lat:24.8155, lng:93.9387, rating:4.3, reviews:890, priceTier:1, tag:'Local favourite', address:'Khwairamband Bazar, Imphal', phone:'+91 90850 11200', website:'' },
  { name:'Luxmi Kitchen',             cat:'Restaurant', emoji:'🍽️', lat:24.8190, lng:93.9355, rating:4.1, reviews:410, priceTier:2, tag:'Mid-range', address:'Paona Bazar, Imphal', phone:'+91 87014 55690', website:'' },
  { name:'Yaifarol Restaurant',       cat:'Restaurant', emoji:'🍽️', lat:24.8070, lng:93.9420, rating:4.4, reviews:265, priceTier:2, tag:'Popular', address:'Thangal Bazar, Imphal', phone:'+91 86010 22345', website:'' },
  { name:'The Sapphire Grand',        cat:'Restaurant', emoji:'🍽️', lat:24.8220, lng:93.9395, rating:4.5, reviews:530, priceTier:3, tag:'Popular', address:'Khoyathong Rd, Imphal', phone:'+91 99570 88123', website:'' },

  // Cafes
  { name:'Café Tea Table',            cat:'Cafe', emoji:'☕', lat:24.8180, lng:93.9340, rating:4.2, reviews:188, priceTier:2, tag:'Mid-range', address:'Thangal Bazar, Imphal', phone:'+91 88120 33456', website:'' },
  { name:'Barista Lounge Imphal',     cat:'Cafe', emoji:'☕', lat:24.8160, lng:93.9400, rating:4.0, reviews:140, priceTier:2, tag:'Mid-range', address:'Paona Bazar, Imphal', phone:'+91 97740 99021', website:'' },
  { name:'The Daily Brew',            cat:'Cafe', emoji:'☕', lat:24.8240, lng:93.9360, rating:4.3, reviews:96,  priceTier:2, tag:'Mid-range', address:'Singjamei, Imphal', phone:'+91 90854 11670', website:'' },

  // Hospitals
  { name:'RIMS Hospital',             cat:'Hospital', emoji:'🏥', lat:24.7900, lng:93.9380, rating:3.8, reviews:3200, priceTier:0, tag:'Government · 24×7 emergency', address:'Lamphelpat, Imphal', phone:'+91 385 2414 591', website:'' },
  { name:'Shija Hospitals',           cat:'Hospital', emoji:'🏥', lat:24.8300, lng:93.9450, rating:4.3, reviews:980,  priceTier:0, tag:'Private · 24×7 emergency', address:'Langol, Imphal', phone:'+91 385 2591 466', website:'' },
  { name:'Babina Diagnostics & Hospital', cat:'Hospital', emoji:'🏥', lat:24.8260, lng:93.9280, rating:4.1, reviews:410, priceTier:0, tag:'Private · 24×7 emergency', address:'Thangmeiband, Imphal', phone:'+91 385 2443 210', website:'' },

  // Police stations
  { name:'Imphal Police Station',     cat:'Police', emoji:'🚓', lat:24.8090, lng:93.9410, rating:3.6, reviews:88, priceTier:0, tag:'24×7', address:'Near Kangla, Imphal', phone:'100', website:'' },
  { name:'Lamphel Police Station',    cat:'Police', emoji:'🚓', lat:24.8020, lng:93.9230, rating:3.5, reviews:52, priceTier:0, tag:'24×7', address:'Lamphel, Imphal', phone:'100', website:'' },
  { name:'Porompat Police Station',   cat:'Police', emoji:'🚓', lat:24.8310, lng:93.9550, rating:3.7, reviews:40, priceTier:0, tag:'24×7', address:'Porompat, Imphal', phone:'100', website:'' },

  // Pharmacies
  { name:'City Pharmacy',             cat:'Pharmacy', emoji:'💊', lat:24.8150, lng:93.9375, rating:4.2, reviews:120, priceTier:1, tag:'Open late', address:'Thangal Bazar, Imphal', phone:'+91 94020 11567', website:'' },
  { name:'Apollo Pharmacy Imphal',    cat:'Pharmacy', emoji:'💊', lat:24.8070, lng:93.9340, rating:4.4, reviews:210, priceTier:2, tag:'Chain pharmacy', address:'Paona Bazar, Imphal', phone:'+91 86010 77894', website:'' },

  // ATMs
  { name:'SBI ATM, Thangal Bazar',    cat:'ATM', emoji:'🏧', lat:24.8140, lng:93.9395, rating:3.4, reviews:18, priceTier:0, tag:'', address:'Thangal Bazar, Imphal', phone:'', website:'' },
  { name:'HDFC ATM, Paona Bazar',     cat:'ATM', emoji:'🏧', lat:24.8170, lng:93.9385, rating:3.3, reviews:12, priceTier:0, tag:'', address:'Paona Bazar, Imphal', phone:'', website:'' },
];

/* ---------- Price-tier estimates, used for both live Places
   results (via price_level) and the sample POIS above ---------- */
const HOTEL_PRICE_TIERS = {
  0: { label:'Free',     nonAC:[0,0],       ac:[0,0]       },
  1: { label:'Budget',   nonAC:[600,1000],  ac:[1000,1600] },
  2: { label:'Mid-range',nonAC:[1000,1600], ac:[1600,2600] },
  3: { label:'Comfort',  nonAC:[1800,2600], ac:[2600,4200] },
  4: { label:'Premium',  nonAC:[3000,4500], ac:[4500,7000] },
};
const FOOD_PRICE_TIERS = {
  0: { label:'Free',      cost:'Free' },
  1: { label:'Budget',    cost:'₹150–300 for two' },
  2: { label:'Mid-range', cost:'₹400–800 for two' },
  3: { label:'Comfort',   cost:'₹800–1500 for two' },
  4: { label:'Premium',   cost:'₹1500+ for two' },
};
const CAFE_PRICE_TIERS = {
  0: { label:'Free',      cost:'Free' },
  1: { label:'Budget',    cost:'₹60–120 a cup' },
  2: { label:'Mid-range', cost:'₹120–220 a cup' },
  3: { label:'Comfort',   cost:'₹220–350 a cup' },
  4: { label:'Premium',   cost:'₹350+ a cup' },
};

/* ---------- Trip Planner: tourist places across Manipur ----------
   visitMins = typical time to spend there, used by the day
   scheduler to decide how many stops fit before 4:30 PM.         */
const PLACES = {
  'Kangla Fort':                     { lat:24.8087, lng:93.9533, popular:true,  visitMins:90,  desc:"Ancient seat of the Meitei kings, with the Kangla Museum, sacred ponds and temple ruins.", entry:'₹20 (Indians)' },
  'Shree Govindajee Temple':         { lat:24.8070, lng:93.9500, popular:true,  visitMins:45,  desc:'Gold-domed Vaishnavite temple next to Kangla, famous for evening aarti. Open daily.', entry:'Free entry' },
  'Ima Keithel Market':              { lat:24.8155, lng:93.9387, popular:true,  visitMins:75,  desc:"Asia's largest all-women-run market — textiles, produce and handicrafts across three blocks.", entry:'Free entry' },
  'War Cemetery, Imphal':            { lat:24.8050, lng:93.9450, popular:false, visitMins:30,  desc:'Commonwealth war graves from WWII, quiet and well-kept gardens.', entry:'Free entry' },
  'Khonghampat Orchidarium':         { lat:24.8700, lng:93.9300, popular:false, visitMins:45,  desc:'Government orchid sanctuary with hundreds of native species, best visited Feb–Apr.', entry:'₹10' },
  'Loktak Lake':                     { lat:24.5464, lng:93.8403, popular:true,  visitMins:120, desc:'Largest freshwater lake in Northeast India, famous for its floating phumdi islands.', entry:'Free (boat rides extra)' },
  'Sendra Park & Resort, Loktak':    { lat:24.5400, lng:93.8300, popular:true,  visitMins:90,  desc:'Viewpoint and park overlooking Loktak Lake, good for sunset photos.', entry:'₹30' },
  'Keibul Lamjao National Park':     { lat:24.5167, lng:93.8167, popular:false, visitMins:120, desc:"The world's only floating national park, home to the endangered sangai deer.", entry:'₹50 (Indians)' },
  'Andro Village':                   { lat:24.7667, lng:94.0167, popular:false, visitMins:90,  desc:'Heritage village known for pottery, local rice-beer brewing and a small museum.', entry:'Free entry' },
  'Nongmaiching Hill':               { lat:24.7500, lng:94.0500, popular:false, visitMins:90,  desc:'Forested hill with viewpoints over the Imphal valley, popular for short hikes.', entry:'Free entry' },
  'Khongjom War Memorial':           { lat:24.6333, lng:93.9000, popular:false, visitMins:45,  desc:'Memorial to the 1891 Anglo-Manipuri War, on the Imphal–Moirang highway.', entry:'Free entry' },
  'Bishnupur':                       { lat:24.6333, lng:93.7667, popular:false, visitMins:60,  desc:'Town near Loktak known for traditional pottery and handloom weaving.', entry:'Free entry' },
  'INA Museum, Moirang':             { lat:24.4989, lng:93.7719, popular:true,  visitMins:60,  desc:'Marks where the Indian National Army first raised its flag on Indian soil in 1944.', entry:'₹15' },
  'Singda Dam':                      { lat:24.8667, lng:93.8667, popular:false, visitMins:45,  desc:'Reservoir and dam with a quiet picnic spot, popular with locals on weekends.', entry:'Free entry' },
  'Shirui Hills, Ukhrul':            { lat:25.2667, lng:94.3833, popular:false, visitMins:150, desc:'Home to the rare Shirui Lily, in bloom May–June; a full-day trip from Imphal.', entry:'Free entry' },
  'Moreh (India–Myanmar border)':    { lat:24.2333, lng:94.3000, popular:false, visitMins:90,  desc:'Border trade town with a bustling market of Southeast Asian goods.', entry:'Free entry' },
};
const EXAMPLE_ORDER = [
  'Kangla Fort', 'Shree Govindajee Temple', 'Ima Keithel Market',
  'War Cemetery, Imphal', 'Loktak Lake', 'Sendra Park & Resort, Loktak',
  'INA Museum, Moirang', 'Bishnupur'
];

/* ---------- Landmark search/chip dataset for Explore Nearby ---------
   A curated subset of PLACES with description + entry fee, used by
   the search box and horizontal "spot chip" scroller.               */
const LANDMARK_NAMES = [
  'Kangla Fort', 'Shree Govindajee Temple', 'Ima Keithel Market',
  'Loktak Lake', 'Sendra Park & Resort, Loktak', 'INA Museum, Moirang',
  'Khonghampat Orchidarium', 'Andro Village'
];

/* ---------- Bus Routes ---------- */
const ROUTES = {
  'Imphal>Guwahati': { label:'Imphal → Guwahati', distance:'≈540 km', buses:[
    {op:'Manipur State Transport', kind:'Volvo A/C',      dep:'16:00', dur:'14h',    fare:750,  rating:4.1},
    {op:'Network Travels',         kind:'A/C Sleeper',    dep:'18:30', dur:'14h',    fare:1100, rating:4.4},
    {op:'Blue Hill Travels',       kind:'Non-A/C Seater', dep:'15:00', dur:'15h',    fare:650,  rating:3.6},
  ]},
  'Imphal>Dimapur': { label:'Imphal → Dimapur', distance:'≈215 km', buses:[
    {op:'Manipur State Transport', kind:'Express',    dep:'07:00', dur:'7h',    fare:350, rating:4.0},
    {op:'Royal Cruiser',           kind:'A/C Seater', dep:'08:30', dur:'6h 30m',fare:450, rating:4.3},
  ]},
  'Imphal>Kohima': { label:'Imphal → Kohima', distance:'≈140 km', buses:[
    {op:'Manipur State Transport', kind:'Hill Route', dep:'06:30', dur:'5h',    fare:280, rating:3.9},
    {op:'Tangkhul Travels',        kind:'Seater',     dep:'09:00', dur:'5h 30m',fare:320, rating:4.0},
  ]},
  'Imphal>Silchar': { label:'Imphal → Silchar', distance:'≈190 km', buses:[
    {op:'Manipur State Transport', kind:'Express',    dep:'07:00', dur:'6h', fare:300, rating:3.8},
    {op:'Cachar Express',          kind:'A/C Seater', dep:'13:00', dur:'6h', fare:400, rating:4.2},
  ]},
  'Imphal>Shillong': { label:'Imphal → Shillong', distance:'≈550 km, via Silchar', buses:[
    {op:'Network Travels', kind:'A/C Sleeper', dep:'16:30', dur:'13h 30m', fare:1050, rating:4.2},
  ]},
  'Imphal>Agartala': { label:'Imphal → Agartala', distance:'≈470 km, via Silchar', buses:[
    {op:'Tripura Link Travels', kind:'A/C Sleeper', dep:'15:00', dur:'14h', fare:900, rating:3.9},
  ]},
  'Imphal>Aizawl': { label:'Imphal → Aizawl', distance:'≈370 km, via Silchar', buses:[
    {op:'Zoram Yatra', kind:'A/C Seater', dep:'17:00', dur:'11h', fare:850, rating:4.1},
  ]},
};
const CONNECTIONS = {
  'Imphal>Itanagar': 'No direct operator listed yet. Fastest option: take the Imphal → Guwahati bus, then a Guwahati → Itanagar connection.',
};
function notFromImphalMessage(from){
  return `No direct operator listed from ${from} yet. The fastest option is to connect via Imphal first.`;
}

const RESTS = [
  { name:'Ima Keithel Food Court',        dist:'5 min walk' },
  { name:'Hotel Nirmala Residency',       dist:'10 min walk — luggage storage' },
  { name:'ISBT 24×7 waiting lounge',      dist:'on site' },
];
const ROUTE_REVIEWS = [
  { who:'Rupa, verified traveller', stars:'★★★★★', text:'Bus left right on time and the driver announced every stop. Would book again.' },
  { who:'Somorjit',                 stars:'★★★★☆', text:'A/C was a little weak after midnight but the ride overall was smooth.' },
  { who:'Lily',                     stars:'★★★☆☆', text:'We were about 40 minutes late because of road repair near the border — worth building in buffer time.' },
];

/* ---------- Reviews & Safety: seed reviews ---------- */
let SITE_REVIEWS = [
  { who:'Bijoy',   stars:4, text:'Kangla Fort was peaceful early morning — go before 9am to avoid the heat.', flag:false },
  { who:'Chaoba',  stars:5, text:'Loktak Lake boat ride was the highlight of the trip. Book through a local guide for a fair price.', flag:false },
  { who:'Thoibi',  stars:2, text:'Felt unsafe walking alone near the Andro road after dark — no lighting at all. Go in daylight.', flag:true },
];
