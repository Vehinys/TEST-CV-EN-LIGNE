# Règle : Accessibilité RGAA AAA (appliquée à TOUS les fichiers front-end)

> Priorité absolue. Non négociable. S'applique à tous les templates Twig, composants SCSS et JavaScript.

---

## Contraste minimum

| Situation | Ratio |
|-----------|-------|
| Texte normal (< 18px) | **7:1** (AAA) |
| Texte grand (≥ 18px ou ≥ 14px bold) | **4.5:1** (AA) |
| Éléments UI (icônes, bordures) | 3:1 (AA) |

Outil de vérification : https://webaim.org/resources/contrastchecker/

---

## ARIA — Règles obligatoires

- `role` sémantique sur tous les éléments interactifs non-natifs
- `aria-label` ou `aria-labelledby` sur boutons/liens sans texte visible
- `aria-describedby` pour les aides contextuelles et messages d'erreur
- `aria-live="polite"` pour les mises à jour dynamiques (notifications)
- `aria-live="assertive"` pour les erreurs critiques uniquement
- `aria-expanded` sur tous les menus/accordéons
- `aria-controls` pour lier contrôle et contenu géré
- Référence : https://www.w3.org/WAI/ARIA/apg/

---

## Navigation clavier

- Focus visible sur **TOUS** les éléments interactifs (`outline` ≥ 2px solid, jamais `outline: none`)
- Ordre de tabulation logique et prévisible (DOM order ou `tabindex` justifié)
- Skip link `#main-content` en premier élément du `<body>`
- Aucun piège au focus (modals/drawers : focus piégé tant qu'ouvert, libéré à la fermeture)
- Fermeture des modals/menus avec `Escape`
- `Tab` / `Shift+Tab` : navigation entre éléments
- `Enter` / `Space` : activation des contrôles
- Flèches : navigation dans les widgets composites (menus, onglets)

---

## Formulaires

- `<label for="id">` associé à chaque `<input>`, `<select>`, `<textarea>`
- Champs requis : `required` + `aria-required="true"` + indicateur visuel
- Messages d'erreur liés par `aria-describedby` (pas seulement par couleur)
- Pas d'info transmise uniquement par couleur (ajouter icône + texte)
- Groupe de champs connexes dans `<fieldset>` + `<legend>`

---

## Images et médias

- `alt` descriptif sur toutes les images informatives
- `alt=""` sur les images décoratives (pas `alt` absent)
- SVG : `<title>` + `aria-labelledby` ou `role="img"` + `aria-label`
- Vidéos : sous-titres synchronisés + transcription textuelle

---

## Structure sémantique

- `<main>` unique par page, `id="main-content"` pour le skip link
- `<header>`, `<nav>`, `<aside>`, `<footer>` avec rôles landmarks
- Hiérarchie de titres `<h1>` → `<h6>` respectée (jamais sauter un niveau)
- Pas de `<div>` ou `<span>` pour des actions (utiliser `<button>`, `<a>`)

---

## Panel Accessibilité Utilisateur (obligatoire en front-end)

Intégrer nativement un panneau persistant (géré par localStorage) :

```
[ A- ] [ A ] [ A+ ]    ← Taille de police (3 niveaux : 14px, 16px, 20px)
[ Contraste renforcé ]  ← toggle (ratio 21:1 texte/fond)
[ Espacement lignes ]   ← toggle (line-height 1.8)
[ Animations réduites ] ← toggle (prefers-reduced-motion override)
```

- Bouton trigger accessible : `aria-label="Paramètres d'accessibilité"` + icône ♿
- Persistance via `localStorage.setItem('a11y-prefs', JSON.stringify(prefs))`
- Respecter `prefers-color-scheme` et `prefers-reduced-motion` nativement

---

## Tests obligatoires

- **Automatisé** : axe-core (https://github.com/dequelabs/axe-core) — zéro violation
- **Manuel clavier** : parcourir toute la page sans souris
- **Lecteur d'écran** : NVDA (Windows) ou VoiceOver (Mac)
- **Vérification contraste** : WAVE ou Colour Contrast Analyser

---

## Références

- RGAA 4.1 : https://www.numerique.gouv.fr/publications/rgaa-accessibilite/methode-rgaa/criteres/
- WCAG 2.2 : https://www.w3.org/WAI/WCAG22/quickref/
- ARIA APG : https://www.w3.org/WAI/ARIA/apg/
- A11y Project : https://www.a11yproject.com/
- axe-core : https://github.com/dequelabs/axe-core
