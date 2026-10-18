# Ironvale Plumbing Co. — Website Project

## Project Overview
A five-page website built for Ironvale Plumbing Co., a fictional residential
and commercial plumbing service, as the target organisation for this
Portfolio of Evidence. The site showcases the company's story, services,
and rates, and allows visitors to request a free quote or send a general
enquiry.

## Website Goals and Objectives
- Give the business a professional web presence beyond word-of-mouth.
- Allow visitors to request a quote for residential, commercial, or
  emergency plumbing work.
- Build trust with clear licensing, pricing, and guarantee information
  up front.
- KPIs: quote form submissions, click-throughs on the emergency call
  button, time spent on the services page, growth in unique visitors.

## Key Features and Functionality
- Homepage with a work-order-styled hero, core services overview, and an
  emergency call-to-action.
- About Us page with the company's history, mission/vision, values, and
  team.
- Services page with categorised offerings (Residential, Commercial,
  Emergency) and a rate guide table.
- Get a Quote page with a job-detail enquiry form and an FAQ accordion.
- Contact page with office hours, service area, an interactive map, service
  policies, and a general contact form.
- Part 3 additions: validated forms with a cost/availability response and
  a compiled email, accordions, an image lightbox, searchable/sortable
  services, dynamically loaded customer reviews, and SEO groundwork.

## Part 2 — CSS Styling and Responsive Design
Part 1 shipped as HTML with CSS inlined directly into each page. For
Part 2 the styling has been extracted into a single **external stylesheet**
(`css/style.css`) that all five pages link to, per the brief's requirement
to create one stylesheet and link every page to it.

**2.1–2.2 External stylesheet & base style**
- One shared `css/style.css`, linked from every page's `<head>`.
- A CSS reset at the top of the file (box-sizing, margin/padding zeroing,
  list-style removal, image scaling) so all five pages start from the same
  baseline across browsers.
- Base styles (font family, colour scheme, line-height) set once on `html`/
  `body` and inherited everywhere via the cascade, rather than repeated
  per selector.

**2.3 Typography**
- A typographic scale defined as CSS custom properties (`--fs-body`,
  `--fs-h2`, `--fs-h2-hero`, etc.), all in `rem` so they scale with the
  user's base font size.
- The hero heading uses `clamp()` to scale fluidly between a minimum and
  maximum size across viewport widths, instead of jumping at a fixed
  breakpoint.

**2.4 Layout structure**
- CSS Grid for the homepage hero, service/team/card grids, and the numbered
  "why us" process list (`display: grid`, `grid-template-columns`).
- Flexbox for the header, primary navigation, hero actions, badges, and
  footer (`display: flex`, `justify-content`, `align-items`, `flex-wrap`).
- A spacing scale (`--space-1` … `--space-9`, in `rem`) used for section
  and component spacing so gaps stay consistent and scale with type size.

**2.5 Visual styles & interaction states**
- Colour, background-colour, border, and box-shadow used to differentiate
  cards, badges, and the ticket component.
- `:hover` states on nav links, buttons, cards, and FAQ summaries.
- `:focus-visible` states on links, nav items, buttons, and form summaries
  for keyboard accessibility.
- `:active` states on buttons for tactile press feedback.

### 2.6 Responsive Design (Part 2)
- **Breakpoints:** two breakpoints defined in `em` (not `px`), so they
  scale with the browser's own font-size/zoom setting rather than only
  physical pixels — `55em` (~880px, desktop → tablet) and `35em` (~560px,
  tablet → mobile). Desktop styles are the default; grids collapse from
  3 columns → 2 columns → 1 column as the viewport narrows.
- **Relative units:** font sizes and spacing throughout use `rem`; the
  hero heading uses `clamp()` with a `vw`-based fluid component; percentage
  widths are used for form fields and grid tracks.
