"""Скриншоты референсных сайтов для shaker-dev.ru (desktop + mobile)"""
from playwright.sync_api import sync_playwright
import os

SITES = [
    ("https://www.creativo-code.com/", "creativo-code"),
    ("https://specifyapp.com/", "specifyapp"),
]

VIEWPORTS = [
    (1440, 900, ""),       # desktop → creativo-code.png
    (390, 844, "-mobile"), # iPhone → creativo-code-mobile.png
]

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for url, base in SITES:
            for w, h, suffix in VIEWPORTS:
                filename = f"{base}{suffix}.png"
                try:
                    page = browser.new_page(viewport={"width": w, "height": h})
                    page.goto(url, wait_until="domcontentloaded", timeout=20000)
                    page.wait_for_timeout(1500)
                    page.screenshot(path=os.path.join(OUT_DIR, filename), full_page=False)
                    page.close()
                    print(f"OK: {filename}")
                except Exception as e:
                    print(f"FAIL {filename}: {e}")
        browser.close()

if __name__ == "__main__":
    main()
