---
name: deploy-reg-ru
description: Deploy any site from this repo to reg.ru hosting via SFTP. Use when user asks to deploy, publish, upload, or push a site to production.
---

# Deploy на reg.ru (общий скрипт)

Один скрипт для всех сайтов. У каждого сайта свой `deploy.env` в папке сайта. Скрипт подтягивает нужный env по имени сайта.

## Быстрый деплой

```bash
cd /path/to/repo
python .cursor/skills/deploy-reg-ru/deploy.py nefedov.tech
```

Аргумент — имя папки сайта в `sites/`. Скрипт читает `sites/<имя>/deploy.env` и заливает файлы. ~5 сек.

## deploy.env в папке сайта

Файл `sites/<сайт>/deploy.env` — креды SFTP и адрес. Шаблон: `.cursor/skills/deploy-reg-ru/deploy.env.example`.

| Переменная | Описание |
|------------|----------|
| `HOST` | IP или хост SFTP (reg.ru) |
| `PORT` | 22 |
| `USER` | Логин панели reg.ru |
| `PASS` | Пароль |
| `REMOTE_DIR` | Путь на сервере (например `/var/www/uXXXX/data/www/domain.com`) |
| `SITE_URL` | URL сайта (например `https://domain.com`) |

Пример `sites/nefedov.tech/deploy.env`:

```
HOST=31.31.196.75
PORT=22
USER=u3440068
PASS=***
REMOTE_DIR=/var/www/u3440068/data/www/nefedov.tech
SITE_URL=https://nefedov.tech
```

Новый сайт: создать `sites/<новый>/deploy.env` (скопировать из `deploy.env.example`), заполнить креды и пути.

## Что заливается

Из папки сайта: `index.html`, favicon/manifest/og-image, `css/`, `js/`. Список в `deploy.py` (`DEPLOY_FILES`, `DEPLOY_DIRS`). Другой набор — правь скрипт или делаем отдельное решение под сайт.

## Проверка после деплоя

Открой в браузере `SITE_URL` из `deploy.env` нужного сайта.

## Требования

- Python 3.x и `paramiko` (`pip install paramiko`)
- `sites/<сайт>/deploy.env` — не коммитить (в `.gitignore`: `sites/*/deploy.env`)

## Проблемы

| Проблема | Решение |
|----------|---------|
| `ModuleNotFoundError: paramiko` | `pip install paramiko` |
| `Authentication failed` | Проверить USER/PASS в `deploy.env` сайта |
| `Connection timed out` | Проверить HOST; у reg.ru могут меняться IP |
| `deploy.env not found` | Проверить имя сайта и наличие `sites/<имя>/deploy.env` |
| Старая версия на сайте | Жёсткое обновление (Ctrl+Shift+R), подождать 1–2 мин кэш |

## Уникальный деплой под сайт

Если нужны особые файлы или шаги — делаем отдельно (свой скрипт в папке сайта или ветка в общем скрипте).
