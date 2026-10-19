# Help Kit and Location Finder for Manipur Tourist Places

A free, no-login-required travel companion for exploring Manipur — find nearby hotels,
hospitals, cafés, restaurants, police stations and washrooms around 11 major tourist spots,
with live distances, a customizable multi-day trip planner, one-tap links to Google Maps,
Jugnoo (North-East India's auto/e-rickshaw/bike ride app), and each place's official website,
plus a Play-Store-style reviews and safety-reporting section.

## Folder structure

```
help-kit-manipur/
├── index.html          → Page structure (header, tabs, containers). Open this file to run the site.
├── css/
│   └── style.css       → All styling: colors, layout, light/dark theme, card & button design
├── js/
│   ├── data.js           → All content: tourist spots, hotels/hospitals/cafes/restaurants/police,
│   │                       the example itinerary
│   └── app.js             → All behavior: search, distance calculation, location handling,
│                           trip-planner generation, the sign-in gate, and the reviews/safety system
└── README.md            → This file
```

Nothing else is needed to just *run* the site — no build step, no database to install, no
server-side code required. It's a static site at its core.

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

## On the "🌐 Official Website" button

Every hotel, hospital, café, and restaurant card has this button.
- For **10 places** (Shija Hospitals, RIMS, and all 8 police stations, which link to the
  official Manipur Police portal) it links to a **confirmed real official website**.
- For everywhere else — most small local hotels, homestays, cafés, and restaurants — there is
  genuinely no official website (they run off Facebook/Instagram/Zomato instead of their own
  site), so rather than invent or guess a URL, the button opens a Google search for
  `"<place name> official website"` instead. This is intentional: it's more honest than a fake
  or broken link, and it still gets the visitor to the right place if one exists.
- To add a confirmed official site for any place, open `js/data.js` and add a `web:"https://..."`
  field to that place's object (see the Shija Hospitals or RIMS entries for the pattern).

## On the Jugnoo button

Every place card and trip-planner stop has a "🛺 Jugnoo" link next to "🧭 Directions." It's a
**plain `https://www.jugnoo.in/...` link** — built the exact same way as the Google Maps
Directions link (a normal `<a href>`, no JavaScript app-launching tricks) — with the current
location (if known) and the destination attached as URL parameters (`pickup_lat`, `pickup_lng`,
`drop_lat`, `drop_lng`, `drop_address`).

**Honesty note:** Jugnoo has not published an official deep-link specification, so there's no
confirmed way to make their app open directly with these points pre-filled. Whether tapping this
link opens their *app* automatically (with a native "open in app?" prompt) or just their
*website* depends entirely on whether Jugnoo has registered Android App Links / iOS Universal
Links for `jugnoo.in` on their end — that's outside this site's control. An earlier version of
this feature tried to force-launch the app via a custom `intent://`/`jugnoo://` link triggered
by JavaScript; that approach was unreliable (it only works when the browser is certain a tap
triggered it directly, which breaks easily in embedded/preview contexts), so it was replaced
with this simpler, more universally reliable plain link.

## ⚠️ Important: the Reviews & Safety tab needs a real backend to be *shared*

This copy of the site includes a "🗣️ Reviews & Safety" tab where visitors can:
- Leave a star rating + written review for any tourist spot, hotel, café, restaurant,
  hospital or police station.
- Flag a safety concern (crisis, conflict, accidental fight, etc.) so other travellers see it.
- Send general feedback about the website itself.
- Sign in first (via "Continue with Google" or "Continue with Mobile Number") so every post —
  review, safety report, or site feedback — carries a name. Both forms share one sign-in gate.

**How this behaves depends on where the file is opened:**
- When viewed through the original published link this was built from, reviews are backed
  by a real shared data store — everyone who opens that link sees the same list, live.
- **When you host this exported copy yourself** (GitHub Pages, Netlify, your own server, etc.),
  there is no shared backend wired up, so the code automatically falls back to
  **`localStorage`** — each visitor's reviews are saved only in *their own browser* and are
  **not visible to other visitors**. You'll still see your own entries persist across visits
  on the same device, but it won't work as a shared public review board until you connect
  a real database.

**To make reviews genuinely shared on your own hosting**, you'd need to wire `js/app.js`'s
`dbMode` functions (`initReviewsSystem`, `selectReviewTarget`, the submit handlers) up to a
real backend — e.g. Firebase Firestore, Supabase, or a small custom API. The code is already
structured so that swapping in a different backend only touches those functions — everything
else (the UI, the star picker, the safety flagging, the sign-in gate) stays the same.

**On the sign-in gate itself, to be fully transparent:** neither the "Google" nor the "Mobile
Number" option in this exported copy performs real verification — there's no server here to
run OAuth or send an SMS code. Both simply ask for a name (and email or phone number, used only
to validate format, never stored) before unlocking the review/feedback forms. This stops silent,
nameless posting, but it is not fraud-proof identity verification. Real verification would need
an actual auth provider (Firebase Auth, Auth0, Google Identity Services, etc.) wired into a
real backend.

## Editing the data

- To add/edit hotels, hospitals, cafés, restaurants, police stations, or tourist spots: open
  `js/data.js`. Each entry is a plain JavaScript object — copy an existing one and change the values.
- To change colors, fonts, or spacing: open `css/style.css` and edit the `:root` CSS variables
  near the top for a quick global re-theme.
- To change behavior (search logic, itinerary generation, price estimates, the sign-in gate,
  the reviews system, the Jugnoo link, or the official-website link): open `js/app.js`.

## Notes on data accuracy

- Place details (names, ratings, coordinates, phone numbers, official websites) come from data
  gathered at the time this site was built — verify anything time-sensitive (hours, prices,
  phone numbers, live websites) independently.
- Hotel AC/Non-AC price ranges are **estimates** based on general price tier, not live rates.
- "Use my location" and "Enter location manually" both use the browser's own geolocation
  permission or manual input — no account is required to use the map/finder features.
