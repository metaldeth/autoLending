"""
Captures animation frames at multiple time intervals to verify animations are running.
Usage: python capture_frames.py <url> [output_dir]
Output: frames at t=0, 0.3s, 0.6s, 1s, 1.5s, 2s, 3s for chromium + webkit
"""
import sys
import time
import os
from playwright.sync_api import sync_playwright

INTERVALS = [0, 0.3, 0.6, 1.0, 1.5, 2.0, 3.0]
BROWSERS = ["chromium", "webkit"]


def capture(url: str, out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)
    with sync_playwright() as p:
        for eng in BROWSERS:
            try:
                br = getattr(p, eng).launch()
                pg = br.new_page(viewport={"width": 1440, "height": 900})
                pg.goto(url, wait_until="domcontentloaded", timeout=60000)

                for t in INTERVALS:
                    time.sleep(t if t == 0 else INTERVALS[INTERVALS.index(t)] - INTERVALS[INTERVALS.index(t) - 1])
                    ms = int(t * 1000)
                    fname = os.path.join(out_dir, f"{eng}_t{ms}ms.png")
                    pg.screenshot(path=fname)
                    print(f"OK  {eng:10} t={t:.1f}s -> {fname}")

                br.close()
            except Exception as e:
                print(f"ERR {eng}: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python capture_frames.py <url> [output_dir]")
        sys.exit(1)
    url = sys.argv[1]
    out_dir = sys.argv[2] if len(sys.argv) > 2 else "anim-frames"
    print(f"Capturing animation frames: {url} -> {out_dir}")
    capture(url, out_dir)
    print("Done.")
