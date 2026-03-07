---
name: deploy-nefedov-tech
description: Deploy nefedov.tech frontend to reg.ru hosting via SFTP. Use when user asks to deploy, publish, upload, or push the site to production, or to update nefedov.tech.
---

# Deploy nefedov.tech

## Quick deploy

```bash
cd c:\dev\nefedov.tech
python .cursor/skills/deploy-nefedov-tech/deploy.py
```

That's it. Script uploads all files and prints status. Takes ~5 seconds.

## What gets deployed

| Local | Remote |
|---|---|
| `index.html` | `REMOTE_DIR/index.html` |
| `photo.png` | `.../photo.png` |
| `resume.pdf` | `.../resume.pdf` |
| `css/style.css` | `.../css/style.css` |
| `js/main.js` | `.../js/main.js` |

## Credentials

Stored in `.cursor/skills/deploy-nefedov-tech/deploy.env` (copy from `deploy.env.example`):

```
HOST=your-server-ip
PORT=22
USER=your-username
PASS=your-password
REMOTE_DIR=/var/www/your-user/data/www/nefedov.tech
```

> For a new project: copy `deploy.env.example` to `deploy.env` and fill in your credentials.

Hosting: **reg.ru** virtual hosting (ispmanager panel).  
Live URL: https://nefedov.tech/

## Verify after deploy

```python
python -c "
import urllib.request
req = urllib.request.Request('https://nefedov.tech/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as r:
    html = r.read().decode('utf-8', errors='replace')
    print('OK' if 'FULLSTACK TEAM LEAD' in html else 'WARN: check site')
"
```

## Requirements

- Python 3.x + `paramiko` (`pip install paramiko`)
- `.cursor/skills/deploy-nefedov-tech/deploy.env` present (filled with your credentials)

## Troubleshooting

| Problem | Fix |
|---|---|
| `ModuleNotFoundError: paramiko` | `pip install paramiko` |
| `Authentication failed` | Check `deploy.env` PASS value |
| `Connection timed out` | Check IP in `deploy.env`; reg.ru may change IPs |
| Site shows old version | Hard refresh (`Ctrl+Shift+R`); CDN cache, wait 1-2 min |

## Known quirks

- **Font**: Site uses `Inter` + `Space Mono` from Google Fonts.
- **Hero name mobile word-break**: `splitHeroName()` in `main.js` wraps each word in `display:inline-block;white-space:nowrap`. This ensures line breaks happen between ALEKSANDR and NEFEDOV, not mid-word. Do not change span structure without verifying mobile word-break.
- **Stats on mobile**: Use CSS Grid `grid-template-columns: 1fr 1fr` (2×2). Desktop uses flexbox. Both are set in `style.css` at `max-width: 768px`.

## Cross-browser compatibility (verified Chromium + Firefox + WebKit/Safari)

Fixed issues that were breaking real iOS Safari:
1. **SVG size** — All SVGs now have explicit `width`/`height` attributes. Without them, Safari renders SVGs at 300×150px default.
2. **`inset: 0`** — Not supported in Safari < 14.1. Replaced with explicit `top/right/bottom/left: 0` on `.mobile-menu`.
3. **`color-mix()`** — Not supported in Safari < 16.2. Replaced with `rgba()` fallback + `@supports` wrapper.
4. **iOS scroll lock** — `overflow: hidden` on body doesn't prevent scroll on iOS Safari. Fixed via `position: fixed; top: -scrollY; width: 100%` on body (JS + CSS), with scroll position restored on menu close.
5. **`-webkit-` prefixes** — Added `-webkit-transform`, `-webkit-animation`, `-webkit-keyframes` to all animation rules.
6. **Mobile menu height** — Added `height: 100dvh` with `100vh` fallback for dynamic viewport support.

### Cross-browser test (Playwright):
```bash
pip install playwright
python -m playwright install chromium firefox webkit
# Then run a quick check:
python -c "
from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
  for eng in ['chromium', 'webkit', 'firefox']:
    br = getattr(p, eng).launch()
    pg = br.new_page(viewport={'width':390,'height':844})
    pg.goto('https://nefedov.tech/', wait_until='networkidle', timeout=60000)
    time.sleep(1)
    pg.screenshot(path=eng+'_check.png')
    br.close()
    print(eng + ' OK')
"
```
