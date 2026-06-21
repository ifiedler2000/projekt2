# Okusi Paga

Jednostranična, statična web stranica koja predstavlja tradicionalnu hranu i gastro baštinu otoka Paga (Hrvatska). Sadržaj je na hrvatskom jeziku, organiziran u tri kategorije (Sir i mliječno, Meso i riba, Slatko i piće), s filtriranjem, pretragom, kontakt obrascem i GDPR-usklađenim cookie pristankom.

Izrađeno kao studentski projekt za kolegij **Digitalna pismenost**.

## Live demo
https://okusi-paga.netlify.app (placeholder — zamijeniti stvarnim URL-om nakon objave)

## Datoteke
```
projekt2/
  index.html              # jednostranična stranica (hero, filter+pretraga, kartice, kontakt, izvori, footer, cookie banner)
  style.css               # CSS varijable (tokeni), mobile-first responzivni dizajn
  script.js               # filter+pretraga, validacija forme, cookie consent, consent-gated GA4
  assets/images/          # izvorne SVG placeholder slike (hero + 6 kartica)
  project-brief.md        # tema, publika, problem, vrijednost, cilj, CTA, ton, test rečenica
  research-brief.md       # činjenice po proizvodima + anotirana bibliografija izvora
  plan-objava.md          # 2-tjedni plan objava na društvenim mrežama
  measurement-plan.md     # SMART ciljevi, KPI tablica, metode praćenja, interpretacija
  canva-video-brief.md    # vizualni identitet + skripta promo videa + Instagram caption
  README.md               # ovaj dokument
```

## Tehnologije
- **HTML5** (semantičke sekcije, `lang="hr"`, Open Graph meta tagovi)
- **CSS3** (CSS varijable / tokeni, CSS Grid i Flexbox, mobile-first, fokus stilovi, kontrast)
- **JavaScript** (vanilla, bez ovisnosti): filter + live pretraga, validacija obrasca
- **Cookie banner** s pohranom izbora u `localStorage`
- **Google Analytics 4 — consent-gated:** analitika se učitava i šalje podatke tek nakon klika na "Prihvati"; uz "Odbij" se nikad ne učitava
- **GA4 eventi:** `cta_click` (hero CTA), `form_submit` (uspješno slanje)
- **Netlify Forms:** kontakt obrazac (`data-netlify="true"`) + honeypot polje protiv spama
- **Google Fonts:** Fraunces (naslovi) + Inter (tekst)

## Pristupačnost i sigurnost
- Labele uz sva polja, alt tekstovi na slikama (na hrvatskom), vidljivi fokus stilovi, navigacija tipkovnicom, "skip to content" link.
- Korisnički unos se ne ubacuje neobrađen u DOM (zaštita od XSS-a); poruke se postavljaju preko `textContent`.
- Nema tvrdo kodiranih API ključeva/tokena. Honeypot polje na obrascu protiv botova.
- HTTPS automatski osigurava Netlify (TLS certifikat) nakon objave.

## Pokretanje (lokalno)
Statična stranica — nije potreban build korak:
- Otvoriti `index.html` izravno u pregledniku, ili
- Pokrenuti lokalni server iz mape `projekt2/`, npr.:
  - `python -m http.server` pa otvoriti `http://localhost:8000`

## Objava (deploy)
- Povezati repozitorij/mapu s Netlifyjem ili prevući mapu u Netlify (drag & drop).
- Netlify Forms i HTTPS rade automatski nakon objave.
- Prije objave: u `script.js` zamijeniti `G-XXXXXXXXXX` stvarnim GA4 Measurement ID-em te ponovno provjeriti URL-ove izvora u `research-brief.md`.

## Autor
Ivana Fiedler — studentski projekt (Digitalna pismenost), 2026.

## Napomena o eksternim materijalima
Canva paket vizuala i sama promo video datoteka izrađuju se izvan ovog repozitorija. Njihov vizualni identitet, skripta videa i caption opisani su u `canva-video-brief.md`.
