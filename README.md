# Springfield Fanzonen — The Simpsons

En interaktiv svensk fansajt om The Simpsons: karaktärer, ikoniska platser, ett bildgalleri med riktiga skärmdumpar, legendariska avsnitt, spel, citat, trivia och en interaktiv soffgag. Premium-känsla men medvetet lättviktig — fungerar fint även på äldre/svagare datorer.

---

## Tech Stack

| Del | Val |
|---|---|
| **Struktur** | Vanilla HTML/CSS/JS (inga ramverk, ingen build) |
| **Animationer** | GSAP 3.12.5 + ScrollTrigger + TextPlugin (CDN) |
| **Typografi** | Bangers (rubriker), Permanent Marker (handskrivet/citat), Nunito (brödtext), Comic Neue (fallback) |
| **Bilder** | Riktiga seriebildrutor via [Frinkiac](https://frinkiac.com), nedladdade lokalt till `images/` |
| **Ikoner** | Inga — karaktärer & byggnader är helt CSS-ritade |

### CDN-inkludering (i botten av `<body>`)
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>
<script src="script.js"></script>
```

---

## Project Structure

```
SimpsonsFan/
├── index.html      # Hela enkelsidan, alla sektioner inline
├── styles.css      # All styling, tema-variabler, responsiv design
├── script.js       # GSAP-animationer, karuseller, tema-toggle, perf-läge
├── images/         # 28 lokala seriebildrutor (Frinkiac), ~576 KB totalt
│   ├── char-*.jpg  # karaktärsfoton (Homer/Marge/Bart/Krusty; Lisa/Burns delar gal-)
│   ├── loc-*.jpg   # 6 platsfoton
│   ├── ep-*.jpg    # 6 avsnittsbilder (timeline)
│   ├── gal-*.jpg   # 9 galleribilder
│   ├── game-*.jpg  # spelbild (Hit & Run)
│   └── couch-*.jpg # "familjen i soffan"-payoff
└── README.md
```

---

## Sektioner

| # | Sektion | Beskrivning |
|---|---|---|
| 1 | Loader | Munk-spinner ("Laddar Springfield…") |
| 2 | Navigation | Fast glas-nav, hamburger på mobil, länk till Galleri |
| 3 | Hero | Himmel + moln (parallax) + CSS-skyline med kraftverk |
| 4 | Karaktärer | 8 kort med 3D-flip + karusell. 6 har riktiga foton; Maggie & Ned har CSS-avatar (inga solo-bildrutor finns) |
| 5 | Springfield | 6 platskort med riktiga foton + tilt-effekt |
| 6 | **Galleri** | **NYTT** — "Springfield i bilder", 9 riktiga skärmdumpar i editoriellt rutnät |
| 7 | Episoder | Tidslinje med 6 avsnitt — **nu med riktig skärmdump per kort** |
| 8 | Spel | Featured (Hit & Run) med riktig bild + 4 retro mini-kort |
| 9 | Citat | Autoplay-karusell, 10 citat (`.quotes-carousel` kräver `width:100%`) |
| 10 | Trivia | 9 faktakort med räknaranimation |
| 11 | Soffgaget | Couch gag — familjen springer fram, sedan tonas en riktig "familjen i soffan"-bild in |
| 12 | Footer | Brand, snabblänkar, Frinkiac-attribution |

---

## Design system

- **Färger:** Simpsons-gult (`#FED41D`) som accent, himmelsblått, Marge-blått, donut-rosa m.fl.
- **Tema:** Mörkt som standard + fullt **ljust läge** via `:root[data-theme="light"]`. Allt styrs av semantiska CSS-variabler (`--surface`, `--deep`, `--text-soft`, `--hairline`, `--shadow-card` …) så båda lägena fungerar.
- **Skuggor:** Tonade, flerlagers (`--shadow-card` / `--shadow-card-hover`) — inte platt svart.
- **Eyebrows:** Sektions-underrubriker har flankerande linjer (editoriell känsla).
- **Glas-nav:** `backdrop-filter: blur(16px) saturate(140%)` vid scroll (stängs av i Lite-läge).

### Dark/Light-toggle
- Flytande sol/måne-knapp nere till höger (`.theme-toggle`).
- Inline-script i `<head>` sätter `data-theme` **före paint** (ingen flash). Läser `localStorage['theme']`, faller tillbaka på `prefers-color-scheme`.

---

## How to Run

```
# Öppna direkt:
open index.html
# eller med lokal server:
npx serve .
```
Inga beroenden att installera. Bilderna ligger lokalt — sidan kräver ingen internetanslutning (utom CDN för GSAP/typsnitt, som har fallbacks).

---

## Customization

| Vad | Var |
|---|---|
| Byt accentfärg / palett | `:root` i `styles.css` |
| Justera ljust tema | `:root[data-theme="light"]` i `styles.css` |
| Byt/lägg till bilder | `images/` + referenser i `index.html` (alla `<img>` har `onerror`-fallback) |
| Lägg till galleribild | Kopiera en `.gallery-item` i `#gallery` |
| Hämta nya seriebilder | Frinkiac-API: `https://frinkiac.com/api/search?q=<text>` → bild: `https://frinkiac.com/img/<Episode>/<Timestamp>/medium.jpg` |

---

## Prestanda (lättdriven på äldre datorer)

- **Auto / Lite-läge** via `data-perf="lite"` på `<html>`. Inline-script auto-detekterar svag hårdvara (kärnor ≤4, minne ≤4 GB, save-data).
- **Runtime FPS-vakt:** mäter ~2,5 s efter load; vid < 40 FPS slås Lite-läge på automatiskt och sparas i `localStorage['simpsons:perfMode']` (CPU-detektering ensam missar svaga GPU:er).
- **Lite-läge** stänger av: backdrop-blur, marquee/steam-animationer, location-shimmer m.m.
- `prefers-reduced-motion` respekteras (nollar animationer, stänger av cursor-trail).
- Bilder: `loading="lazy"`, `decoding="async"`, satta `width/height` (ingen layout-shift), lokala (~290 KB totalt).
- Oanvänt `particles.js` borttaget.

---

## Mobile / Responsive

- Breakpoints: **1200 / 1024 / 900 / 768 / 480**
- Hamburger-meny < 768px (glas-panel som glider in).
- Galleri: 4 kolumner → 2 på mobil.
- Hero-rubrik och underrubrik skalar med `clamp()`; underrubrik kapad till `36ch` (ingen horisontell spill).
- Touch/swipe i karaktärskarusellen.

---

## Browser support

Chrome 90+, Firefox 88+, Safari 14+ (kräver stöd för CSS-variabler, `aspect-ratio`, `backdrop-filter`).

---

## Krediter

Seriebildrutor via **[Frinkiac](https://frinkiac.com)**. Fansida — inte affilierad med eller godkänd av 20th Century / Disney. The Simpsons © 20th Television.
