# Plan mjerenja — Okusi Paga

Mjeri se uspješnost jednostranične stranice putem Google Analytics 4 (učitava se tek nakon pristanka korisnika). Budući da je stranica nova, baseline vrijednosti temelje se na obrazloženim pretpostavkama i revidiraju se nakon prvog mjeseca prikupljanja podataka.

## Ciljevi (2 SMART cilja)

1. **Doseg i interes:** U prvih 30 dana od objave (8.6.–8.7.2026.) ostvariti najmanje **300 pregleda stranice** (page_view), uz prosječno trajanje sesije veće od 30 sekundi.
2. **Konverzija (upiti):** U prvih 30 dana ostvariti najmanje **15 uspješnih slanja kontakt obrasca** (form_submit), uz stopu konverzije od pregleda do upita od najmanje **5%**.

## KPI tablica (3 KPI)

| KPI | GA event | Baseline | Target | Kako mjeriti |
|---|---|---|---|---|
| Broj pregleda stranice | page_view | 0 (nova stranica) | 300 / 30 dana | GA4 izvještaj Reports → Engagement → Pages and screens (views) |
| Klikovi na primarni CTA "Pošalji upit" | cta_click | 0 | 60 / 30 dana | GA4 Reports → Engagement → Events (event cta_click), filtrirano po location = hero |
| Uspješno poslani upiti | form_submit | 0 | 15 / 30 dana | GA4 Reports → Engagement → Events (event form_submit); usporedba s Netlify Forms prijavama |

## Metode praćenja
- **page_view:** standardni GA4 događaj. Prati se u izvještaju "Pages and screens" za ukupne preglede i u "Traffic acquisition" za izvore prometa (organski, društvene mreže, izravno).
- **cta_click:** prilagođeni događaj koji se šalje pri kliku na hero gumb "Pošalji upit". Prati se u izvještaju "Events" i u funnel/exploration analizi (korak prije slanja obrasca).
- **form_submit:** prilagođeni događaj koji se šalje samo pri uspješnoj (validnoj) predaji obrasca. Prati se u "Events"; broj se unakrsno provjerava s brojem prijava u Netlify Forms administraciji.
- Konverzijski lijevak: page_view → cta_click → form_submit promatra se kroz GA4 Explore (Funnel exploration) radi uočavanja gdje korisnici odustaju.

## Interpretacija
- **Ako page_view ne dosegne cilj:** problem je vjerojatno u dosegu/distribuciji. Pojačati objave na društvenim mrežama (vidi plan-objava.md), revidirati naslov i opis (SEO/OG) te izvore prometa.
- **Ako je cta_click nizak uz dobar page_view:** sadržaj privlači, ali poziv na akciju nije dovoljno jasan ili vidljiv. Testirati tekst i poziciju CTA gumba, pojačati kontrast i ponavljanje poziva.
- **Ako je cta_click dobar, ali form_submit nizak:** obrazac je prepreka. Provjeriti dužinu i jasnoću polja, validacijske poruke te eventualne tehničke greške pri slanju (uskladiti s Netlify Forms prijavama).
- **Ako se ciljevi ne ostvare uz dovoljno podataka:** revidirati baseline i ciljeve prema stvarnim mjesečnim vrijednostima i postaviti realnije pragove za sljedeće razdoblje.
