# Help Kit Manipur — Tours & Travels

A free trip-companion website for Manipur: nearby hotels/restaurants/hospitals/police
stations with live distances, a day-by-day trip planner, a bus timetable with a
"missed it?" fallback, flight links, and traveller reviews & safety reports.

Plain HTML/CSS/JS, no build step, no server required.

```
index.html
css/style.css
js/config.js ← your Google Places API key goes here (optional — see below)
js/data.js   ← all sample data (places, bus routes, reviews) — edit this first
js/app.js    ← all interactive behaviour
```

## Run it locally
Just open `index.html` in a browser. (Opening it via `file://` is fine, but some
browsers restrict geolocation on `file://` — if "Use my location" doesn't prompt,
use "Enter location manually" instead, or serve it locally, e.g. `python3 -m http.server`.)

## Put it on GitHub Pages (free hosting)
1. Create a new GitHub repository and push these three items (`index.html`, `css/`, `js/`) to its root — and `README.md` if you'd like.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick the `main` branch and `/ (root)` folder, then **Save**.
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Live nearby results (Google Places API)
By default, "Explore Nearby" uses the sample list in `js/data.js`. To make it pull
real, live places around the user — exactly like the original site — give it a
free Google Places API key:

1. Go to [console.cloud.google.com](https://console.cloud.google.com), sign in,
   and create (or select) a project.
2. **APIs & Services → Library** — enable **"Places API"** and **"Maps JavaScript API"**.
3. **APIs & Services → Credentials → Create Credentials → API key.**
4. Click the new key and lock it down (important — an unrestricted key is a liability):
   - **Application restrictions:** HTTP referrers → add your GitHub Pages URL
     (e.g. `https://your-username.github.io/*`) and, for local testing,
     `http://localhost:8000/*`.
   - **API restrictions:** restrict the key to just "Places API" and "Maps JavaScript API".
5. Google requires a billing account linked even to use the free tier — it comes
   with a recurring free usage allowance that comfortably covers a small site like
   this one. In **Billing → Budgets & alerts**, set a budget alert (e.g. $5) so
   you're notified well before anything is ever charged.
6. Paste the key into `js/config.js`:
   ```js
   const GOOGLE_PLACES_API_KEY = "your-key-here";
   ```
7. Push the change and reload the site. "Explore Nearby" will now show real
   hotels, restaurants, cafes, hospitals, police stations, pharmacies and ATMs
   around whatever location is set, sorted by real distance, with rating,
   review count, an "Open now"/"Closed" tag, and working **View on Maps**,
   **Directions**, **Official Website** and **Call** buttons.

**A note on cost:** ratings, review counts, price level, address and open-now
status come back for free with the nearby search itself. Phone number and
website require a separate "Place Details" call per business, which Google
bills slightly differently — to keep this cheap, the app only fetches those
details for the category you're actually looking at (tap "Hotels", then
"Restaurants", etc.), never all seven categories at once.

**Nothing breaks if you skip this.** Leave `GOOGLE_PLACES_API_KEY` blank and the
page automatically uses the sample list — same for an invalid key, a network
error, or a quota/billing issue: Explore Nearby quietly falls back to the saved
sample data and shows a one-line notice instead of breaking.

## Explore Nearby — what each button does
- **View on Maps** — opens the exact place on Google Maps (uses its `place_id` when live, a name+address search otherwise).
- **Directions** — opens Google Maps turn-by-turn directions to that place.
- **Jugnoo** — opens [jugnoo.in](https://www.jugnoo.in/), a real regional ride-booking service; this is a plain link to their site, not an in-app booking integration.
- **Official Website / Read-write reviews / Call** — only shown when that data is actually available (Place Details for live results, or the sample contact info in `js/data.js`). In sample mode, "Read/write reviews" jumps to the site's own Reviews & Safety tab instead of Google's.
- **AC/Non-AC price, "avg cost for two", etc.** — Google doesn't expose real room rates or menu prices, so these are estimate ranges derived from Google's 0–4 `price_level` signal (or a fixed tier in sample mode), always labelled "(estimate — confirm with business)".

## Trip Planner scheduling
The planner simulates each day starting at 9:00 AM, estimates travel time
between stops (25 km/h average, reflecting winding hill roads) plus a typical
visit length per place, and stops adding new sightseeing once the *next* stop
would arrive at or after 4:30 PM — matching the sunset-safety guidance shown
on the page. Instead, each day ends with a "settle in for the night" block
suggesting the nearest restaurant and hotel to wherever that day's last stop
was. Up to 15 days are supported; anything that doesn't fit is listed at the
bottom so you know to add another day.

## What's real vs. sample data
- **Real and working:** browser geolocation, distance calculations, the Google Maps
  washroom-search link, the IndiGo/Air India links, and all of the client-side logic
  (filtering, sorting, the trip planner, the bus "missed it?" flow, posting a review).
- **Sample/placeholder by default, real if you add a key:** the hotels/restaurants/
  hospitals/police stations list uses `js/data.js` unless you add a Google Places
  API key to `js/config.js` (see above), at which point it switches to live results
  automatically. The bus operators/times/fares and seeded reviews are still sample
  data — there's no public live feed for Manipur's bus operators to plug in yet.
- **Not persisted:** sign-in, posted reviews, and feedback only exist in the browser
  tab for that session — there's no backend or database behind them yet.
