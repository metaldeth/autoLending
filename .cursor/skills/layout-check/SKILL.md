---
name: layout-check
description: Cross-browser layout verification across viewports using Playwright screenshots and visual comparison with mockups. Use when checking layout, verifying верстка matches макет, browser compatibility check, or testing across screen sizes. Запускает субагентов на fast-модели.
---

# Layout Check — проверка вёрстки

Проверяет вёрстку во всех браузерах (Chromium, Firefox, WebKit/Safari) и трёх разрешениях (mobile 390px, tablet 768px, desktop 1440px).

## Когда использовать

- После реализации вёрстки
- После исправлений по ревью
- При команде "проверь вёрстку" / "проверка вёрстки"

## Шаги

### 1. Получи URL и путь к сайту

Определи:
- `SITE_NAME` — имя папки в `sites/` (например `shaker-dev.ru`)
- `URL` — из `sites/<SITE_NAME>/deploy.env` (поле `SITE_URL`) или локальный сервер

### 2. Запусти скриншоты (shell субагент, fast)

Используй Task tool с `subagent_type: "shell"`, `model: "fast"`:

```
Запусти playwright скриншоты сайта <URL> во всех браузерах и разрешениях.
Скрипт: c:\dev\nefedov.tech\.cursor\skills\layout-check\scripts\screenshot.py
Команда: python ".cursor/skills/layout-check/scripts/screenshot.py" "<URL>" "sites/<SITE_NAME>/maket/screenshots"
Рабочая директория: c:\dev\nefedov.tech
Дождись завершения (может занять 60-120 сек).
Верни список созданных файлов и любые ошибки.
```

Требования: `pip install playwright && python -m playwright install chromium firefox webkit`

### 3. Визуальная проверка (browser-use субагент)

Используй Task tool с `subagent_type: "browser-use"`:

```
Открой сайт <URL> и проверь:
1. Mobile (390px): отображение, переносы текста, размеры кнопок, отступы
2. Desktop (1440px): расположение блоков, сетка, пропорции
3. Проверь что нет горизонтального скролла
4. Проверь что шрифты читаемы
5. Сравни с макетом если есть доступ к screenshots
Отчитайся списком найденных проблем с описанием и браузером/разрешением.
```

### 4. Анализ скриншотов

Просмотри файлы `sites/<SITE_NAME>/maket/screenshots/` (9 файлов: 3 браузера × 3 разрешения).
Сравни с макетом из `sites/<SITE_NAME>/maket/`.
Зафиксируй расхождения.

### 5. Отчёт

Итоговый отчёт:
```
## Layout Check Report

### ✅ Без проблем
- ...

### ❌ Найдены проблемы
| Браузер | Разрешение | Проблема |
|---------|-----------|---------|
| WebKit  | mobile    | Кнопка выходит за контейнер |

### 📋 Рекомендации
- ...
```

## Troubleshooting

| Проблема | Решение |
|---------|---------|
| `playwright not found` | `pip install playwright && python -m playwright install` |
| Скриншоты пустые / blank | Увеличь `time.sleep()` в скрипте до 3 |
| WebKit падает | Запусти только chromium для начала |
