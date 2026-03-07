# Handoff: shaker-dev.ru

Макет согласован и зафиксирован в `shaker-dev.ru.pen`.  
Файл содержит 4 фрейма: **Dark Desktop** · **Light Desktop** · **Dark Mobile** · **Light Mobile**.

---

## Две темы: как переключать

| | Тёмная (default) | Светлая |
|---|---|---|
| Фон страницы | `#0B0F1A` | `#F4F6FA` |
| Поверхность карточек | `#131929` | `#FFFFFF` |
| Разделители / бордеры | `#1E2D45` | `#E2E8F0` |
| Акцент | `#00D4FF` | `#0055FF` |
| Текст основной | `#FFFFFF` | `#0B0F1A` |
| Текст вторичный | `#8B9CB5` | `#4A5568` |

**Механизм:** атрибут `data-theme="dark"` / `"light"` на теге `<html>`.  
CSS-переменные переопределяются в `:root[data-theme="light"]`.  
Выбор сохраняется в `localStorage('theme')`.

**Переключатель:** toggle в хедере (desktop и mobile). Анимация: `transition: background 0.25s`.  
При инициализации читаем `localStorage`, иначе — `prefers-color-scheme`.

---

## Шрифты

- **Inter** — все тексты (body, заголовки секций)
- **Space Mono** — лого, метки секций (ALL CAPS + letter-spacing), числовые метрики, лейблы форм

Google Fonts embed: `Inter:wght@400;600;700` + `Space+Mono:wght@400;700`

---

## Структура секций (порядок)

1. `Header` — logo + nav + theme-toggle + CTA
2. `Hero` — badge + H1 + sub + 2 CTA + world-map visual
3. `Trust` — 3 карточки с метриками (20 · $0 · 10Y)
4. `Process` — 4 горизонтальных шага (01–04)
5. `Competencies` — 3 колонки: Hardware / Software / Design & Mfg
6. `Advantages` — левый текстовый блок + 3 вертикальных пункта
7. `Portfolio` — 3 кейса-карточки + CTA "Смотреть все"
8. `Production` — текстовый блок + 3 стат-метрики
9. `Contacts` — левый текст + форма (Имя / Телефон / Описание + Submit)
10. `Footer` — logo + nav + копирайт

---

## Форма заявок

Поля: **Имя**, **Телефон / Telegram**, **Описание идеи**.  
CTA: «Отправить заявку».

Рекомендованный endpoint: **Google Apps Script** (POST → Google Sheets).  
Telegram-уведомление — опционально, вторым шагом из того же Apps Script.  
Причина: статичный хостинг reg.ru без гарантированного PHP; токен бота не хранить в клиентском JS.

Состояния формы (UX, без реализации на этапе макета):
- `default` — пустые плейсхолдеры
- `focus` — поле с синим/cyan бордером (показано в макете)
- `loading` — кнопка заблокирована, текст «Отправляем…»
- `success` — зелёный текст «Заявка принята, свяжемся с вами»
- `error` — красный текст «Ошибка, попробуйте ещё раз»

---

## Анимации (намерение, не реализовано)

- Все секции: появление `opacity 0 → 1 + translateY(20px → 0)` при входе в viewport (`IntersectionObserver`)
- Кнопки: `hover: opacity 0.85 + scale(0.98)`, transition `0.15s`
- Hero-визуал: лёгкое `parallax` при скролле (`transform: translateY(scrollY * 0.15)`)
- Переключатель темы: `transition: background 0.25s`
- Обязательно: `@media (prefers-reduced-motion)` — убираем все трансформации
- Обязательно: `-webkit-` префиксы на все keyframe-анимации

---

## Мобильная адаптация (breakpoint 768px)

- Header → burger-меню (полноэкранное, `height: 100dvh`)  
- Hero → вертикальный стек, world-map убирается или уходит под fold
- Trust → вертикальный стек карточек (или grid 1×3)
- Process → вертикальный список шагов
- Competencies → вертикальный стек блоков
- Advantages → вертикальный стек
- Portfolio → вертикальный список
- Form → full-width поля, одна колонка

---

## Safari / iOS (обязательные фиксы)

| Проблема | Решение |
|---|---|
| `inset: 0` | Заменить на `top:0; right:0; bottom:0; left:0` |
| `color-mix()` | Добавить fallback `rgba()` |
| Scroll lock на iOS | `position: fixed; top: -${scrollY}px; width: 100%` |
| Высота мобильного меню | `height: 100vh; height: 100dvh` |
| Анимации | `-webkit-` префиксы на все `@keyframes` и `transform` |
| SVG без размеров | Явные `width` и `height` на всех `<img src="*.svg">` |

---

## Деплой

```bash
python .cursor/skills/deploy-reg-ru/deploy.py shaker-dev.ru
```

Креды SFTP: `sites/shaker-dev.ru/deploy.env` (не коммитить).
