# Help Kit and Location Finder for Manipur Tourist Places

A free, no-login travel companion for exploring Manipur — find nearby hotels, hospitals,
cafés, restaurants and washrooms around 11 major tourist spots, with live distances and
a customizable multi-day trip planner.

## Folder structure

```
help-kit-manipur/
├── index.html          → Page structure (header, tabs, containers). Open this file to run the site.
├── css/
│   └── style.css       → All styling: colors, layout, light/dark theme, card & button design
├── js/
│   ├── data.js          → All content: tourist spots, hotels/hospitals/cafes/restaurants, the example itinerary
│   └── app.js           → All behavior: search, distance calculation, location handling,
│                          trip-planner generation, rendering the cards on screen
└── README.md            → This file
```

Nothing else is needed — no build step, no server-side code, no database. It's a static site.

## Running it locally

Just double-click `index.html`, or open it in any browser. (Note: some browsers restrict
`fetch`/geolocation on `file://` URLs — if "Use my location" doesn't prompt, use one of the
hosting options below instead, even the free ones will fix this.)

## Hosting it for free (so it has a real, shareable URL)

Pick any one:

1. **Netlify Drop** — go to https://app.netlify.com/drop and drag the whole `help-kit-manipur`
   folder onto the page. You get a live URL immediately.
2. **GitHub Pages** — create a free GitHub repo, upload all these files (keeping the folder
   structure), then in the repo's Settings → Pages, enable Pages from the main branch.
3. **Vercel** or **Firebase Hosting** — similar drag-and-deploy free tiers.

## Getting it into Google Search

Hosting alone doesn't make Google find it. After hosting:
1. Go to Google Search Console (search.google.com/search-console).
2. Add and verify your new site's URL.
3. Submit the URL for indexing.
Google typically crawls and lists it within a few days to a couple of weeks.

## Editing the data

- To add/edit hotels, hospitals, cafés, restaurants, or tourist spots: open `js/data.js`.
  Each entry is a plain JavaScript object — copy an existing one and change the values.
- To change colors, fonts, or spacing: open `css/style.css` and edit the `:root` CSS variables
  near the top for a quick global re-theme.
- To change behavior (search logic, itinerary generation, price estimates): open `js/app.js`.

## Notes on data accuracy

- Place details (names, ratings, coordinates, phone numbers) come from Google Places data
  gathered at the time this site was built — verify anything time-sensitive (hours, prices)
  independently.
- Hotel AC/Non-AC price ranges are **estimates** based on general price tier, not live rates.
- "Use my location" and "Enter location manually" both use the browser's own geolocation
  permission or manual input — no Google account or login is required anywhere in this site.
