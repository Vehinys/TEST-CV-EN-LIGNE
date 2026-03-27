# CLAUDE.md — PORTFOLIO ALBERT LECOMTE
# Astro 5 + TypeScript + Tailwind CSS v4

> Généré le 2026-03-26. Remplace le CLAUDE.md Symfony précédent.
> Ce fichier complète le CLAUDE.md global (`~/.claude/CLAUDE.md`).

---

## Identité du projet

| Champ | Valeur |
|-------|--------|
| Projet | Portfolio personnel — Albert Lecomte |
| Type | Site statique (SSG) |
| Cible | Clients web design / patrons WordPress, Mulhouse + région |
| URL actuelle | https://lecomte-albert-cv.vercel.app/ |
| Hébergement | Vercel (CD automatique depuis GitHub) |
| Domaine | À configurer sur Vercel |

---

## Stack technique validée

| Couche | Technologie | Version |
|--------|-------------|---------|
| Framework | **Astro** | 5.x (latest) |
| Langage | **TypeScript** | 5.x strict |
| Styles | **Tailwind CSS** | v4 |
| Contenu | **Astro Content Collections** | JSON + Markdown |
| Contact | **EmailJS** | v4 |
| Analytics | **Plausible** | Cloud (sans cookie) |
| Animations | **Motion (anciennement Framer Motion)** | latest |
| Icônes | **Lucide** | latest |
| Déploiement | **GitHub → Vercel** | CD auto |

---

## Concept visuel

### Direction artistique
**Glassmorphism Professionnel Immersif** — Élégant, premium, sans excès.

### Palette de couleurs

```css
:root {
  /* === FOND === */
  --color-bg:           #050A14;   /* Nuit profonde */
  --color-bg-subtle:    #0D1525;   /* Panneau secondaire */
  --color-bg-card:      rgba(255, 255, 255, 0.06);  /* Verre */

  /* === BLEU — Couleur principale === */
  --color-primary:      #3B82F6;   /* Blue-500 — accent principal */
  --color-primary-glow: #60A5FA;   /* Blue-400 — glow/hover */
  --color-primary-deep: #1D4ED8;   /* Blue-700 — foncé */
  --color-electric:     #0EA5E9;   /* Sky-500 — accent secondaire */

  /* === TEXTE === */
  --color-text:         #F8FAFC;   /* Blanc cassé */
  --color-text-subtle:  #94A3B8;   /* Gris bleuté */
  --color-text-muted:   #475569;   /* Très discret */

  /* === GLASSMORPHISM === */
  --glass-bg:           rgba(255, 255, 255, 0.06);
  --glass-border:       rgba(255, 255, 255, 0.12);
  --glass-blur:         16px;
  --glass-shadow:       0 8px 32px rgba(0, 0, 0, 0.4);

  /* === LIGHT MODE === */
  --color-bg-light:     #F0F4FF;
  --color-bg-card-light: rgba(255, 255, 255, 0.7);
  --color-text-light:   #0F172A;
}

[data-theme="light"] {
  --color-bg:           #EFF6FF;
  --color-bg-subtle:    #DBEAFE;
  --color-bg-card:      rgba(255, 255, 255, 0.75);
  --color-text:         #0F172A;
  --color-text-subtle:  #475569;
  --glass-bg:           rgba(255, 255, 255, 0.6);
  --glass-border:       rgba(59, 130, 246, 0.2);
}
```

### Classe utilitaire glassmorphism (Tailwind)
```css
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}
```

---

## Architecture du projet

```
portfolio/
├── src/
│   ├── components/
│   │   ├── ui/                  ← Atomes réutilisables
│   │   │   ├── Button.astro
│   │   │   ├── Badge.astro
│   │   │   ├── GlassCard.astro
│   │   │   └── LightboxModal.astro
│   │   ├── sections/            ← Sections de la page
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Skills.astro
│   │   │   ├── Projects.astro   ← avec filtres
│   │   │   ├── Experience.astro
│   │   │   ├── Education.astro
│   │   │   └── Contact.astro    ← EmailJS
│   │   ├── layout/
│   │   │   ├── Header.astro     ← nav + lang toggle + theme toggle
│   │   │   ├── Footer.astro
│   │   │   └── AccessibilityPanel.astro
│   │   └── seo/
│   │       └── SEO.astro        ← meta, OG, Schema.org
│   ├── content/
│   │   ├── config.ts            ← defineCollection (Astro Content)
│   │   ├── projects/            ← Un fichier JSON par projet
│   │   │   ├── kucra-agency.json
│   │   │   ├── halloween-spooky.json
│   │   │   └── ...
│   │   └── skills/
│   │       └── skills.json      ← Toutes les compétences
│   ├── i18n/
│   │   ├── fr.json              ← Toutes les chaînes FR
│   │   ├── en.json              ← Toutes les chaînes EN
│   │   └── utils.ts             ← useTranslations(), getLangFromUrl()
│   ├── layouts/
│   │   └── BaseLayout.astro     ← html, head, skip link, panel a11y
│   ├── pages/
│   │   ├── index.astro          ← FR (défaut)
│   │   ├── en/
│   │   │   └── index.astro      ← EN
│   │   ├── mentions-legales.astro
│   │   ├── politique-confidentialite.astro
│   │   └── declaration-accessibilite.astro
│   ├── styles/
│   │   └── global.css           ← @import tailwindcss + CSS custom props
│   └── utils/
│       ├── emailjs.ts           ← sendEmail() wrapper
│       └── animations.ts        ← variants Motion
├── public/
│   ├── cv/
│   │   └── albert-lecomte-cv.pdf
│   ├── images/
│   │   └── projects/            ← screenshots projets
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.ts           ← si v3 / sinon @import dans global.css
├── tsconfig.json                ← strict: true
└── .env.local                   ← EMAILJS_PUBLIC_KEY (jamais commité)
```

