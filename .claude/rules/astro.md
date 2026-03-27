# Règle : Astro 5 — Conventions portfolio

> Source : https://docs.astro.build/en/getting-started/

## Composants — Props typées obligatoires
```astro
---
interface Props {
  title: string;
  class?: string;
}
const { title, class: className } = Astro.props;
---
```

## Content Collections — JSON
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';
const projects = defineCollection({
  type: 'data',
  schema: z.object({ title: z.string(), tags: z.array(z.string()) }),
});
export const collections = { projects };
```

## i18n
```typescript
// Routing : /index.astro (FR) + /en/index.astro (EN)
// Toutes les chaînes dans src/i18n/fr.json + en.json
// Jamais de texte en dur dans les composants
```

## Images
```astro
import { Image } from 'astro:assets';
<Image src={img} alt="Description précise" width={800} height={600} />
```
- Toujours `alt` descriptif
- `loading="lazy"` sauf image hero (above the fold)

## Performance
- Pas de client-side JS sauf si `client:visible` / `client:idle` justifié
- Préférer composants `.astro` purs aux composants React/Vue
- `@astrojs/sitemap` obligatoire

## Références
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/guides/internationalization/
- https://docs.astro.build/en/guides/images/
