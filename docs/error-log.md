# Journal d'Erreurs — Portfolio Albert Lecomte (Astro 5)

> **INSTRUCTION OBLIGATOIRE :** Lis ce fichier à chaque démarrage de session.
> Vérifie les erreurs similaires avant toute action risquée.
> Mets à jour après chaque erreur rencontrée.

---

## Statistiques

| Catégorie    | Total |
|--------------|-------|
| SYNTAX       | 0     |
| IMPORT       | 0     |
| LOGIC        | 0     |
| PATTERN      | 0     |
| TYPE         | 1     |
| SECURITY     | 0     |
| PERF         | 0     |
| A11Y         | 0     |
| CONFIG       | 0     |
| ARCHITECTURE | 0     |
| **TOTAL**    | **1** |

---

## Quick Reference — Règles apprises

- **TYPE** : Dans un script Astro, une guard `if (!el) return` dans le corps de l'IIFE ne suffit pas pour que TypeScript considère la variable comme non-nulle dans les closures internes. Utiliser `el!` (non-null assertion) ou une variable rethypée dans le scope de la closure.

---

## Erreurs documentées

### ERR-001 — `startMenu` possibly null dans les closures Taskbar

- **Date** : 2026-03-28
- **Catégorie** : TYPE
- **Fichier** : `src/components/os/Taskbar.astro:428-439`
- **❌ Mauvais** :
```typescript
const startMenu = document.getElementById('start-menu');
if (!startBtn || !startMenu) return; // guard dans l'IIFE

function openMenu(): void {
  startMenu.hidden = false; // ❌ ts(18047): 'startMenu' is possibly 'null'
  startMenu.style.animation = 'none';
}
```
- **✅ Bon** :
```typescript
const startMenu = document.getElementById('start-menu') as HTMLElement;
// ou utiliser startMenu! dans chaque closure
// ou redéclarer : const menu = startMenu; // TypeScript reconnaît le narrowing local
```
- **Cause racine** : TypeScript ne propage pas le narrowing de type (`!= null`) au-delà d'une guard dans le corps principal vers des fonctions closures déclarées après. La guard `if (!startMenu) return` fonctionne uniquement pour le code inline qui suit, pas pour les fonctions définies après.
- **Règle** : Après `getElementById`, toujours typer explicitement avec `as HTMLElement` si l'élément est garanti présent, ou utiliser l'opérateur `!` dans les closures. Ne pas compter sur la guard IIFE pour le narrowing dans les fonctions enfants.
- **Source** : https://www.typescriptlang.org/docs/handbook/2/narrowing.html

---

## Format d'entrée (à copier pour chaque nouvelle erreur)

```markdown
### ERR-[NNN] — [Titre court et explicite]
- **Date** : YYYY-MM-DD
- **Catégorie** : SYNTAX | IMPORT | LOGIC | PATTERN | TYPE | SECURITY | PERF | A11Y | CONFIG | ARCHITECTURE
- **Fichier** : chemin/du/fichier:ligne
- **❌ Mauvais** : `code incorrect`
- **✅ Bon** : `code correct`
- **Cause racine** : explication précise du pourquoi
- **Règle** : formulation de la règle à suivre désormais
- **Source** : URL de la documentation officielle consultée
```

---

## Workflow de mise à jour

```
Début de session     → Lire ce fichier entier
Avant action risquée → Chercher une erreur similaire ici
Après une erreur     → Ajouter une entrée ERR-NNN
                     → Incrémenter le compteur de catégorie
                     → Ajouter la règle dans Quick Reference
```
