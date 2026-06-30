# Lyckokulan — Premium glass-e-handel (demo)

> **Obs:** Mappen heter fortfarande `SimpsonsFan` av historiska skäl. Innehållet är sedan 2026 ombyggt till **Lyckokulan**, ett påhittat premium-glassföretag. Den gamla Simpsons-fansajten finns bevarad i git-taggen **`simpsons-fan-v1`**.

En fullständig, premium e-handelssida för ett påhittat glassföretag som vänder sig till **barn och föräldrar**. Helt utan backend — all "butikslogik" körs i webbläsaren med `localStorage`. Byggd för att kännas lyxig men vara lättdriven även på äldre datorer.

---

## Tech Stack

| Del | Val |
|---|---|
| **Struktur** | Vanilla HTML/CSS/JS (inga ramverk, ingen build) |
| **Animation** | Ren CSS + `IntersectionObserver` (inga tunga bibliotek) |
| **Typografi** | Fredoka (display), Nunito (brödtext), Caveat (accent) |
| **Bilder** | Riktiga foton från Unsplash, **nedladdade lokalt** till `images/` (~1,4 MB) |
| **Ikoner** | Inline-SVG (inga CDN-beroenden) |
| **State** | `localStorage` (kundvagn, önskelista, tema, cookies) |

---

## Project Structure

```
SimpsonsFan/                (mappnamn oförändrat – innehåll = Lyckokulan)
├── index.html      # Hela enkelsidan: nav, hero, butik, drawers, modaler
├── styles.css      # Pastell gelato-designsystem, dark mode, alla komponenter
├── script.js       # Webshop-logik (IIFE): produkter, kundvagn, önskelista, filter, sök, quick-view, box-byggare, kassa
├── images/         # 14 lokala foton: hero, bowl, about, joy + 10 prod-*.jpg
└── README.md
```

---

## Sektioner & funktioner

| # | Sektion | Funktion |
|---|---|---|
| 1 | Announcement-bar | Fri frakt / rabattkod, stängbar (sparas i localStorage) |
| 2 | Glas-header | Sticky, logga, nav, **sök**, **önskelista**, **kundvagn** (med antal), **tema-toggle**, hamburger |
| 3 | Hero | Värdeerbjudande, CTA, trust-chips, lifestyle-foto, betyg-sticker |
| 4 | USP-bar | Ekomjölk · Riktiga råvaror · Fryst leverans · Familjeägt |
| 5 | **Butik (Smaker)** | 10 produkter renderade från JS · filter (Alla/Klassiker/Barn/Pinnglass/Veganskt/Bästsäljare) · sortering · sök · betyg · badges |
| 6 | Produktkort | Quick-add, önskelista-hjärta, **Snabbvy**-modal (allergener, innehåll, förvaring) |
| 7 | Feature-banner | "Bygg din egen box" |
| 8 | **Box-byggaren** | Välj 6 smaker → lägg i kundvagn (299 kr) — interaktivt, kul för barn |
| 9 | **Glassklubben** | 3 prenumerationsplaner → lägg i kundvagn |
| 10 | Vår historia | Varumärkesberättelse + värden för föräldrar (inga konstgjorda färger m.m.) |
| 11 | Recensioner | 4,9/5, omdömen från föräldrar |
| 12 | Hitta oss | Skopbarer + stiliserad karta |
| 13 | FAQ | `<details>`-dragspel |
| 14 | Nyhetsbrev | 10%-rabatt-signup |
| 15 | Footer | 4 kolumner, social, betalsätt |
| – | **Kundvagn (drawer)** | Antal +/−, ta bort, **fri frakt-mätare**, fejk-kassa (kvitto-modal) |
| – | **Önskelista (drawer)** | Spara favoriter, flytta till kundvagn |
| – | Rabatt-popup | Visas efter 9 s (en gång, localStorage) |
| – | Cookie-banner · Toasts · Till-toppen | Standard premium-detaljer |

---

## Design system — Pastell Gelato

| Token | Värde | Roll |
|---|---|---|
| `--mynta` | `#A8E6CF` | mynta |
| `--jordgubb` | `#FF9AA2` | jordgubb |
| `--hallon` | `#E5638D` | **accent / CTA** |
| `--hallon-deep` | `#C2406B` | liten text (WCAG) / hover |
| `--lavender` | `#C8B6E2` | lavendel |
| `--bg` | `#FFF6E9` | varm gräddvit sida |
| `--text` | `#3A2A3F` | bär-mörk text |

- **Light = standard**, **Dark mode** via `:root[data-theme="dark"]` (djup plommonbakgrund). Tema sätts före paint i inline-script (`localStorage['theme']` → `prefers-color-scheme`).
- Tonade flerlagers-skuggor, eyebrow-linjer, pill-knappar, mjuka radier (16–26px – lekfullt men polerat).

---

## How to Run

```
open index.html       # eller: npx serve .
```
Inga beroenden. Bilderna ligger lokalt → fungerar offline, inga "trasiga bilder"-problem.

---

## "Skulle behöva en riktig tjänst" (om sidan gick live)

| Funktion | Riktig tjänst att koppla in |
|---|---|
| Kassa & betalning | Stripe Checkout, Klarna, Swish Handel |
| Prenumeration | Stripe Billing / Recharge |
| Nyhetsbrev | Klaviyo, Mailchimp |
| Riktiga omdömen | Trustpilot, Yotpo |
| Produkt/lager | Shopify Storefront API, Snipcart |
| Sök | Algolia / Typesense |

---

## Prestanda (lättdriven)

- Inga tunga bibliotek (ingen GSAP/jQuery). Reveals via `IntersectionObserver`.
- `data-perf="lite"` auto-detektering (kärnor/minne/save-data) stänger av blur/animationer.
- `prefers-reduced-motion` respekteras. Bilder `loading="lazy"` + satta `width/height` (ingen CLS).

## Responsive

Breakpoints **1024 / 880 / 680 / 460**. Hamburger < 880px. Produktrutnät 4→3→2→2 kolumner. Drawers/modaler fyller skärmen snyggt på mobil.

## Browser support

Chrome 90+, Firefox 88+, Safari 14+ (kräver CSS-variabler, `color-mix()`, `aspect-ratio`, `backdrop-filter`).