- **Responsive tables:** the rate-guide and hours tables scroll
  horizontally on narrow viewports (`overflow-x: auto`) instead of
  breaking their layout.
- **Responsive embed:** the Contact page map `iframe` uses `aspect-ratio`
  instead of a fixed pixel height, so it resizes proportionally.
- **Testing:** layouts were checked at desktop (~1280px+), tablet
  (~768–880px), and mobile (~375–560px) widths using browser developer
  tools' device toolbar, confirming the grid-to-single-column collapse,
  stacked header/nav on mobile, and horizontally-scrollable tables.
  *(Insert your own device-toolbar screenshots here for submission —
  desktop / tablet / mobile for at least the homepage and one inner page.)*

## Part 3 — Enhancing Functionality and SEO

All scripting lives in one file, `js/main.js`, loaded with `defer` on every
page. Every feature is progressive enhancement: with JavaScript disabled the
pages still work (native `<details>`, the full static services list, and
forms that fall back to a `mailto:` action).

> **Note on file names:** the brief refers to `enquiry.html`. In this site that
> page is **`quote.html`** (Get a Quote), which is the enquiry form.

**2. Functionality**

*2.1 Interactive elements*
- **Accordions:** the FAQ (`quote.html`) and Service Policies
  (`contact.html`) use `<details>` enhanced with JavaScript so only one panel
  in a group is open at a time, with a short animated open/close.
- **Photo gallery with lightbox:** `about.html` has a four-photo gallery
  (responsive grid with captions). Together with the home hero image and
  the services category images, these open in a modal `<dialog>` viewer.
  Supports mouse, keyboard (Enter/Space to open, Esc to close, left/right
  arrows to move between images), a caption taken from the alt text, and
  returns focus to the image that opened it.
- **Interactive map:** the Contact page uses **Leaflet** with OpenStreetMap
  tiles and a marker/popup for the main office. If Leaflet cannot load, or
  JavaScript is off, the original Google Maps embed is used instead.
- **Animations and transitions:** work-order ticket entrance on the homepage,
  fade-in for reviews, form results and the lightbox, and animated accordion
  panels. All respect `prefers-reduced-motion`.
- **DOM manipulation:** elements are created with `createElement` and
  `textContent` (never `innerHTML` for user input), classes/attributes are
  toggled for validation state, and cards are re-ordered live when sorting.

*2.2 Dynamic content*
- **Reviews (index.html):** loaded with `fetch()` from `data/reviews.json`
  and rendered three at a time with a "Show more reviews" button.
- **Search, filter and sort (services.html):** a keyword search, category
  filter and sort control (default, name A–Z, price low to high) update the
  service cards live and announce the result count to screen readers.

**3. Search Engine Optimisation**

*3.1 On-page SEO*
- **Keywords:** target phrases are *plumber in Ironvale OH*, *emergency
  plumber*, *water heater repair*, *drain clearing*, *plumbing quote* and
  *commercial plumbing*. They are used naturally in titles, headings, link
  text and image alt text.
- **Titles and meta descriptions:** unique for every page (see each
  `<head>`), with Open Graph tags and a canonical URL.
- **Meta keywords:** every page has a `<meta name="keywords">` tag with 5-7
  page-specific phrases (for example the Services page uses *plumbing
  services, leak repair, water heater repair, drain clearing...*). The same
  phrases appear in the visible headings, copy and alt text. Search engines
  such as Google no longer use this tag for ranking, so the on-page use of
  keywords is what matters.
- **Headings:** each page now has exactly one `<h1>` describing that page,
  followed by a correct `h2 > h3` outline. The logo text in the header is no
  longer an `<h1>`.
- **Images:** descriptive alt text, explicit `width`/`height`, and
  `loading="lazy"` on below-the-fold images (hero image uses
  `fetchpriority="high"`). Image file paths were left unchanged.
- **URLs:** short, descriptive, lower-case file names
  (`services.html`, `quote.html`, ...).
