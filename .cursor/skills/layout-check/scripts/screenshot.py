"""
Cross-browser layout screenshots for layout verification.
Usage: python screenshot.py <url> [output_dir]
Output: 9 files — 3 browsers × 3 viewports, full-page PNGs
"""
import sys
import time
import os
from playwright.sync_api import sync_playwright

VIEWPORTS = [
    {"name": "mobile",   "width": 390,  "height": 844},
    {"name": "tablet",   "width": 768,  "height": 1024},
    {"name": "desktop",  "width": 1440, "height": 900},
]
BROWSERS = ["chromium", "webkit", "firefox"]


def run(url: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    with sync_playwright() as p:
        for eng in BROWSERS:
            for vp in VIEWPORTS:
                try:
                    br = getattr(p, eng).launch()
                    pg = br.new_page(viewport={"width": vp["width"], "height": vp["height"]})
                    pg.goto(url, wait_until="networkidle", timeout=60000)
                    time.sleep(2)
                    fname = os.path.join(out_dir, f"{eng}_{vp['name']}.png")
                    pg.screenshot(path=fname, full_page=True)
                    br.close()
                    print(f"OK  {eng:10} {vp['name']:8} -> {fname}")
                except Exception as e:
                    print(f"ERR {eng:10} {vp['name']:8}: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python screenshot.py <url> [output_dir]")
        sys.exit(1)
    url = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "screenshots"
    print(f"Capturing {url} -> {out_dir}")
    run(url, out_dir)
    print("Done.")
