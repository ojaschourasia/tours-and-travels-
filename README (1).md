# Help Kit Manipur

A free, no-login-required travel companion for exploring Manipur — find nearby hotels,
hospitals, cafés, restaurants, police stations and washrooms around 16 major tourist spots,
with live distances, a customizable multi-day trip planner, indicative bus timetables,
links to book flights, one-tap links to Google Maps, Jugnoo (North-East India's auto/
e-rickshaw/bike ride app), and each place's official website — plus a Play-Store-style
reviews and safety-reporting section.

## Folder structure

```
help-kit-manipur/
├── index.html          → Page structure (header, hamburger drawer, all 5 sections). Open this to run the site.
├── css/
│   └── style.css       → All styling: warm cream + dark-green theme, Playfair Display headings,
│                         card design, drawer/hamburger menu
├── js/
│   ├── data.js           → All content: 16 tourist spots, hotels/hospitals/cafes/restaurants/police,
│   │                       the example itinerary, bus routes, flights
│   └── app.js             → All behavior: search, distance calculation, location handling,
│                           trip-planner generation, the sign-in gate, bus search, and the
│                           reviews/safety system
└── README.md            → This file
```

Nothing else is needed to just *run* the site — no build step, no database to install, no
server-side code required. It's a static site at its core.

## Navigation

The site is organized into 5 sections, reached via the **☰ hamburger menu** in the top-left of
the header:
1. **📍 Explore nearby** — hotels, hospitals, cafés, restaurants, police stations, washrooms
   around any of 16 tourist spots, with live distance, search, and official-website/Jugnoo/
   Maps links on every card.
2. **🗺️ Trip planner** — pick a number of days and which spots to visit; it builds a
   day-by-day route ordered by distance, with night-stay suggestions for each evening.
3. **🚌 Bus routes** — pick a From/To and see operator, departure time, duration and fare for
   the route.
4. **✈️ Flights** — links straight out to the official booking sites of the airlines that
   actually serve Imphal Airport (IndiGo, Air India, Alliance Air).
5. **⚠️ Reviews & safety** — read or post a star rating/review for any place, including a
   dedicated safety-report flag, gated by a simple sign-in.

## Running it locally

Double-click `index.html`, or open it in any browser.
(Some browsers restrict `fetch`/geolocation on `file://` URLs — if "Use my location" doesn't
prompt, use one of the hosting options below instead.)

## Hosting it for free (so it has a real, shareable URL)

Pick any one:

1. **Netlify Drop** — https://app.netlify.com/drop — drag the whole `help-kit-manipur` folder
   onto the page. You get a live URL immediately.
2. **GitHub Pages** — create a free GitHub repo, upload all these files (keeping the folder
   structure), then in the repo's Settings → Pages, enable Pages from the main branch.
3. **Vercel** or **Firebase Hosting** — similar drag-and-deploy free tiers.

## Getting it into Google Search

Hosting alone doesn't make Google find it. After hosting:
1. Go to Google Search Console (search.google.com/search-console).
2. Add and verify your new site's URL.
3. Submit the URL for indexing.
Google typically crawls and lists it within a few days to a couple of weeks.

## On the Bus Routes section

**Important honesty note:** the fares, departure times and operator names in `BUS_ROUTES`
(inside `js/data.js`) are **indicative/sample schedules**, not a live feed — there's no public
real-time API for Manipur's state transport or private bus operators. The page says this
directly above the search results. Always confirm the actual time and fare at the ticket
counter or with the operator before travelling. To update a route, edit the `BUS_ROUTES`
object in `js/data.js`.

## On the "🌐 Official Website" button

Every hotel, hospital, café, and restaurant card has this button.
- For **10 places** (Shija Hospitals, RIMS, and all 8 police stations, which link to the
  official Manipur Police portal) it links to a **confirmed real official website**.
- For everywhere else, there is genuinely no official website for most small local hotels,
  homestays, cafés, and restaurants (they run off Facebook/Instagram/Zomato instead), so the
  button opens a Google search for `"<place name> official website"` instead of guessing a URL.
- To add a confirmed official site for any place, open `js/data.js` and add a `web:"https://..."`
  field to that place's object.

## On the Jugnoo button

Every place card and trip-planner stop has a "🛺 Jugnoo" link next to "🧭 Directions." It's a
**plain `https://www.jugnoo.in/...` link** (same mechanism as the Google Maps Directions link)
with the current location (if known) and destination attached as URL parameters. Jugnoo hasn't
published an official deep-link spec, so whether it opens their app directly or just their
website depends on whether they've registered Android App Links / iOS Universal Links on their
end — outside this site's control.

## ⚠️ Important: the Reviews & Safety section needs a real backend to be *shared*

This section lets visitors leave a star rating + review for any place, flag a safety concern
(crisis, conflict, accidental fight, etc.), or send general site feedback — gated by a sign-in
step ("Continue with Google" or "Continue with Mobile Number") so posts carry a name.

**How this behaves depends on where the file is opened:**
- Through the original published link this was built from, reviews are backed by a real shared
  data store — everyone who opens that link sees the same list, live.
- **When you host this exported copy yourself**, there is no shared backend wired up, so the
  code automatically falls back to `localStorage` — each visitor's reviews are private to their
  own browser, not shared. To make it genuinely shared on your own hosting, wire `js/app.js`'s
  `dbMode` functions up to a real backend (Firebase Firestore, Supabase, a small custom API).

**On the sign-in gate itself:** neither option performs real verification — there's no server
here to run OAuth or send an SMS code. Both just ask for a name (and email or phone number,
used only to check the format, never stored) before unlocking the forms. This stops silent,
nameless posting, but it is not fraud-proof identity verification.

## Editing the data

- To add/edit hotels, hospitals, cafés, restaurants, police stations, tourist spots, bus routes,
  or flights: open `js/data.js`.
- To change colors, fonts, or spacing: open `css/style.css` and edit the `:root` CSS variables
  near the top for a quick global re-theme.
- To change behavior (search, trip planner, sign-in gate, reviews, bus search, drawer
  navigation): open `js/app.js`.

## Notes on data accuracy

- Place details (names, ratings, coordinates, phone numbers, official websites) come from data
  gathered at the time this site was built — verify anything time-sensitive independently.
- Hotel AC/Non-AC price ranges are **estimates** based on general price tier, not live rates.
- Bus schedules and fares are **indicative samples**, not a live feed.
- "Use my location" and "Enter location manually" both use the browser's own geolocation
  permission or manual input — no account is required to use the map/finder/bus/flight features.
