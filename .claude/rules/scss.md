# Règle : SCSS — Architecture 7-1 + Mobile-First + Dark Mode

---

## Architecture 7-1

```
assets/styles/
├── abstracts/
│   ├── _variables.scss     ← Design tokens (mapping vers CSS custom props)
│   ├── _mixins.scss        ← Breakpoints, truncate, sr-only, etc.
│   ├── _functions.scss     ← rem(), fluid(), etc.
│   └── _placeholders.scss  ← %clearfix, %visually-hidden
├── base/
│   ├── _reset.scss         ← Modern CSS reset
│   ├── _typography.scss    ← Échelle typographique fluid (Utopia)
│   └── _global.scss        ← html, body, sélections, scrollbar
├── components/
│   ├── _button.scss
│   ├── _form.scss
│   ├── _card.scss
│   ├── _modal.scss
│   ├── _badge.scss
│   └── _accessibility-panel.scss
├── layout/
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _nav.scss
│   ├── _sidebar.scss
│   └── _grid.scss
├── pages/
│   ├── _home.scss
│   └── _auth.scss
├── themes/
│   ├── _light.scss         ← :root tokens
│   └── _dark.scss          ← [data-theme="dark"] tokens
├── vendors/
│   └── _normalize.scss
└── main.scss               ← @use de tous les modules
```

---

## Variables CSS Custom Properties — Design Tokens

```scss
// abstracts/_variables.scss — mapping SCSS → CSS vars
// NE PAS utiliser $variables directement dans les composants

// themes/_light.scss
:root {
    // Couleurs
    --color-bg:           #ffffff;
    --color-bg-subtle:    #f5f5f5;
    --color-text:         #111111;
    --color-text-subtle:  #555555;
    --color-primary:      #0066cc;
    --color-primary-dark: #004d99;
    --color-error:        #cc0000;
    --color-success:      #006b3c;
    --color-warning:      #854d00;
    --color-border:       #d1d5db;
    --color-focus:        #0066cc;

    // Typographie (fluid — Utopia)
    --font-size-sm:   clamp(0.875rem, 0.85vw, 1rem);
    --font-size-base: clamp(1rem, 1vw + 0.75rem, 1.125rem);
    --font-size-lg:   clamp(1.125rem, 1.5vw + 0.75rem, 1.5rem);
    --font-size-xl:   clamp(1.5rem, 2vw + 1rem, 2rem);
    --font-size-2xl:  clamp(2rem, 3vw + 1rem, 3rem);
    --line-height:    1.6;

    // Espacement
    --space-xs:  0.25rem;
    --space-sm:  0.5rem;
    --space-md:  1rem;
    --space-lg:  1.5rem;
    --space-xl:  2rem;
    --space-2xl: 3rem;

    // Effets
    --border-radius: 0.375rem;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);

    // Transitions
    --transition-fast: 150ms ease;
    --transition-base: 250ms ease;
    --transition-slow: 400ms ease;
}

// themes/_dark.scss
[data-theme="dark"] {
    --color-bg:           #111111;
    --color-bg-subtle:    #1e1e1e;
    --color-text:         #f5f5f5;
    --color-text-subtle:  #aaaaaa;
    --color-primary:      #4da6ff;
    --color-primary-dark: #80bdff;
    --color-error:        #ff6b6b;
    --color-success:      #4caf82;
    --color-warning:      #ffb347;
    --color-border:       #374151;
}
```

---

## Mixins obligatoires

```scss
// abstracts/_mixins.scss

// Breakpoints Mobile-First (min-width uniquement)
$breakpoints: (
    'sm':  480px,
    'md':  768px,
    'lg':  1024px,
    'xl':  1280px,
    '2xl': 1536px,
);

@mixin respond-to($bp) {
    @media (min-width: map-get($breakpoints, $bp)) {
        @content;
    }
}

// Accessibilité — Texte visuellement caché, accessible aux AT
@mixin sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

// Focus visible — RGAA AAA
@mixin focus-visible {
    &:focus-visible {
        outline: 3px solid var(--color-focus);
        outline-offset: 2px;
        border-radius: 2px;
    }
}

// Réduction de mouvement
@mixin reduce-motion {
    @media (prefers-reduced-motion: reduce) {
        @content;
    }
}
```

---

## Mobile-First — Règle absolue

```scss
// TOUJOURS partir du mobile, ajouter les breakpoints ensuite
.card {
    // Mobile (base)
    display: flex;
    flex-direction: column;
    padding: var(--space-md);

    // Tablette
    @include respond-to('md') {
        flex-direction: row;
        padding: var(--space-lg);
    }

    // Desktop
    @include respond-to('lg') {
        padding: var(--space-xl);
    }
}
```

---

## BEM — Nommage strict

```scss
// Bloc
.card { }

// Élément
.card__title { }
.card__body { }
.card__footer { }

// Modificateur
.card--featured { }
.card--compact { }

// INTERDIT : nesting > 3 niveaux
.card {
    &__title {          // OK (niveau 2)
        &--large { }    // OK (niveau 3)
        // PAS de niveau 4+ ici
    }
}
```

---

## Accessibilité dans le SCSS

```scss
// Skip link
.skip-link {
    @include sr-only;

    &:focus {
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 9999;
        width: auto;
        height: auto;
        padding: var(--space-sm) var(--space-md);
        background: var(--color-primary);
        color: white;
        clip: auto;
        white-space: normal;
    }
}

// Focus sur tous les éléments interactifs
a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]) {
    @include focus-visible;
}

// Respect prefers-reduced-motion
.animated-element {
    transition: transform var(--transition-base);

    @include reduce-motion {
        transition: none;
    }
}

// Panel accessibilité — taille de police
[data-font-size="large"] {
    font-size: calc(var(--font-size-base) * 1.25);
}

[data-font-size="xlarge"] {
    font-size: calc(var(--font-size-base) * 1.5);
}

// Contraste renforcé (utilisateur)
[data-contrast="high"] {
    --color-text: #000000;
    --color-bg: #ffffff;
    --color-primary: #0000ff;
    --color-border: #000000;
}
```

---

## Références

- Utopia (typographie fluide) : https://utopia.fyi/
- Every Layout : https://every-layout.dev/
- Modern CSS : https://moderncss.dev/
- MDN CSS : https://developer.mozilla.org/en-US/docs/Web/CSS
- WCAG contraste : https://webaim.org/resources/contrastchecker/
