# /loop — Boucle Autonome Tests → Fix → Re-test → 0 erreur

Mode autonome itératif. Maximum **5 itérations**. Arrêt forcé à l'itération 5.

---

## Activation

```
/loop [commande optionnelle]
Exemples :
  /loop                        ← lance phpunit par défaut
  /loop phpstan                ← analyse statique
  /loop "php bin/phpunit --filter UserTest"
```

---

## Pré-conditions (avant la boucle)

1. **Lire** `docs/error-log.md` — identifier les patterns d'erreurs connus
2. **Reformuler** la tâche :
   ```
   Quoi   : [ce qui va être testé/fixé]
   Où     : [fichier:ligne ou bundle]
   Impact : [effets de bord possibles]
   ```
3. **Snapshot** : noter l'état initial (nombre d'erreurs, tests qui échouent)

---

## Boucle principale

```
╔═══════════════════════════════════════════════════════╗
║  ITÉRATION [N/5]                                      ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  1. EXÉCUTER la commande de test                      ║
║     → Capturer stdout + stderr complets               ║
║                                                       ║
║  2. ANALYSER les résultats                            ║
║     → Nombre d'erreurs/échecs                         ║
║     → Catégoriser : SYNTAX | LOGIC | TYPE | CONFIG    ║
║                                                       ║
║  3. SI erreurs détectées :                            ║
║     a. Identifier la CAUSE RACINE (pas le symptôme)   ║
║     b. Recherche web doc officielle si nécessaire     ║
║     c. Appliquer le FIX (Quoi/Où/Impact)              ║
║     d. Vérifier pas d'effet de bord                   ║
║     e. → Retour étape 1 (itération N+1)               ║
║                                                       ║
║  4. SI 0 erreur → SUCCÈS → sortir de la boucle        ║
╚═══════════════════════════════════════════════════════╝
```

---

## Commandes Symfony disponibles

```bash
# Tests
php bin/phpunit
php bin/phpunit --filter ClassName
php bin/phpunit --coverage-text

# Qualité statique
vendor/bin/phpstan analyse src/ --level=max
vendor/bin/php-cs-fixer fix

# Symfony
php bin/console cache:clear
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console lint:twig templates/
php bin/console lint:yaml config/
php bin/console debug:container --deprecations

# Assets
php bin/console asset-map:compile
```

---

## Règles de fix pendant la boucle

1. **Un fix = un problème** — ne jamais corriger plusieurs causes dans le même fix
2. **Vérifier la doc officielle** avant tout fix impliquant une API Symfony/Doctrine
3. **Jamais de suppression** de tests qui échouent — corriger le code, pas les tests
4. **Jamais de `@skip`** ajouté pour masquer une erreur
5. **Typage strict maintenu** — pas de `mixed`, pas de `@suppress`

---

## Arrêt d'urgence (itération 5 ou blocage)

Si après 5 itérations l'erreur persiste, STOP immédiat :

```markdown
## ⛔ BOUCLE INTERROMPUE — ITÉRATION [N]

### Erreur persistante
[Description précise de l'erreur]

### Tentatives effectuées
1. [Fix tentative 1] → [résultat]
2. [Fix tentative 2] → [résultat]
...

### Cause racine probable
[Hypothèse documentée]

### Recommandation
[Analyse approfondie / investigation manuelle nécessaire]
```

Puis documenter dans `docs/error-log.md`.

---

## Rapport de succès

```markdown
## ✅ BOUCLE RÉUSSIE — [N] itération(s)

### Résultat final
- Tests : [X passing, 0 failing]
- Coverage : [X%]

### Fixes appliqués
1. [Fix 1] — [fichier:ligne]
2. [Fix 2] — [fichier:ligne]

### Journal
[Nouvelle erreur à documenter dans error-log.md ? Oui/Non]
```
