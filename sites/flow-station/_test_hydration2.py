from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 390, "height": 844})
    pg.goto("http://localhost:8765/index.html", wait_until="networkidle", timeout=30000)
    time.sleep(0.5)
    
    # Scroll to hydration section to trigger fade-in
    pg.evaluate("document.querySelector('.hydration').scrollIntoView({behavior:'instant'})")
    time.sleep(1)
    
    # Take viewport screenshot showing hydration block
    pg.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\hydration_viewport.png")
    print("[OK] hydration viewport")
    
    # Scroll down a bit more to see badges
    pg.evaluate("window.scrollBy(0, 200)")
    time.sleep(0.5)
    pg.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\hydration_viewport2.png")
    print("[OK] hydration viewport2")
    
    # Element screenshot
    el = pg.query_selector(".hydration")
    if el:
        el.screenshot(path=r"c:\dev\nefedov.tech\sites\flow-station\maket\screenshots-local2\hydration_element.png")
        print("[OK] hydration element")
    
    br.close()
