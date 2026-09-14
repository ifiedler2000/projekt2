/* ==========================================================================
   Okusi Paga — script.js
   - Filter po kategoriji + live pretraga (kombinirano)
   - Validacija forme (XSS-safe: ne ubacujemo korisnički unos u DOM)
   - Cookie consent + uvjetno (consent-gated) učitavanje GA4
   - GA4 eventi: cta_click, form_submit (samo uz pristanak)
   Svi DOM lookupi su zaštićeni (nema console grešaka ako element ne postoji).
   ========================================================================== */
(function () {
  "use strict";

  /* --- Konfiguracija --------------------------------------------------- */
  // ZAMIJENITI stvarnim GA4 Measurement ID-em prije objave:
  var GA_MEASUREMENT_ID = "G-Q2RV03D3SP";
  var CONSENT_KEY = "okusi-paga-cookie-consent"; // vrijednosti: "accepted" | "rejected"

  /* ====================================================================
     1) FILTER + PRETRAGA
     ==================================================================== */
  function initFilterAndSearch() {
    var grid = document.getElementById("cards-grid");
    var searchInput = document.getElementById("pretraga");
    var noResults = document.getElementById("no-results");
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll(".filter-btn")
    );
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    var activeFilter = "sve";

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var category = card.getAttribute("data-category") || "";
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var matchesCategory = activeFilter === "sve" || category === activeFilter;
        var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
        var show = matchesCategory && matchesQuery;

        card.classList.toggle("is-hidden", !show);
        if (show) visibleCount++;
      });

      if (noResults) noResults.hidden = visibleCount !== 0;
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeFilter = btn.getAttribute("data-filter") || "sve";
        filterButtons.forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle("is-active", isActive);
          b.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    applyFilters();
  }

  /* ====================================================================
     2) VALIDACIJA FORME (XSS-safe)
     ==================================================================== */
  function initForm() {
    var form = document.querySelector('form[name="kontakt"]');
    if (!form) return;

    var success = document.getElementById("form-success");

    var fields = [
      { id: "ime", errId: "ime-err", msg: "Unesi ime." },
      { id: "email", errId: "email-err", msg: "Unesi ispravan e-mail." },
      { id: "poruka", errId: "poruka-err", msg: "Unesi poruku." }
    ];

    function setError(input, errEl, message) {
      if (errEl) errEl.textContent = message; // textContent => nema HTML injekcije
      if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function isValidEmail(value) {
      // Jednostavna, dovoljna provjera formata e-maila
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateField(field) {
      var input = document.getElementById(field.id);
      var errEl = document.getElementById(field.errId);
      if (!input) return true;

      var value = input.value.trim();
      var valid = value.length > 0;
      if (field.id === "email") valid = isValidEmail(value);

      setError(input, errEl, valid ? "" : field.msg);
      return valid;
    }

    fields.forEach(function (field) {
      var input = document.getElementById(field.id);
      if (input) {
        input.addEventListener("blur", function () { validateField(field); });
      }
    });

    form.addEventListener("submit", function (event) {
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        event.preventDefault(); // ne šalji ako nije validno
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Validno → pošalji podatke Netlify Formsu preko fetch (AJAX),
      // da se submission STVARNO zabilježi na Netlifyju, a korisnik ostane
      // na stranici i vidi poruku uspjeha.
      // VAŽNO: radi SAMO na objavljenoj Netlify stranici; lokalno POST nema
      // backend pa se izvrši catch() — to je očekivano.
      event.preventDefault();

      // GA4 event (samo ako je korisnik pristao i gtag postoji).
      trackEvent("form_submit", { form_name: "kontakt" });

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      // Serijaliziraj sva polja forme (uključuje i skriveni "form-name").
      var body = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          form.reset();
          if (success) success.hidden = false;
        })
        .catch(function () {
          if (success) success.hidden = true;
          window.alert(
            "Slanje trenutno nije moguće. Napomena: obrazac radi tek na objavljenoj Netlify stranici, ne lokalno."
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ====================================================================
     3) COOKIE CONSENT + CONSENT-GATED GA4
     ==================================================================== */
  function loadGtag() {
    // Učitaj GA tek nakon pristanka. Bez pristanka ovo se nikad ne poziva.
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === "G-XXXXXXXXXX") {
      // Placeholder ID — ne učitavaj stvarni GA dok nije postavljen pravi ID.
      // (Ostavljeno namjerno da demo ne šalje podatke na nepostojeći GA.)
      window.__gaConsented = true; // omogući da se eventi "pokušaju" poslati kad ID bude stvaran
      return;
    }

    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
    window.__gaConsented = true;
  }

  function trackEvent(name, params) {
    // Šalji event samo ako je dan pristanak i gtag je dostupan.
    if (!window.__gaConsented) return;
    if (typeof window.gtag !== "function") return;
    try {
      window.gtag("event", name, params || {});
    } catch (e) {
      // Tiho ignoriraj — analitika ne smije rušiti stranicu.
    }
  }

  function initCookieConsent() {
    var banner = document.getElementById("cookie-banner");
    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    var stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { stored = null; }

    if (stored === "accepted") {
      loadGtag(); // korisnik je već prije pristao
    } else if (stored === "rejected") {
      // ne učitavaj GA, ne prikazuj banner
    } else if (banner) {
      banner.hidden = false; // prvi posjet → prikaži banner
    }

    function persist(value) {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* no-op */ }
      if (banner) banner.hidden = true;
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        persist("accepted");
        loadGtag();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        persist("rejected");
        // GA se ne učitava.
      });
    }
  }

  /* ====================================================================
     4) HERO CTA EVENT
     ==================================================================== */
  function initCtaTracking() {
    var cta = document.getElementById("hero-cta");
    if (!cta) return;
    cta.addEventListener("click", function () {
      trackEvent("cta_click", { location: "hero", label: "Pošalji upit" });
    });
  }

  /* --- Init ----------------------------------------------------------- */
  function init() {
    initFilterAndSearch();
    initForm();
    initCookieConsent();
    initCtaTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();