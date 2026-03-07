---
name: code-review
description: Reviews HTML/CSS/JS code for quality, browser compatibility, and project standards. Checks cross-browser pitfalls (Safari/iOS), CSS conventions, animation prefixes, accessibility basics. Use when user asks for code review, ревью кода, or quality check before deploy.
---

# Code Review

Ревью кода сайта на соответствие проектным правилам и best practices.

## Запуск

Используй Task tool с `subagent_type: "explore"`, `model: "fast"`:

```
Выполни ревью кода сайта sites/<SITE_NAME>/.
Прочитай: index.html, все файлы в css/, все файлы в js/
Проверь по следующим критериям и верни структурированный отчёт.
```

## Чеклист для субагента

### HTML
- [ ] Все `<img src="*.svg">` имеют `width` и `height` атрибуты (Safari SVG fix)
- [ ] Нет `inset: 0` — использовать `top/right/bottom/left: 0` (Safari < 14.1)
- [ ] Meta viewport присутствует
- [ ] Semantic теги (`<header>`, `<main>`, `<section>`, `<footer>`)
- [ ] Alt-тексты у изображений
- [ ] Favicon и og:image заданы

### CSS
- [ ] Mobile-first breakpoint на `max-width: 768px`
- [ ] `color-mix()` имеет rgba() fallback (Safari < 16.2)
- [ ] iOS scroll lock не через `overflow: hidden` на body
- [ ] Mobile menu height: оба `100vh` и `100dvh`
- [ ] Все `@keyframes` имеют `-webkit-` пару
- [ ] Все `animation:` имеют `-webkit-animation:`
- [ ] Все `transform:` имеют `-webkit-transform:`
- [ ] Нет неиспользуемых правил (явные дубли)

### JS
- [ ] `splitHeroName()` — span-обёртка для word-break
- [ ] iOS scroll lock: `position: fixed; top: -${scrollY}px`
- [ ] Нет `console.log` оставленных в production-коде
- [ ] Event listeners очищаются если нужно

### Общее
- [ ] Нет закомментированного мёртвого кода
- [ ] Пути к ресурсам корректны (нет абсолютных `/home/...`)
- [ ] Google Fonts подключены: `Inter` + `Space Mono`

## Формат отчёта

```
## Code Review: <SITE_NAME>

### 🔴 Критические (сломает в Safari/iOS)
- [файл:строка] описание проблемы

### 🟡 Улучшения (best practice)
- [файл:строка] описание

### 🟢 Всё OK
- Список того, что проверено и в порядке

### Итог
X критических, Y улучшений. [Готов к деплою / Требуются исправления]
```
