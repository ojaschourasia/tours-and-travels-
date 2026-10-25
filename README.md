# Help Kit Manipur

A free, no-login trip companion for Manipur — nearby essentials with live
distances, a time-aware day-by-day trip planner, inter-state bus timetables,
flight links, and traveller safety reviews.

## Project structure
```
index.html        — all page markup, links to the two files below
css/style.css      — all styling
js/data.js         — all sample data (places, bus routes, reviews) — loads FIRST
js/app.js          — all interactive behaviour + the Google Places API key — loads SECOND
```
**Keep this exact structure and these exact filenames/folder names** (all
lowercase) when you upload to GitHub — the paths inside `index.html` are
case-sensitive on GitHub Pages and Render, unlike on some Windows setups.
`index.html` loads `js/data.js` before `js/app.js` on purpose — `app.js` reads
data that `data.js` defines, so that order matters if you ever reorganize it.

## Run it locally
Open `index.html` directly in a browser — no server, no build step. (Browsers
restrict geolocation on a plain `file://` link; if "Use my location" doesn't
prompt you, serve it locally instead — `python3 -m http.server` from this
folder, then visit `http://localhost:8000` — or just deploy it, see below.)

## Upload to GitHub
1. Create a new repository.
2. Upload all of it, **keeping the folder structure**: `index.html`,
   the `css` folder (with `style.css` inside), the `js` folder (with
   `data.js` and `app.js` inside), and `README.md`.
   - On github.com's web uploader, drag the whole `css` and `js` folders in
     at once rather than the files individually, so the folder structure is
     preserved. If you're using git from a terminal, `git add .` from inside
     this folder does this correctly automatically.
3. Commit. Double-check on GitHub's file browser that you see `css/style.css`
   and `js/data.js` + `js/app.js` nested inside folders, not sitting loose
   in the repo root — that's the single most common way this kind of project
   breaks on a host.

## Deploy on Render (same host as the original site)
1. Push this repo to GitHub (above).
2. On [render.com](https://render.com): **New → Static Site**, connect that repository.
3. Leave **Build Command** empty. Set **Publish Directory** to `.` (the repo root).
4. **Create Static Site.** Render gives you a live `https://<your-site-name>.onrender.com`
   URL, usually within a minute.

## Deploy on GitHub Pages instead
1. Repo **Settings → Pages → Build and deployment → Source**: "Deploy from a branch".
2. Branch: `main`, folder: `/ (root)`. Save.
3. Live within a minute or two at `https://<your-username>.github.io/<repo-name>/`.

## Go live with real Google Places data (optional)
Open `js/app.js` and look at the very first line:
```js
const GOOGLE_PLACES_API_KEY = "";
```
Paste a free key between the quotes. There is no separate config file — this
is the only place the key lives.
1. [console.cloud.google.com](https://console.cloud.google.com) → create/select a project.
2. **APIs & Services → Library** — enable **"Places API"** and **"Maps JavaScript API"**.
3. **APIs & Services → Credentials → Create Credentials → API key.**
4. Restrict the key: **Application restrictions → HTTP referrers**, add your
   site's URL (e.g. `https://your-site-name.onrender.com/*`); **API restrictions**
   → limit it to the two APIs above.
5. Google requires a billing account even for the free tier, but the recurring
   free monthly allowance comfortably covers a site like this — set a budget
   alert (**Billing → Budgets & alerts**) so you're notified before anything
   would ever be charged.
6. Save, redeploy. Explore Nearby now pulls real hotels, restaurants, cafes,
   hospitals, police stations, pharmacies and ATMs, with real ratings, review
   counts, and "Open now" status.

**Leave the key blank and the site runs perfectly on its built-in sample
data** — nothing breaks either way, and a bad key, a quota issue, or no
billing set up all fall back to the sample data automatically with a clear
on-page notice, never a broken page.

## What's real vs. sample
- **Always real, no key needed:** browser geolocation, distance calculations,
  the Google Maps / Directions / write-a-review links, the IndiGo/Air
  India/Jugnoo links, and the time-aware trip planner's scheduling logic.
- **Real only with a key (see above):** the actual hotels/restaurants/cafes/
  hospitals/police/pharmacies/ATMs shown in Explore Nearby, their ratings,
  phone numbers and websites.
- **Always sample data:** bus operator names/times/fares (no public live feed
  exists for Manipur's bus operators yet) and the seeded reviews.

## One known limitation, not a bug
Inside Claude's own chat preview, "Use my location" may not get a GPS fix —
the preview runs the page inside a sandboxed iframe, which browsers block
geolocation inside by default. The button handles this gracefully (a clear
message after a few seconds, never a hang). Once deployed on Render or GitHub
Pages, the page is a normal top-level site and geolocation works the ordinary
way — no code changes needed.
