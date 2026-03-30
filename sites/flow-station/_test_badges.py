from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 390, "height": 844})
    pg.goto("http://localhost:8765/index.html", wait_until="networkidle", timeout=30000)
    time.sleep(0.5)
    pg.evaluate("document.querySelector('.hydration').scrollIntoView({behavior:'instant'})")
    time.sleep(1)
    el = pg.query_selector(".hydration")
    if el:
        el.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\badges_fixed_390.png")
        print("[OK] badges_fixed_390")

    pg2 = br.new_page(viewport={"width": 430, "height": 932})
    pg2.goto("http://localhost:8765/index.html", wait_until="networkidle", timeout=30000)
    time.sleep(0.5)
    pg2.evaluate("document.querySelector('.hydration').scrollIntoView({behavior:'instant'})")
    time.sleep(1)
    el2 = pg2.query_selector(".hydration")
    if el2:
        el2.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\badges_fixed_430.png")
        print("[OK] badges_fixed_430")

    pg3 = br.new_page(viewport={"width": 768, "height": 1024})
    pg3.goto("http://localhost:8765/index.html", wait_until="networkidle", timeout=30000)
    time.sleep(0.5)
    pg3.evaluate("document.querySelector('.hydration').scrollIntoView({behavior:'instant'})")
    time.sleep(1)
    el3 = pg3.query_selector(".hydration")
    if el3:
        el3.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\badges_fixed_768.png")
        print("[OK] badges_fixed_768")

    br.close()
