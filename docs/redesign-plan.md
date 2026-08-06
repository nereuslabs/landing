# План редизайна landing (draft)

> Статус: **Запланирован / not started**. Сам редизайн НЕ реализован — данный документ
> фиксирует требования из [Issue #1](https://github.com/nereuslabs/landing/issues/1),
> чтобы коллега‑редизайнер мог сразу приступить. Ветка: `feature/redesign-promo-landing`.

## 1. Инвентарь текущего состояния

| Файл | Строки | Статус | Примечание |
|------|------:|--------|-----------|
| `index.html` | 508 | ⚠️ контент застирательно‑технический | badge `v0.4.2`, вымышленные статусы `ROADMAP_GEN/MATERIAL_STREAM/EVALUATION_ROUTER`, footer Apache 2.0 |
| `css/style.css` | 1340 | ⚠️ монотемный «Obsidian & Spectral» | нет тем/вариативов |
| `js/main.js` | 409 | ⚠️ dead‑code | `data-action="sim"` в `⌘K` без обработчика |
| `README.md` | 1 | ❌ «Coming soon...» | без структуры проекта |
| `.gitignore` | 27 | ⚠️ python‑мусор | не для статики |
| `assets/favicon.svg` | 6 | ✅ | водная мотивика Nereus |

## 2. Контентные расхождения с реальным кодом Nereus (`nereuslabs/Nereus`)

| Landing | Реальный код (источник) | Правка |
|---|---|---|
| `v0.4.2` | `pyproject.toml` → `version = "0.1.0"` | → `v0.1.0` |
| `ROADMAP_GEN / MATERIAL_STREAM / EVALUATION_ROUTER` | `core/state.py` → `LearningStatus{coaching, learning, examining, completed}` | → use real states |
| Step 5 «В работе» | README Nereus → Step 5 **отложен** | → ⏸️ отложен |
| Чекпоинты Step 6 «В планах» | issue #16 — реализован (`persistence.py`, `--resume`) | → ✅ готово |
| (нет упоминания) | issue #22 — session dump/load в `feature/issue-22-session-runtime` | → ✅ в работе / почти готово |
| footer Apache 2.0 | репо landing = Apache 2.0 ✅ | **оставить** Apache 2.0 (НЕ MIT) |
| (нет упоминания) | код Nereus = **MIT** | кросс‑репо: вопрос к team, НЕ править в PR |

## 3. Карта секций сайта (single‑page)

1. **Header** — логотип `Nereus`, навигация, sticky при скролле.
2. **Hero** — хедлайн + субхед + primary/secondary CTA + tech‑бейджики + live canvas (3‑узловый граф).
3. **Problem** — «почему существующие AI‑тюторы не работают» (галлюцинации, offline, «видео‑вместо‑диалога»).
4. **How it works** — explain‑карта автомата + стрелки `PASS/RETRY` роутинга.
5. **Features** — Knowledge mesh: RAG, локальность, чекпоинты, human‑in‑the‑loop.
6. **Live graph demo** — выделенная canvas‑секция с анимацией потока данных.
7. **Tech stack** — с **логотипами** (см. §4).
8. **Roadmap** — timeline с честными статусами.
9. **Testimonials** — выше формы раннего доступа.
10. **FAQ** — 4 вопроса.
11. **CTA early access** — email‑форма + toast.
12. **Footer** — `Nereus Labs · Apache 2.0 · © 2026` + ссылка на GitHub.

## 4. Tech stack — логотипы и атрибуция

Официальные бренд‑ресурсы (только SVG‑логотипы, без модификаций цвета/формы):

| Технология | Источник логотипа | Примечание |
|---|---|---|
| Docker | https://www.docker.com/pride/logos | логотип корабля |
| Langchain | https://python.langchain.com/docs/resources/community | «LangChain» |
| LangGraph | https://www.langchain.com/langgraph | отдельный логотип |
| Ollama | https://ollama.com/blog/ollama-is-now-available-on-mac | логотип |
| ChromaDB | https://github.com/chroma-core/chroma (assets) | |
| Python | https://www.python.org/downloads/mediastore | «Python» snake |
| SQLite | https://www.sqlite.org/ | |
| Redis | https://redis.io/docs/latest/develop/use/oss-community/ | |
| Chainlit | https://github.com/chainyo/chainlit | |
| Pydantic | https://github.com/pydantic/pydantic | |

> Хранить в `assets/logos/` как `*_logo.svg`. Атрибуцию перечислить в `README.md`.

## 5. Требования к конверсии (UX)

- Хедлайн с конкретикой: «~50 часов вместо 3‑недельных видеокурсов».
- Primary CTA в Hero + **sticky CTA** в шапке.
- Trust signals: open‑source, 100% локальность, ссылка на GitHub.
- Urgency: «ограниченное количество мест» + валидация email.
- Testimonials выше формы.

## 6. Технические требования

- vanilla HTML/CSS/JS (ни одного фреймворка).
- `defer`‑скрипты, `loading="lazy"` на медиа/логотипы.
- `data-action="sim"` → реализовать как **reset canvas** (или удалить).
- `.gitignore` — только `.DS_Store`, `Thumbs.db`, IDE‑кушь.
- `README.md` — структура проекта + `python -m http.server`.

## 7. Acceptance criteria

- [ ] Hero без мерцаний, canvas ≥ 30fps.
- [ ] Без JS контент читается.
- [ ] Версия == `0.1.0`.
- [ ] Статусы состояний == `LearningStatus` из кода.
- [ ] Timeline честный (Steps 1–4 ✅, #16 ✅, #22 ⏳, Step 5 ⏸️).
- [ ] Footer: Apache 2.0 + ссылка на `nereuslabs/Nereus`.
- [ ] Tech stack с логотипами + атрибуция в README.
- [ ] Conversion‑требования выполнены.
- [ ] `.gitignore` и `README.md` landing актуальны.
