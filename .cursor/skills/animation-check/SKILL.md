---
name: animation-check
description: Validates CSS animations and transitions — checks webkit prefixes, captures animation frames across browsers, verifies visual correctness. Use when checking animations, transitions, keyframes, or when user asks to verify анимации работают.
---

# Animation Check — проверка анимаций

Двухэтапная проверка: статический анализ CSS + динамическая запись в браузерах.

## Шаги

### 1. Статический анализ CSS (shell субагент, fast)

Используй Task tool с `subagent_type: "shell"`, `model: "fast"`:

```
Проверь CSS файлы сайта sites/<SITE_NAME>/css/ на следующее:
1. Каждый @keyframes должен иметь пару @-webkit-keyframes
2. animation: должен иметь -webkit-animation:
3. transform: должен иметь -webkit-transform:
4. transition: должен иметь -webkit-transition:

Команды для поиска:
- rg "animation:" sites/<SITE_NAME>/css/ --include="*.css"
- rg "@keyframes" sites/<SITE_NAME>/css/ --include="*.css"
- rg "transform:" sites/<SITE_NAME>/css/ --include="*.css"
- rg "transition:" sites/<SITE_NAME>/css/ --include="*.css"

Сравни каждое найденное свойство с его webkit-версией.
Верни список пропущенных webkit-префиксов.
```

Также проверь `index.html` если инлайн-стили есть.

### 2. Запись фреймов анимации (shell субагент, fast)

Используй Task tool с `subagent_type: "shell"`, `model: "fast"`:

```
Запусти запись анимационных фреймов:
python ".cursor/skills/animation-check/scripts/capture_frames.py" "<URL>" "sites/<SITE_NAME>/maket/anim-frames"
Рабочая директория: c:\dev\nefedov.tech
Дождись завершения (~30 сек).
Верни список файлов и ошибки.
```

### 3. Визуальная проверка анимаций (browser-use субагент)

Используй Task tool с `subagent_type: "browser-use"`:

```
Открой <URL> в браузере и проверь анимации:
1. Загрузи страницу и наблюдай hero-секцию — есть ли анимации появления?
2. Прокрути вниз — есть ли scroll-анимации?
3. Проверь hover-эффекты на кнопках и ссылках
4. Проверь нет ли "дёрганий" или глюков при анимации
5. Попробуй мобильный viewport 390px — анимации не сломаны?
Отчитайся: какие анимации работают, какие нет, что выглядит некорректно.
```

### 4. Анализ фреймов

Просмотри файлы `sites/<SITE_NAME>/maket/anim-frames/` — 7 фреймов × 2 браузера.
Если фреймы одинаковые (нет изменений) — анимация не работает.
Если фреймы меняются между собой — анимация работает.

### 5. Отчёт

```
## Animation Check Report

### CSS Prefixes
- ✅ @keyframes fadeIn — есть @-webkit-keyframes
- ❌ animation: slideUp — нет -webkit-animation

### Visual Check
- ✅ Hero entrance animation — работает в Chromium, WebKit
- ❌ Scroll reveal — не работает в WebKit (нет webkit-transform)

### 📋 Исправления
- Добавить -webkit-animation в .hero
- Добавить @-webkit-keyframes для slideUp
```
