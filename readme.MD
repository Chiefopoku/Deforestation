# Urban Shade Initiative

**Live site:** https://deforestation-phi.vercel.app/

The Urban Shade Initiative is a public-health and environmental awareness website. It covers how urban tree loss affects heat, air quality, biodiversity and community well-being in Ghana and the United States, and what communities can do about it.

It is a collaboration between **Michael Ago Tetteh** (Liberty University School of Public Health) and **Emmanuel Opoku-Adjei** (UNC Greensboro). Emmanuel co-created and built the site.

## What's on the site

- **Why it matters:** cleaner air, cooler streets, living ecosystems and healthier communities.
- **Biblical perspective:** stewardship, justice, compassion and restoration, each supported by a Scripture verse.
- **Visual comparison:** before-and-after images of low-canopy and tree-rich neighbourhoods.
- **Impact snapshot:** key figures from the EPA, the US Forest Service and the City of Lynchburg, with sources cited.
- **The issues:** urban heat islands, air quality and respiratory health, biodiversity loss, and mental and community health.
- **Resources and toolkit:**
  - A searchable directory of Ghanaian and US agencies and organisations.
  - An advocacy starter guide.
  - A community tree-planting guide.
  - An FAQ.
- **Take action:** upcoming events in Ghana and the US, volunteer paths, government agencies to contact, and how to start a tree inventory.
- **About, contact and sources:** the team, mission and vision; a contact form that opens a prefilled email; and the full reference list.

## Features

- A responsive, mobile-first layout with a sticky header and a mobile menu.
- **Search:** live filtering of the resource directory.
- **Impact counters:** the figures count up as they scroll into view.
- **Events list:** events hide themselves after their end date (see below).
- **Navigation:** smooth scrolling, scroll-triggered animations and a back-to-top link.
- **Accessibility:** a skip link, ARIA labels, visible focus states and form validation.
- **Vercel Web Analytics.**

## File structure

```
index.html     all page content and sections
style.css      styles, responsive breakpoints and custom properties
script.js      navigation, search, counters, animations, form, event expiry
images/        logo, favicon and section images
package.json   Vercel Analytics and Speed Insights; Node 24 for Vercel builds
```

## Run locally

No build step is needed:

```bash
git clone <this repository>
cd Deforestation
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Updating events

Each event in the **Take Action** section has an end date, for example:

```html
<li data-end="2026-11-19">
  <strong>Partners in Community Forestry Conference</strong>
  <span>Date: November 18-19, 2026</span>
  <span>Location: St. Louis, Missouri; hosted by Arbor Day</span>
</li>
```

- Once the date in `data-end` has passed, the event is hidden automatically. Use `YYYY-MM-DD` format.
- If a country's list becomes empty, it shows "New events will be posted soon."
- Add new events in the same format. Recurring events such as Green Ghana Day (usually in June) and the Great NC Tree Conference (October) are good candidates for each new year.

## Sources

The figures on the page come from the following sources, which are also listed at the bottom of the site:

- The U.S. Environmental Protection Agency, on heat islands.
- Nowak et al. for the U.S. Forest Service, on air-pollution removal by urban trees.
- The City of Lynchburg, on its Tree City USA award and tree-canopy initiative.
- The American Public Health Association.
- The Nature Conservancy.

## Possible next steps

- **Interactive comparison:** a before-and-after slider for the comparison images.
- **Pledge form:** a sign-up form for the Community Commitment section, linked to a form service.
- **Dark mode.**
- **Deeper content:** separate pages with more detail on each resource category.

## Credits

Created by Michael Ago Tetteh and Emmanuel Opoku-Adjei, in collaboration with the Liberty University School of Public Health. &copy; 2026 Urban Shade Initiative.
