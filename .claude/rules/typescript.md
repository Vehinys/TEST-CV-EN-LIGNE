# Règle : TypeScript strict — Portfolio Astro

## tsconfig.json obligatoire
```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Patterns
- Jamais `any` — utiliser `unknown` + type guard si nécessaire
- Interfaces pour les Props Astro, types pour les unions
- Zod pour la validation des données Content Collections
- Variables d'env : `import.meta.env.PUBLIC_*` (préfixe PUBLIC obligatoire côté client)

## Références
- https://www.typescriptlang.org/tsconfig
- https://docs.astro.build/en/guides/typescript/