- **Internal linking:** added contextual links between Home, About, Services,
  Quote and Contact content.
- **Mobile-friendliness:** responsive layout from Part 2, plus a viewport tag
  on every page.
- **Structured data:** `Plumber` (LocalBusiness) JSON-LD on the homepage with
  address, phone, hours and service area.

*3.2 Off-page and local SEO (plan)*
- **Backlinks:** request listings in local trade/chamber directories and
  link from supplier and partner sites.
- **Social media:** Facebook and Instagram links are in the footer; share
  new reviews and completed jobs there.
- **Local SEO:** the business address, phone number and service-area counties
  appear on the Contact page and in the structured data; claim a Google
  Business Profile with the same name/address/phone details.

*3.3 Additional requests*
- **robots.txt:** allows crawling and points to the sitemap; blocks `/data/`.
- **sitemap.xml:** lists all five pages.
- **Page speed:** deferred script, `preconnect` for Google Fonts, lazy-loaded
  images, explicit image dimensions, and no blocking third-party scripts
  (Leaflet is bundled locally in `vendor/leaflet/` and only loads on the Contact page).
- **Security:** a Content-Security-Policy `<meta>` tag on every page
  (scripts, styles, images, fonts, forms restricted to what each page needs),
  `referrer` policy, `rel="noopener noreferrer"` on external links,
  Leaflet served from the site itself (no third-party script), and a Netlify `_headers` file
  for `X-Frame-Options`, `X-Content-Type-Options` and `Permissions-Policy`.
  All user input is inserted with `textContent`.

**4. Form functionality and validation**

| | `quote.html` (enquiry) | `contact.html` (general message) |
|---|---|---|
| Purpose | Ask about a job and get an estimate | Send a general message to the company |
| Fields | name, phone, email, ZIP, property type, job type (with suggestions), optional preferred date, problem description, "urgent" checkbox | name, email, optional phone, message type (select), message, "send me a copy" checkbox |
| After validation | Shows an estimated cost, call-out fee and availability note based on the job type, date and urgency, then offers to email the request | Shows a preview of the compiled email and an "Open in email app" button; the copy checkbox adds the visitor's address as Cc |
| Recipient | `RECIPIENT` constant in `js/main.js` (`dispatch@ironvaleplumbing.com`) | same |

- **Form elements:** `input` (text, tel, email, date, checkbox), `select`,
  `datalist` and `textarea`, each with an associated `<label>`.
- **HTML5 validation attributes:** `required`, `type`, `minlength`,
  `maxlength`, `pattern` (5-digit ZIP, phone characters), `min` on the date
  (today is set by JavaScript), `inputmode` and `autocomplete`.
- **JavaScript validation:** checks the same rules on blur, input and submit
  with a specific message for each failure (e.g. phone must have 7–15
  digits, message needs at least 20 characters, date cannot be in the
  past). Errors are linked with `aria-describedby`, flagged with
  `aria-invalid`, summarised in an alert, and focus moves to the first
  invalid field.
- **Character counter** on both message boxes (limit 1000).
- **Asynchronous behaviour (AJAX):** the quote form uses `fetch()` to load
  the rate table from `data/rates.json` without reloading the page. If the
  request fails (for example when the file is opened without a web server),
  built-in default rates are used.
- **Form submission:** each `<form>` has an `action` of
  `mailto:dispatch@ironvaleplumbing.com`, so the form still works without
  JavaScript. With JavaScript, submission is intercepted, validated and
  turned into the response described above.

**Deployment (free platform)**
- Platform: *(Netlify / GitHub Pages — fill in)*
- Live URL: *(paste the live link here)*
- After deploying, replace `https://ironvale-plumbing.netlify.app` in
  `robots.txt`, `sitemap.xml`, the `<link rel="canonical">`/`og:url` tags and
  the JSON-LD block with the real address.
