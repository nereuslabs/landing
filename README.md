<<<<<<< HEAD
# Nereus landing

Сайт‑лендинг для проекта [Nereus](https://github.com/nereuslabs/Nereus) —
мультиагентного AI‑тютора на базе LangGraph с локальным RAG и персистентной памятью.

Сайт развёрнут на **GitHub Pages** как чистый статический сайт (vanilla HTML/CSS/JS,
без фреймворков).

## Структура

```text
landing/
├── index.html          # единственная страница (single-page)
├── css/style.css       # единый стиль
├── js/main.js          # клиентская логика
├── assets/
│   ├── favicon.svg
│   └── logos/          # логотипы технологий (в development)
├── docs/
│   └── redesign-plan.md
└── README.md
```

## Локальный запуск

```bash
cd landing
python -m http.server 8080
# http://localhost:8080
```

## Редизайн

Полный редизайн сайта отлежен в
[Issue #1](https://github.com/nereuslabs/landing/issues/1) и ведётся в ветке
`feature/redesign-promo-landing` (draft PR). См. `docs/redesign-plan.md`.

## Лицензия

Apache 2.0. Сайт и его контент принадлежат организации **Nereus Labs**.
Исходный движок Nereus лицензирован отдельно — MIT (см. `nereuslabs/Nereus`).
=======
>>>>>>> dc4fa0c (feat: implement core site interactivity including header scroll/drag, menu toggle, email validation, FAQ accordion, and command palette.)
