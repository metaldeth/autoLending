"""
Скачивание кода референсных сайтов для изучения (HTML, CSS, JS).
Использует Playwright — захватывает загруженные ресурсы.
"""
from playwright.sync_api import sync_playwright
import os
import hashlib
from urllib.parse import urlparse

SITES = [
    ("https://www.creativo-code.com/", "creativo-code"),
    ("https://specifyapp.com/", "specifyapp"),
]

MAKET_DIR = os.path.dirname(os.path.abspath(__file__))


def download_site(browser, url: str, base_name: str) -> None:
    out_dir = os.path.join(MAKET_DIR, f"{base_name}-src")
    os.makedirs(out_dir, exist_ok=True)

    css_dir = os.path.join(out_dir, "css")
    js_dir = os.path.join(out_dir, "js")
    os.makedirs(css_dir, exist_ok=True)
    os.makedirs(js_dir, exist_ok=True)

    saved = set()
    css_count, js_count = 0, 0

    def save_response(response):
        nonlocal css_count, js_count
        try:
            rt = response.request.resource_type
            if rt not in ("stylesheet", "script"):
                return
            if response.status != 200:
                return
            url = response.url
            if url in saved:
                return
            body = response.body()
            if not body:
                return

            parsed = urlparse(url)
            path = parsed.path or "/index"
            name = os.path.basename(path).split("?")[0] or "index"

            if rt == "stylesheet":
                if not name.endswith(".css"):
                    name = f"style_{css_count}.css"
                    css_count += 1
                filepath = os.path.join(css_dir, name)
            else:  # script
                if not name.endswith(".js"):
                    name = f"script_{js_count}.js"
                    js_count += 1
                filepath = os.path.join(js_dir, name)

            # Дубликаты по имени
            if os.path.exists(filepath):
                h = hashlib.md5(url.encode()).hexdigest()[:8]
                base, ext = os.path.splitext(filepath)
                filepath = f"{base}_{h}{ext}"

            with open(filepath, "wb") as f:
                f.write(body)
            saved.add(url)
            print(f"  saved: {os.path.basename(filepath)}")
        except Exception as e:
            print(f"  skip {response.url[:50]}...: {e}")

    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("response", save_response)

    try:
        print(f"\n--- {base_name} ---")
        page.goto(url, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(3000)

        html = page.content()
        html_path = os.path.join(out_dir, "index.html")
        with open(html_path, "w", encoding="utf-8", errors="replace") as f:
            f.write(html)
        print(f"  saved: index.html ({len(html)} bytes)")

    except Exception as e:
        print(f"  FAIL: {e}")
    finally:
        page.close()


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for url, base in SITES:
            try:
                download_site(browser, url, base)
            except Exception as e:
                print(f"ERROR {base}: {e}")
        browser.close()
    print("\nDone. Check maket/<name>-src/")


if __name__ == "__main__":
    main()
