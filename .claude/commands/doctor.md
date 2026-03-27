# /doctor — Diagnostic Chirurgical du Projet

Lance un audit complet du projet Symfony. Génère un rapport structuré avec plan de guérison.

---

## Pré-requis

Avant de commencer l'audit, lire `docs/error-log.md` pour les erreurs connues.

---

## Checklist d'audit

### 1. Structure du projet
- [ ] Vérifier que `src/`, `templates/`, `config/`, `public/`, `tests/` existent
- [ ] Vérifier `.env.example` présent (`.env` ne doit JAMAIS être commité)
- [ ] `composer.json` et `composer.lock` cohérents
- [ ] `.gitignore` inclut : `.env`, `var/`, `vendor/`, `public/assets/` (générés)
- [ ] `CLAUDE.md` projet à jour

### 2. Dépendances
```bash
composer validate
composer audit  # Vérification des vulnérabilités
```
- [ ] Pas de warnings `composer validate`
- [ ] Pas de vulnérabilités connues
- [ ] Versions PHP et Symfony compatibles

### 3. Qualité du code
```bash
vendor/bin/phpstan analyse src/ --level=max
vendor/bin/php-cs-fixer fix --dry-run --diff
```
- [ ] PHPStan niveau max : 0 erreur
- [ ] PHP-CS-Fixer : 0 modification nécessaire
- [ ] Pas de `var_dump`, `dd()`, `dump()` oubliés en production

### 4. Tests
```bash
php bin/phpunit --coverage-text
```
- [ ] Tous les tests passent (0 failure, 0 error)
- [ ] Coverage global ≥ 80%
- [ ] Tests unitaires, d'intégration ET fonctionnels présents
- [ ] Pas de tests ignorés (`@skip`) sans justification

### 5. Sécurité
```bash
symfony security:check
```
- [ ] Aucune vulnérabilité dans les dépendances
- [ ] CSRF : tous les formulaires POST ont un token CSRF
- [ ] Voters en place pour les autorisations granulaires
- [ ] Pas de requêtes SQL brutes (`$conn->query(...)`)
- [ ] Secrets dans `.env.local` uniquement (jamais dans le code)
- [ ] Headers sécurité présents (CSP, X-Frame-Options, etc.)

### 6. Accessibilité
```bash
# Lancer axe-core ou WAVE sur les pages principales
```
- [ ] Panel accessibilité présent et fonctionnel
- [ ] Skip link `#main-content` présent dans base.html.twig
- [ ] Attributs ARIA sur tous les éléments interactifs
- [ ] Contraste 7:1 vérifié sur les textes principaux
- [ ] Navigation clavier testée manuellement

### 7. Performance
```bash
php bin/console debug:router | wc -l    # Nombre de routes
php bin/console debug:container | wc -l # Nombre de services
```
- [ ] Profiler Symfony : pas de requêtes N+1
- [ ] Assets compilés (Webpack Encore ou AssetMapper)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Cache chaud en production (`php bin/console cache:warmup --env=prod`)

### 8. Internationalisation
- [ ] Toutes les chaînes utilisent `{% trans %}` ou `|trans`
- [ ] Fichiers `translations/messages.fr.yaml` ET `translations/messages.en.yaml` existent
- [ ] Bouton de bascule langue présent dans le layout
- [ ] Pas de texte en dur dans les templates Twig

### 9. RGPD / CNIL
- [ ] Pages réglementaires présentes (Mentions Légales, CGU, Politique confidentialité, Cookies)
- [ ] Mécanisme d'anonymisation CNIL implémenté (désinscription)
- [ ] Logs de conservation des données documentés
- [ ] Bannière cookies conforme CNIL

### 10. Git
```bash
git status
git log --oneline -20
```
- [ ] Pas de fichiers sensibles non commités ou non ignorés
- [ ] Pas de clés API, mots de passe dans l'historique git
- [ ] Messages de commit clairs et conventionnels

---

## Format du rapport final

```
## 🏥 RAPPORT DOCTOR — [DATE]

### ✅ Points OK ([N] éléments)
- ...

### ⚠️ Avertissements ([N] éléments)
- ...

### ❌ Erreurs critiques ([N] éléments)
- ...

### 💊 Plan de guérison immédiat
1. [Action prioritaire 1]
2. [Action prioritaire 2]
...
```

---

## Post-audit

Si des erreurs sont découvertes, les documenter dans `docs/error-log.md` au format standard.
