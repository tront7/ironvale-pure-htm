
(() => {
  'use strict';

  /* ---------- Settings ---------- */
  // Recipient for the contact / quote emails. Change here only.
  const RECIPIENT = 'dispatch@ironvaleplumbing.com';
  // Map pin for the main office (212 Foundry Row, Ironvale, OH 44601).
  const OFFICE = { lat: 40.9153, lng: -81.1059, zoom: 13 };

  // Used if data/rates.json cannot be fetched (e.g. page opened from file://).
  const DEFAULT_RATES = {
    currency: 'R',
    callout: { weekday: 590, weekend: 890 },
    jobs: [
      { label: 'Repipe / whole-home plumbing', keywords: ['repipe', 'whole-home', 'whole home'], from: null },
      { label: 'Maintenance contract', keywords: ['maintenance', 'contract'], from: null },
      { label: 'Leak & pipe repair', keywords: ['leak', 'pipe', 'drip'], from: 1450 },
      { label: 'Water heater repair or install (diagnostic)', keywords: ['water heater', 'geyser', 'hot water'], from: 950 },
      { label: 'Drain clearing', keywords: ['drain', 'clog', 'blocked', 'sewer'], from: 1200 },
      { label: 'Fixture installation', keywords: ['toilet', 'fixture', 'faucet', 'tap', 'shower', 'disposal'], from: 1100 },
      { label: 'Grease trap service', keywords: ['grease'], from: 1800 },
      { label: 'Backflow testing', keywords: ['backflow'], from: 850 }
    ]
  };

  /* ---------- Helpers ---------- */
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build elements with textContent only, so user input is never parsed as HTML.
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value);
    });
    children.forEach((child) => {
      if (child == null) return;
      node.append(child.nodeType ? child : document.createTextNode(child));
    });
    return node;
  }

  /* ============================================================
     1. Accordions — one panel open per group, animated open/close
     ============================================================ */
  function initAccordions() {
    $$('details').forEach((details) => {
      const summary = $('summary', details);
      if (!summary) return;

      summary.addEventListener('click', (event) => {
        event.preventDefault();
        details.open ? closePanel(details) : openPanel(details);
      });
    });
  }

  function panelContent(details) {
    return Array.from(details.children).filter((child) => child.tagName !== 'SUMMARY');
  }

  function openPanel(details) {
    // Close sibling panels so the group behaves as an accordion.
    $$('details[open]', details.parentElement).forEach((other) => {
      if (other !== details && other.parentElement === details.parentElement) closePanel(other);
    });
    details.open = true;
    if (!reducedMotion()) {
      panelContent(details).forEach((node) =>
        node.animate(
          [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 200, easing: 'ease-out' }
        )
      );
    }
  }

  function closePanel(details) {
    if (!details.open) return;
    if (reducedMotion()) {
      details.open = false;
      return;
    }
    const animations = panelContent(details).map((node) =>
      node.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6px)' }],
        { duration: 150, easing: 'ease-in' }
      ).finished
    );
    Promise.all(animations).then(() => { details.open = false; }).catch(() => { details.open = false; });
  }

  /* ============================================================
     2. Lightbox — enlarge page images in a modal <dialog>
     ============================================================ */
  function initLightbox() {
    const images = $$('.hero > img, .category > img, .gallery img');
    if (!images.length || typeof HTMLDialogElement === 'undefined') return;

    const img = el('img', { alt: '' });
    const caption = el('figcaption');
    const closeBtn = el('button', { type: 'button', class: 'lightbox-btn lightbox-close', 'aria-label': 'Close image viewer', text: '\u00D7' });
    const prevBtn = el('button', { type: 'button', class: 'lightbox-btn lightbox-prev', 'aria-label': 'Previous image', text: '\u2039' });
    const nextBtn = el('button', { type: 'button', class: 'lightbox-btn lightbox-next', 'aria-label': 'Next image', text: '\u203A' });
    const dialog = el('dialog', { class: 'lightbox', 'aria-label': 'Image viewer' }, el('figure', {}, img, caption), closeBtn, prevBtn, nextBtn);
    document.body.append(dialog);

    let current = 0;
    let opener = null;

    function show(index) {
      current = (index + images.length) % images.length;
      img.src = images[current].currentSrc || images[current].src;
      img.alt = images[current].alt;
      caption.textContent = images[current].alt;
    }

    function open(index, trigger) {
      opener = trigger;
      show(index);
      dialog.showModal();
    }

    images.forEach((image, index) => {
      image.classList.add('zoomable');
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Enlarge image: ${image.alt}`);
      image.addEventListener('click', () => open(index, image));
      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          open(index, image);
        }
      });
    });

    const single = images.length < 2;
    prevBtn.hidden = nextBtn.hidden = single;
    closeBtn.addEventListener('click', () => dialog.close());
    prevBtn.addEventListener('click', () => show(current - 1));
    nextBtn.addEventListener('click', () => show(current + 1));
    // Click on the dark backdrop closes the viewer.
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (event) => {
      if (single) return;
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }

  /* ============================================================
     3. Services — search, category filter and sort
     ============================================================ */
  function initServiceTools() {
    const tools = $('.service-tools');
    if (!tools) return;
    tools.hidden = false;

    const search = $('#service-search');
    const category = $('#service-category');
    const sort = $('#service-sort');
    const count = $('#service-count');
    const empty = $('#service-empty');
    const clear = $('#service-clear');
    const sections = $$('.category');
    const cardsByGrid = new Map();

    sections.forEach((section) => {
      const grid = $('.service-grid', section);
      const cards = $$('.card', grid);
      cards.forEach((card, index) => {
        card.dataset.order = index;
        const priceText = ($('.price', card) || {}).textContent || '';
        const match = priceText.match(/R\s?(\d[\d\s,]*)/);
        card.dataset.price = match ? match[1].replace(/\D/g, '') : '';
      });
      cardsByGrid.set(grid, cards);
    });

    function apply() {
      const query = search.value.trim().toLowerCase();
      const wanted = category.value;
      let visible = 0;

      sections.forEach((section) => {
        const grid = $('.service-grid', section);
        const cards = cardsByGrid.get(grid);
        const categoryMatches = wanted === 'all' || section.id === wanted;
        let shownInSection = 0;

        cards.forEach((card) => {
          const textMatches = !query || card.textContent.toLowerCase().includes(query);
          const show = categoryMatches && textMatches;
          card.hidden = !show;
          if (show) shownInSection += 1;
        });

        // Re-order the cards in this grid.
        const ordered = cards.slice().sort((a, b) => {
          if (sort.value === 'name') return $('h3', a).textContent.localeCompare($('h3', b).textContent);
          if (sort.value === 'price') {
            const pa = a.dataset.price === '' ? Infinity : Number(a.dataset.price);
            const pb = b.dataset.price === '' ? Infinity : Number(b.dataset.price);
            return pa - pb || a.dataset.order - b.dataset.order;
          }
          return a.dataset.order - b.dataset.order;
        });
        ordered.forEach((card) => grid.append(card));

        section.hidden = shownInSection === 0;
        visible += shownInSection;
      });

      count.textContent = visible === 1 ? '1 service shown' : `${visible} services shown`;
      empty.hidden = visible !== 0;
    }

    [search, category, sort].forEach((control) => control.addEventListener('input', apply));
    clear.addEventListener('click', () => {
      search.value = '';
      category.value = 'all';
      sort.value = 'default';
      apply();
      search.focus();
    });
    apply();
  }

  /* ============================================================
     4. Reviews — loaded dynamically from data/reviews.json
     ============================================================ */
  async function initReviews() {
    const list = $('#review-list');
    if (!list) return;
    const status = $('#review-status');
    const more = $('#more-reviews');
    const STEP = 3;
    let reviews = [];
    let shown = 0;

    try {
      const response = await fetch('data/reviews.json', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      reviews = (await response.json()).reviews || [];
    } catch (error) {
      status.textContent = 'Customer reviews could not be loaded right now. Please try again later.';
      return;
    }

    function renderNext() {
      reviews.slice(shown, shown + STEP).forEach((review) => {
        const stars = '\u2605'.repeat(review.rating) + '\u2606'.repeat(5 - review.rating);
        list.append(
          el('article', { class: 'card review fade-in' },
            el('p', { class: 'stars', role: 'img', 'aria-label': `${review.rating} out of 5 stars`, text: stars }),
            el('blockquote', {}, el('p', { text: review.text })),
            el('p', { class: 'review-meta' }, el('strong', { text: review.name }), ` \u2014 ${review.job}`)
          )
        );
      });
      shown = Math.min(shown + STEP, reviews.length);
      status.textContent = `Showing ${shown} of ${reviews.length} reviews`;
      more.hidden = shown >= reviews.length;
    }

    more.addEventListener('click', renderNext);
    renderNext();
  }

  /* ============================================================
     5. Contact page — interactive map (Leaflet + OpenStreetMap)
     ============================================================ */
  function initMap() {
    const container = $('#office-map');
    if (!container) return;
    if (!window.L) {
      // Leaflet failed to load (offline / blocked): fall back to a plain embedded map.
      container.replaceChildren(el('iframe', {
        title: 'Map showing Ironvale Plumbing Co. main office in Ironvale, OH',
        src: 'https://www.google.com/maps?q=Ironvale+Ohio&output=embed',
        loading: 'lazy'
      }));
      container.classList.add('map-fallback');
      return;
    }
    const map = window.L.map(container, { scrollWheelZoom: false }).setView([OFFICE.lat, OFFICE.lng], OFFICE.zoom);
    window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    window.L.marker([OFFICE.lat, OFFICE.lng])
      .addTo(map)
      .bindPopup('<strong>Ironvale Plumbing Co.</strong><br>212 Foundry Row, Ironvale, OH 44601');
  }

  /* ============================================================
     6. Forms — validation, error handling, responses
     ============================================================ */
  function validateField(field) {
    const label = field.dataset.label || 'this field';
    const value = field.value.trim();

    if (field.required && !value) {
      return field.tagName === 'SELECT' ? `Choose ${label}.` : `Enter ${label}.`;
    }
    if (!value) return '';

    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return 'Enter an email address like name@example.com.';
    }
    if (field.type === 'tel') {
      const digits = value.replace(/\D/g, '');
      if (!/^[0-9+()\s.\-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
        return 'Enter a phone number with 7\u201315 digits, for example (555) 555-0142.';
      }
    }
    if (field.pattern && !new RegExp(`^(?:${field.pattern})$`).test(value)) {
      return field.dataset.patternMessage || `Check the format of ${label}.`;
    }
    if (field.minLength > 0 && value.length < field.minLength) {
      return `Use at least ${field.minLength} characters (you have ${value.length}).`;
    }
    if (field.type === 'date' && field.min && value < field.min) {
      return 'Choose today or a later date.';
    }
    return '';
  }

  function showError(field, message) {
    let error = $(`#${field.id}-error`);
    if (!error) {
      error = el('p', { class: 'field-error', id: `${field.id}-error` });
      field.insertAdjacentElement('afterend', error);
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    }
    error.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function checkField(field) {
    const message = validateField(field);
    showError(field, message);
    return !message;
  }

  function setupValidation(form) {
    form.noValidate = true; // JS shows the messages; without JS the browser's own validation still runs
    const fields = $$('input, select, textarea', form).filter((f) => f.type !== 'hidden' && f.type !== 'checkbox');
    fields.forEach((field) => {
      field.addEventListener('blur', () => { if (field.value !== '' || field.hasAttribute('aria-invalid')) checkField(field); });
      field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) checkField(field); });
    });
    return fields;
  }

  function validateAll(form, fields) {
    const invalid = fields.filter((field) => !checkField(field));
    const summary = $('.form-status', form);
    if (invalid.length) {
      summary.textContent = `Please fix ${invalid.length} ${invalid.length === 1 ? 'field' : 'fields'} before sending.`;
      summary.hidden = false;
      invalid[0].focus();
      return false;
    }
    summary.hidden = true;
    return true;
  }

  function setupCounter(textarea) {
    const counter = $('#' + textarea.id + '-count');
    if (!counter) return;
    const update = () => { counter.textContent = `${textarea.value.length} / ${textarea.maxLength} characters`; };
    textarea.addEventListener('input', update);
    update();
  }

  function mailtoLink(subject, body, cc) {
    const ccPart = cc ? `&cc=${encodeURIComponent(cc)}` : '';
    return `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}${ccPart}&body=${encodeURIComponent(body)}`;
  }

  function showResult(form, ...nodes) {
    let result = $('.form-result', form.parentElement);
    if (!result) {
      result = el('div', { class: 'form-result', role: 'status', tabindex: '-1' });
      form.insertAdjacentElement('afterend', result);
    }
    result.replaceChildren(...nodes);
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* ---------- Quote form (quote.html) ---------- */
  let ratesPromise;
  function loadRates() {
    if (!ratesPromise) {
      ratesPromise = fetch('data/rates.json', { headers: { Accept: 'application/json' } })
        .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
        .catch(() => DEFAULT_RATES);
    }
    return ratesPromise;
  }

  function pickJob(rates, text) {
    const lower = text.toLowerCase();
    return rates.jobs.find((job) => job.keywords.some((word) => lower.includes(word))) || null;
  }

  function availabilityNote(dateValue, urgent) {
    if (urgent) {
      return 'Marked urgent: we will prioritise a visit within 24 hours, subject to crew availability, and phone you to confirm. If water is actively flooding, call the emergency line now.';
    }
    if (!dateValue) return 'No date chosen. Non-emergency jobs are usually scheduled within 1\u20133 business days.';
    const preferred = new Date(`${dateValue}T12:00:00`);
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const days = Math.round((preferred - today) / 86400000);
    const weekend = [0, 6].includes(preferred.getDay());
    const nice = preferred.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
    if (days <= 1) {
      return `${nice}: same-day and next-day slots are limited, so we will confirm by phone. If water is actively flooding, call the emergency line now.`;
    }
    return `${nice}: this date is open for a booking request.${weekend ? ' Weekend visits are booked at the evenings & weekends rate.' : ''}`;
  }

  function initQuoteForm() {
    const form = $('#quote-form');
    if (!form) return;
    const fields = setupValidation(form);
    setupCounter($('#message'));

    const date = $('#preferred-date');
    const now = new Date();
    date.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!validateAll(form, fields)) return;

      const submit = $('button[type="submit"]', form);
      submit.disabled = true;
      submit.textContent = 'Checking rates\u2026';

      const data = Object.fromEntries(new FormData(form).entries());
      const rates = await loadRates();
      const job = pickJob(rates, data['job-type']);
      const urgent = data.urgent === 'yes';
      const weekend = data['preferred-date'] && [0, 6].includes(new Date(`${data['preferred-date']}T12:00:00`).getDay());
      const callout = weekend ? rates.callout.weekend : rates.callout.weekday;
      const cur = rates.currency;

      const price = job && job.from != null
        ? `From ${cur}${job.from}${/diagnostic/.test(job.label) ? ' (diagnostic)' : ''}`
        : 'Custom quote \u2014 we need a few more details before pricing this job';
      const emailBody = [
        `Name: ${data['full-name']}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Property ZIP: ${data.zip}`,
        `Property type: ${data['property-type']}`,
        `Job type: ${data['job-type']}`,
        `Preferred date: ${data['preferred-date'] || 'No preference'}`,
        `Urgent (visit within 24 hours): ${urgent ? 'Yes' : 'No'}`,
        '',
        'Problem description:',
        data.message
      ].join('\n');

      const firstName = data['full-name'].trim().split(/\s+/)[0];
      showResult(
        form,
        el('h3', { text: `Thanks ${firstName}, here is your estimate` }),
        el('dl', { class: 'result-list' },
          el('dt', { text: 'Job' }), el('dd', { text: job ? job.label : data['job-type'] }),
          el('dt', { text: 'Estimated cost' }), el('dd', { class: 'mono', text: price }),
          el('dt', { text: 'Call-out fee' }), el('dd', { class: 'mono', text: `${cur}${callout} (${weekend ? 'weekend' : 'weekday'})` }),
          el('dt', { text: 'Availability' }), el('dd', { text: availabilityNote(data['preferred-date'], urgent) })
        ),
        el('p', { class: 'result-note', text: 'Guide pricing only. We confirm a flat-rate quote before any work begins.' }),
        el('p', {}, el('a', { class: 'btn btn-primary', href: mailtoLink(`Quote request: ${data['job-type']}`, emailBody), text: 'Email this request to Ironvale' }))
      );

      submit.disabled = false;
      submit.textContent = 'Request Quote';
    });
  }

  /* ---------- Contact form (contact.html) ---------- */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    const fields = setupValidation(form);
    setupCounter($('#contact-message'));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateAll(form, fields)) return;

      const data = Object.fromEntries(new FormData(form).entries());
      const copy = data['contact-copy'] === 'yes';
      const cc = copy ? data['contact-email'] : '';
      const subject = `${data['contact-type']} from ${data['contact-name']}`;
      const body = [
        `Name: ${data['contact-name']}`,
        `Email: ${data['contact-email']}`,
        `Phone: ${data['contact-phone'] || 'Not provided'}`,
        `Message type: ${data['contact-type']}`,
        `Copy requested: ${copy ? 'Yes' : 'No'}`,
        '',
        data['contact-message']
      ].join('\n');

      showResult(
        form,
        el('h3', { text: 'Your email is ready to send' }),
        el('p', { text: `Check the message below, then open it in your email app. It will be addressed to ${RECIPIENT}.` }),
        el('pre', { class: 'email-preview', text: `To: ${RECIPIENT}\n${cc ? `Cc: ${cc}\n` : ''}Subject: ${subject}\n\n${body}` }),
        el('p', {}, el('a', { class: 'btn btn-primary', href: mailtoLink(subject, body, cc), text: 'Open in email app' }))
      );
    });
  }

  /* ---------- Start ---------- */
  function init() {
    initAccordions();
    initLightbox();
    initServiceTools();
    initReviews();
    initMap();
    initQuoteForm();
    initContactForm();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();