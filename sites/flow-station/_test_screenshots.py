from playwright.sync_api import sync_playwright
import os, time

BASE = "http://localhost:8765"
PAGES = ["index.html", "sostav.html", "podpiska.html", "dlya-klubov.html", "o-flow.html"]
VIEWPORTS = [
    ("mobile_390", 390, 844),
    ("mobile_430", 430, 932),
]
OUT = r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    for eng_name in ["chromium", "webkit"]:
        br = getattr(p, eng_name).launch()
        for page_name in PAGES:
            slug = page_name.replace(".html", "")
            for vp_name, w, h in VIEWPORTS:
                pg = br.new_page(viewport={"width": w, "height": h})
                pg.goto(f"{BASE}/{page_name}", wait_until="networkidle", timeout=30000)
                time.sleep(0.5)
                path = f"{OUT}/{eng_name}_{vp_name}_{slug}_normal.png"
                pg.screenshot(path=path, full_page=True)
                print(f"[OK] {path}")
                burger = pg.query_selector("#menuToggle")
                if burger and burger.is_visible():
                    burger.click()
                    time.sleep(0.5)
                    path_m = f"{OUT}/{eng_name}_{vp_name}_{slug}_menu_open.png"
                    pg.screenshot(path=path_m)
                    print(f"[OK] {path_m}")
                    close_btn = pg.query_selector("#menuClose")
                    if close_btn and close_btn.is_visible():
                        close_btn.click()
                        time.sleep(0.3)
                pg.close()
        br.close()
print("DONE")
