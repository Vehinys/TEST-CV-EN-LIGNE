# Règle : Twig 3.x — Conventions et Accessibilité

> Source officielle : https://twig.symfony.com/doc/3.x/

---

## Structure des templates

```
templates/
├── base.html.twig              ← Layout principal (skip link, panel a11y, lang toggle)
├── _partials/                  ← Fragments réutilisables (< composants)
│   ├── _flash.html.twig        ← Messages flash accessibles
│   ├── _pagination.html.twig   ← Pagination avec ARIA
│   └── _breadcrumb.html.twig   ← Fil d'Ariane avec Schema.org
├── components/                 ← Twig UX Components (stateful)
├── emails/                     ← Templates mail (html + txt)
│   ├── base.html.twig
│   └── welcome.html.twig / welcome.txt.twig
├── security/
│   ├── login.html.twig
│   └── register.html.twig
└── [feature]/                  ← Templates par feature
    ├── index.html.twig
    ├── show.html.twig
    └── _form.html.twig
```

---

## base.html.twig — Structure obligatoire

```twig
<!DOCTYPE html>
<html lang="{{ app.request.locale }}" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}App{% endblock %} — {{ 'app.name'|trans }}</title>
    <meta name="description" content="{% block meta_description %}{% endblock %}">
    {% block stylesheets %}{% endblock %}
</head>
<body>
    {# Skip link — RGAA obligatoire #}
    <a href="#main-content" class="skip-link">{{ 'a11y.skip_to_main'|trans }}</a>

    {# Panel accessibilité #}
    {% include '_partials/_accessibility_panel.html.twig' %}

    {# Bouton langue #}
    {% include '_partials/_lang_switcher.html.twig' %}

    <header role="banner">{% block header %}{% endblock %}</header>
    <nav aria-label="{{ 'nav.main'|trans }}">{% block nav %}{% endblock %}</nav>

    <main id="main-content" role="main" tabindex="-1">
        {% block main %}{% endblock %}
    </main>

    <footer role="contentinfo">{% block footer %}{% endblock %}</footer>

    {% block javascripts %}{% endblock %}
</body>
</html>
```

---

## Bonnes pratiques Twig

### Sécurité
```twig
{# Autoescape actif par défaut — NE PAS désactiver #}
{{ variable }}          {# Échappé automatiquement ✅ #}
{{ variable|raw }}      {# DANGEREUX — audit obligatoire, seulement HTML validé #}
{{ variable|escape }}   {# Explicite si nécessaire #}
```

### Internationalisation
```twig
{# Toutes les chaînes passent par trans — JAMAIS de texte en dur #}
{{ 'button.submit'|trans }}
{% trans %}button.submit{% endtrans %}
{{ 'pagination.page_of'|trans({'%current%': page, '%total%': total}) }}
```

### Blocs et héritage
```twig
{# Page enfant #}
{% extends 'base.html.twig' %}

{% block title %}{{ 'user.list.title'|trans }}{% endblock %}

{% block meta_description %}{{ 'user.list.description'|trans }}{% endblock %}

{% block main %}
    <h1>{{ 'user.list.title'|trans }}</h1>
    {# ... #}
{% endblock %}
```

### Logique — INTERDIT dans les templates
```twig
{# INTERDIT — logique métier dans Twig #}
{% if user.age > 18 and user.hasVerifiedEmail and user.subscriptionPlan == 'premium' %}

{# CORRECT — logique déléguée au service, Twig reçoit un booléen simple #}
{% if isPremiumUser %}
```

---

## Composants accessibles

### Bouton avec état
```twig
<button
    type="button"
    aria-expanded="{{ isOpen ? 'true' : 'false' }}"
    aria-controls="menu-{{ id }}"
    class="btn-menu"
>
    {{ 'nav.toggle'|trans }}
    <span class="sr-only">{{ isOpen ? 'nav.close'|trans : 'nav.open'|trans }}</span>
</button>
```

### Message flash accessible
```twig
{% for type, messages in app.flashes %}
    {% for message in messages %}
        <div
            role="alert"
            aria-live="assertive"
            class="alert alert--{{ type }}"
        >
            {{ message|trans }}
        </div>
    {% endfor %}
{% endfor %}
```

### Formulaire accessible
```twig
{{ form_start(form, {attr: {novalidate: 'novalidate', 'aria-label': 'form.user.label'|trans}}) }}
    <div class="form-field">
        {{ form_label(form.email) }}
        {{ form_widget(form.email, {attr: {'aria-describedby': 'email-help email-error'}}) }}
        <p id="email-help" class="form-help">{{ 'form.email.help'|trans }}</p>
        {{ form_errors(form.email) }}
    </div>
{{ form_end(form) }}
```

---

## Macros pour composants réutilisables

```twig
{# _macros.html.twig #}
{% macro badge(label, type='default', ariaLabel='') %}
    <span
        class="badge badge--{{ type }}"
        {% if ariaLabel %}aria-label="{{ ariaLabel }}"{% endif %}
    >
        {{ label }}
    </span>
{% endmacro %}
```

---

## Références

- Twig 3.x : https://twig.symfony.com/doc/3.x/
- Twig UX : https://symfony.com/bundles/ux-twig-component/current/index.html
- ARIA APG Forms : https://www.w3.org/WAI/ARIA/apg/patterns/