---

## Mode ultrathink

Dès que la tâche est complexe, activer **ultrathink** avant tout code :
- Architecture de la section
- Impacts accessibilité RGAA AAA
- Animation réduite (`prefers-reduced-motion`)
- Compatibilité dark/light mode
- Performance (LCP, CLS, FID)

---

## Avant chaque action — OBLIGATOIRE

```
Quoi   : [ce qui va être modifié]
Où     : [fichier:ligne ou composant]
Impact : [effets de bord possibles]
```

---

## Vérification web obligatoire (bugs)

1. STOP — Pas de fix immédiat
2. Consulte la doc officielle Astro / TypeScript
3. Compare ton idée vs la doc
4. Applique uniquement ce qui est sûr à 100%
5. Cite la source

---

## Journal d'erreurs

→ `docs/error-log.md` — **Lire à chaque début de session**

---

## Conventions Astro 5

### Content Collections
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'data',  // JSON files
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    url: z.string().url().optional(),
    github: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum(['design', 'frontend', 'backend', 'tools']),
    level: z.number().min(1).max(5),
    icon: z.string(),
  }),
});

export const collections = { projects, skills };
```

### Composants Astro
```astro
---
// Props typées — TOUJOURS
interface Props {
  title: string;
  variant?: 'primary' | 'ghost';
}
const { title, variant = 'primary' } = Astro.props;
---
```

### Internationalisation
```typescript
// src/i18n/utils.ts
export function getLangFromUrl(url: URL): 'fr' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'fr';
}

export function useTranslations(lang: 'fr' | 'en') {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['fr'][key] ?? key;
  };
}
```

### EmailJS
```typescript
// src/utils/emailjs.ts
import emailjs from '@emailjs/browser';

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await emailjs.send(
    import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
    import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
    data,
    { publicKey: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY }
  );
}
```

---

## SEO Avancé

### Composant SEO.astro (obligatoire sur toutes les pages)
```astro
---
// src/components/seo/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'profile';
}
---
<title>{title} — Albert Lecomte</title>
<meta name="description" content={description} />
<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={image ?? '/og-default.png'} />
<meta property="og:type" content={type ?? 'website'} />
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<!-- Schema.org Person -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Albert Lecomte",
  "jobTitle": "Concepteur Designer UI",
  "url": "https://lecomte-albert-cv.vercel.app",
  "address": { "@type": "PostalAddress", "addressLocality": "Mulhouse" }
}
</script>
```

### Sitemap
```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://lecomte-albert-cv.vercel.app',
  integrations: [sitemap()],
});
```

---

## Animations (Motion)

```typescript
// Respecter TOUJOURS prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const fadeInUp = {
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: prefersReducedMotion ? 0 : 0.5 },
};
```

---

## Plausible Analytics

```astro
<!-- Dans BaseLayout.astro <head> -->
<script
  defer
  data-domain="lecomte-albert-cv.vercel.app"
  src="https://plausible.io/js/script.js"
></script>
```
- Aucun cookie
- Conforme CNIL sans bannière
- Mention dans Politique de Confidentialité

---

## Accessibilité RGAA AAA

→ Voir `.claude/rules/accessibility.md`
- Contraste minimum : **7:1**
- Skip link `#main-content` dans BaseLayout
- Panel accessibilité (taille police, contraste, espacement)
- `prefers-reduced-motion` respecté sur toutes les animations
- Navigation clavier complète

---

## Pages légales (personne physique, sans SIRET)

Générer dans `src/pages/` :

### mentions-legales.astro
```
Éditeur : Albert Lecomte (personne physique)
Adresse : Mulhouse, Alsace, France
Email : [email professionnel]
Hébergeur : Vercel Inc., 340 Pine Street, Suite 603, San Francisco, CA 94104
```

### politique-confidentialite.astro
- Données collectées : formulaire de contact (nom, email, message)
- Traitement : EmailJS → boîte mail personnelle uniquement
- Durée : durée de la relation commerciale (3 ans max)
- Droits : accès, rectification, suppression → email direct
- Analytics : Plausible (sans cookie, données anonymisées)

### declaration-accessibilite.astro
- Norme : RGAA 4.1
- Niveau visé : AA (mention AAA pour contraste)
- Date de déclaration : 2026-03-26
- Contact non-conformité : email direct

---

## Variables d'environnement

```bash
# .env.local (JAMAIS commité)
PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxx
```

```bash
# .env.example (commité — valeurs vides)
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
PUBLIC_EMAILJS_PUBLIC_KEY=
```

---

## Commandes projet

```bash
npm run dev          # Dev server http://localhost:4321
npm run build        # Build production
npm run preview      # Preview build local
npm run astro check  # Vérification TypeScript Astro
```

---

## Références Documentation

| Domaine | URL |
|---------|-----|
| Astro 5 | https://docs.astro.build/en/getting-started/ |
| Astro Content Collections | https://docs.astro.build/en/guides/content-collections/ |
| Tailwind CSS v4 | https://tailwindcss.com/docs |
| TypeScript | https://www.typescriptlang.org/docs/ |
| EmailJS SDK | https://www.emailjs.com/docs/sdk/send/ |
| Plausible | https://plausible.io/docs |
| Motion | https://motion.dev/docs |
| RGAA 4.1 | https://www.numerique.gouv.fr/publications/rgaa-accessibilite/ |
| WCAG 2.2 | https://www.w3.org/WAI/WCAG22/quickref/ |
| Schema.org Person | https://schema.org/Person |
| Core Web Vitals | https://web.dev/vitals/ |
| CNIL Guide Dev | https://www.cnil.fr/fr/guide-developpeur |
