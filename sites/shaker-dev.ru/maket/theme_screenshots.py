"""
Screenshots for theme switching check: dark and light on desktop + mobile.
Usage: python theme_screenshots.py <url> [output_dir]
"""
import sys
import os
import time
from playwright.sync_api import sync_playwright

VIEWPORTS = [
    {"name": "desktop", "width": 1440, "height": 900},
    {"name": "mobile", "width": 390, "height": 844},
]


def run(url: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for vp in VIEWPORTS:
            page = browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            page.goto(url, wait_until="networkidle", timeout=60000)
            time.sleep(1.5)
            # Dark theme (default)
            page.screenshot(path=os.path.join(out_dir, f"{vp['name']}_dark.png"), full_page=True)
            print(f"  {vp['name']} dark -> {vp['name']}_dark.png")
            # Toggle to light
            toggle = page.locator("#themeToggle")
            if toggle.count():
                toggle.click()
                time.sleep(0.6)
                page.screenshot(path=os.path.join(out_dir, f"{vp['name']}_light.png"), full_page=True)
                print(f"  {vp['name']} light -> {vp['name']}_light.png")
            else:
                print(f"  {vp['name']}: theme toggle not found")
            page.close()
        browser.close()
    print("Done.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python theme_screenshots.py <url> [output_dir]")
        sys.exit(1)
    url = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "theme-screenshots"
    print(f"Theme screenshots: {url} -> {out_dir}")
    run(url, out_dir)