- Test in a browser with the site served over HTTP(S) (or VS Code Live
  Server) so `fetch()` can read the `data/` files.

## Sitemap
```
Home (index.html)
├── About Us (about.html)
├── Services (services.html)
├── Get a Quote (quote.html)
└── Contact (contact.html)
```

## File and Folder Structure
```
ironvale-plumbing/
├── index.html
├── about.html
├── services.html
├── quote.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── _headers
├── css/
│   └── style.css
├── js/
│   └── main.js
├── vendor/
│   └── leaflet/        (Leaflet 1.9.4 library, BSD-2 licence)
├── data/
│   ├── rates.json
│   └── reviews.json
└── images/
    ├── team-marcus.jpg
    ├── team-renee.jpg
    ├── team-darius.jpg
    ├── leak-icon.jpg
    ├── water-heater-icon.jpg
    ├── drain-icon..jpg
    ├── services-residential.jpg
    ├── services-commercial.jpg
    ├── services-emergency-placeholder.jpg
```

## Design Notes
- **Palette:** ink navy (#16283A), copper (#BE6E3C), warm paper (#F3EEE4),
  steel grey (#4C5B66), alert red (#B3411F) reserved for emergency calls
  to action.
- **Type:** Zilla Slab (headings), Work Sans (body copy), IBM Plex Mono
  (labels, prices, ticket/table data) — loaded via Google Fonts.
- **Signature element:** the homepage hero is styled as a plumber's work
  order ticket (job number, dispatch details, service badges) rather than
  a generic banner image, tying the visual language back to the trade.
- Semantic HTML throughout (`header`, `nav`, `main`, `footer`, `article`,
  `address`, `details`/`summary`, `dl`, tables with `caption`/`scope`), a
  skip-to-content link, and per-page `aria-current="page"` navigation
  states.

## Changelog

### Part 2 — CSS Styling and Responsive Design
- **Added:** external stylesheet `css/style.css`, linked from all five
  pages, replacing the inline `<style>` block each page previously carried.
- **Added:** CSS reset (box-sizing, margin/padding, list-style, image
  scaling) for consistent cross-browser rendering.
- **Added:** typography scale and spacing scale as CSS custom properties,
  expressed in `rem`.
- **Added:** `:hover`, `:focus-visible`, and `:active` states on
  navigation links, buttons, cards, and FAQ summaries.
- **Added:** two responsive breakpoints (`55em` / `35em`) with `em` units,
  collapsing grid layouts from 3 → 2 → 1 columns and stacking the header
  on mobile.
- **Added:** horizontal scroll on tables and `aspect-ratio` on the
  embedded map for smaller viewports.
- **Changed:** fixed-pixel spacing (section margins, card padding, button
  padding) converted to the `rem`-based spacing scale.
- **Changed:** breakpoints converted from `px` to `em` per responsive
  design best practice.

### Part 3 — Enhancing Functionality and SEO

**Feedback from Part 2**

| Feedback received | File(s) | What was changed |
|---|---|---|
| *(paste lecturer comment 1)* | *(file)* | *(describe the edit in detail)* |
| *(paste lecturer comment 2)* | *(file)* | *(describe the edit in detail)* |

Additional fixes found while working through the site:
- **Fixed:** `.team` was included in the 3-column grid rule, but on
  `about.html` it is the `<section>` itself, so its heading and cards were
  being laid out as three grid columns. It was removed from that rule (the
  inner `.card-row` already handles the layout).
- **Fixed:** `index.html` had a stray unclosed `<h3>` in the Water Heater
  card; removed.
- **Changed:** team photos now fill their round frame (`object-fit: cover`).
- **Changed:** small gap added below the services category images.

**Functionality**
- **Added:** `js/main.js` (linked with `defer` on all five pages).
- **Added:** animated accordions on FAQ and Service Policies.
- **Added:** image lightbox (modal `<dialog>`) on the home hero and services images.
- **Added:** Leaflet interactive map on `contact.html` (replaces the iframe;
  iframe kept as a `<noscript>`/fallback).
- **Added:** services search, category filter and sort controls
  (`services.html`).
- **Added:** "What Our Customers Say" section on `index.html`, loaded from
  `data/reviews.json` with a "Show more" button.
- **Added:** work-order ticket entrance animation and fade-in transitions.
- **Added:** four-photo gallery section on `about.html` with lightbox
  (uses the existing image files; no image paths were changed).

**Forms**
- **Added:** HTML5 validation attributes and JavaScript validation with
  inline error messages, an error summary, and a character counter on
  `quote.html` and `contact.html`.
- **Added:** `quote.html` fields: preferred visit date and an "urgent"
  checkbox that changes the availability message and is included in the email.
- **Added:** `contact.html` fields: optional phone number, message type, and a
  "send me a copy" checkbox (adds the visitor as Cc on the email).
- **Added:** quote response with estimated cost, call-out fee and availability
  (rates fetched from `data/rates.json`).
- **Added:** contact email preview and "Open in email app" `mailto:` link.
- **Changed:** both forms' `action` from `#` to a `mailto:` address.

**SEO and security**
- **Changed:** page titles/meta descriptions on Services, Quote and Contact.
- **Added:** page-specific `<meta name="keywords">` on all five pages.
- **Added:** canonical link, Open Graph tags, theme-color and referrer meta tags
  on every page; `Plumber` JSON-LD on `index.html`.
- **Changed:** headings — the header logo text is no longer an `<h1>`; each
  page's main title is the `<h1>`; services card titles/location titles
  and contact sub-sections moved to the correct level. Visual sizes preserved
  through CSS.
- **Changed:** descriptive alt text on the hero and services images and
  `loading="lazy"` on below-the-fold images.
- **Added:** contextual internal links on Home, About, Services and Contact.
- **Added:** `robots.txt`, `sitemap.xml`, `_headers`, and a
  Content-Security-Policy meta tag on every page.
- **Added:** `preconnect` to `fonts.gstatic.com`.
- **Changed:** footer business name from an inline-styled `<h3>` to a
  `.footer-brand` class.

### Part 1 feedback addressed
- *(List any corrections made to Part 1 here following lecturer feedback,
  e.g. heading hierarchy fixes, alt-text additions, or markup corrections —
  update this entry with the specific feedback received.)*

## References
- Google Fonts (n.d.) Available at: https://fonts.google.com (Accessed: 12 August 2026).
- MDN Web Docs (n.d.) CSS Grid Layout. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout (Accessed: 11 September 2026).
- MDN Web Docs (n.d.) CSS Flexible Box Layout. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout (Accessed: 11 September 2026).
- MDN Web Docs (n.d.) Using media queries. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries (Accessed: 11 September 2026).
- Leaflet (n.d.) Leaflet quick start guide. Available at: https://leafletjs.com/examples/quick-start/ (Accessed: 13 October 2026).
- OpenStreetMap Foundation (n.d.) Copyright and licence. Available at: https://www.openstreetmap.org/copyright (Accessed: 13 October 2026).
- MDN Web Docs (n.d.) Client-side form validation. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 13 October 2026).
- MDN Web Docs (n.d.) The dialog element. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog (Accessed: 13 October 2026).
- MDN Web Docs (n.d.) Content Security Policy (CSP). Available at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP (Accessed: 13 October 2026).
- Google Search Central (n.d.) Robots.txt introduction. Available at: https://developers.google.com/search/docs/crawling-indexing/robots/intro (Accessed: 13 October 2026).
- Google Search Central (n.d.) Build and submit a sitemap. Available at: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap (Accessed: 13 October 2026).
- MDN Web Docs (n.d.) HTML elements reference. Available at: https://developer.mozilla.org/en-US/docs/Web/HTML/Element (Accessed: 12 August 2026).