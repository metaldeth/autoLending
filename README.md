# Репозиторий лендингов

Один репозиторий для нескольких статических лендингов: общие правила в `.cursor/`, каждый сайт — в своей папке в `sites/`.

## Структура

- **`.cursor/`** — правила Cursor, скрипты деплоя, навыки. Можно копировать в другой репозиторий.
- **`sites/<сайт>/`** — один лендинг: папка `maket/` (макеты) и файлы реализации в корне папки (`index.html`, `css/`, `js/`, ассеты).

Подробнее: [.cursor/rules/workspace.mdc](.cursor/rules/workspace.mdc)

## Деплой

Из корня репозитория:

```bash
python .cursor/skills/deploy-reg-ru/deploy.py <имя-сайта>
```

Пример: `python .cursor/skills/deploy-reg-ru/deploy.py nefedov.tech`

У каждого сайта свой `sites/<сайт>/deploy.env` (креды SFTP и SITE_URL). См. [DEPLOY.md](DEPLOY.md) и [.cursor/skills/deploy-reg-ru/SKILL.md](.cursor/skills/deploy-reg-ru/SKILL.md).
