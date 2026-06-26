# Stomatologija LUMA — Landing stranica

Portfolio projekat: moderna landing stranica za izmišljenu stomatološku ordinaciju **LUMA**. Cilj stranice je lead generation — posetilac zakazuje pregled putem kontakt forme.

Izgrađena u čistom HTML-u, CSS-u i vanilla JavaScript-u. Bez frameworka, bez build procesa, bez backenda.

---

## Karakteristike

- **Dizajn** — paleta "Calm Clinic" (topla off-white, smiren teal, amber CTA), Fraunces serif + Inter sans-serif, zaobljeni elementi, arch/luk motiv u hero sekciji
- **9 sekcija** — Header, Hero, Usluge, Zašto LUMA, Tim, Testimonijali, FAQ, Zakazivanje, Footer
- **Mobile-first responsive** — breakpointi na 640px i 960px
- **Pristupačnost** — skip link, `aria-expanded`/`aria-controls` na FAQ i hamburger meniju, `aria-live` na greškama forme, vidljiv `:focus-visible` stil, podrška za `prefers-reduced-motion`
- **SEO** — `<title>`, `meta description`, `theme-color`, `canonical`, Open Graph tagovi, `lang="sr"`
- **Semantički HTML** — `header`, `nav`, `main`, `section`, `footer`, jedan `<h1>`, pravilna H2/H3 hijerarhija
- **Animacije** — scroll reveal (IntersectionObserver), stagger efekat, brojač statistike (easeOutQuart), float animacija na arch motivu, smooth FAQ expand/collapse — sve gašeno pod `prefers-reduced-motion`
- **Validacija forme** — blur + re-type validacija, zabrana datuma u prošlosti, fokus na prvo nevalidno polje pri submit-u, success poruka
- **Bez eksternih biblioteka** — jedino Google Fonts preko `<link>` taga

---

## Struktura fajlova

```
stomatoloska-luma/
├── index.html       # Kompletna stranica (sve sekcije)
├── css/
│   └── style.css    # Svi stilovi, custom properties, responsive
├── js/
│   └── main.js      # Sva interaktivnost (FAQ, forma, reveal, counter…)
├── README.md
└── .gitignore
```

---

## Pokretanje lokalno

Nije potreban nikakav build. Dovoljno je servirati fajlove sa lokalnog servera (direktno otvaranje `index.html` u browseru radi, ali Google Fonts zahteva konekciju):

```bash
# Opcija 1 — npx serve (preporučeno)
npx serve .

# Opcija 2 — Python
python -m http.server 8000

# Opcija 3 — VS Code Live Server ekstenzija
# Desni klik na index.html → "Open with Live Server"
```

Stranica se otvara na `http://localhost:3000` (serve) ili `http://localhost:8000` (Python).

---

## Deploy na Vercel

1. Push projekat na GitHub repozitorijum
2. Idi na [vercel.com](https://vercel.com) → **Add New Project** → importuj repozitorijum
3. U podešavanjima projekta:
   - **Framework Preset**: `Other`
   - **Build Command**: *(ostavi prazno)*
   - **Output Directory**: *(ostavi prazno ili `.`)*
4. Klikni **Deploy**

Vercel automatski detektuje statičke fajlove i serviruje `index.html` sa globalnog CDN-a.

---

## Tehnologije

| Tehnologija | Verzija / Napomena |
|---|---|
| HTML | 5, semantički |
| CSS | Custom properties, Flexbox, Grid, `clamp()` |
| JavaScript | ES2020+, vanilla, `'use strict'` |
| Fontovi | Google Fonts — Fraunces, Inter |
| Deploy | Vercel (static hosting) |
