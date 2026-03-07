# nefedov.tech

Personal portfolio site — [nefedov.tech](https://nefedov.tech)

## Stack

- Pure HTML + CSS + JS (no frameworks, no build step)
- Fonts: Inter + Space Mono (Google Fonts)
- Deploy: SFTP to reg.ru hosting

## Structure

```
sites/nefedov.tech/   — site files (index.html, css/, js/, etc.)
.cursor/skills/deploy-nefedov-tech/ — deploy script + config
```

## Deploy

```bash
# 1. Copy deploy.env.example to deploy.env and fill credentials
# 2. Run:
python .cursor/skills/deploy-nefedov-tech/deploy.py
```

See [DEPLOY.md](DEPLOY.md) and `.cursor/skills/deploy-nefedov-tech/SKILL.md` for details.
