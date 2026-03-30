from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 390, "height": 844})
    pg.goto("http://localhost:8765/index.html", wait_until="networkidle", timeout=30000)
    time.sleep(1)
    
    el = pg.query_selector(".hydration")
    if el:
        el.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\hydration_block.png")
        print("[OK] hydration block screenshot saved")
    else:
        print("[WARN] .hydration not found")
    
    # Also full page to see context
    pg.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\index_full_page.png", full_page=True)
    print("[OK] full page screenshot saved")
    br.close()
