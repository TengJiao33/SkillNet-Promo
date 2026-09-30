"""Capture any one static storyboard frame, or refresh all frames in place."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "film.html"
BOARD = ROOT / "storyboard.html"
OUTPUT = ROOT / "output" / "storyboard"


def load_shots() -> list[dict]:
    html = BOARD.read_text(encoding="utf-8")
    match = re.search(r'<script id="shot-data" type="application/json">(.*?)</script>', html, re.S)
    if not match:
        raise ValueError("storyboard.html has no shot-data")
    return json.loads(match.group(1))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--slide", help="Refresh one frame by its two-digit number, e.g. 03")
    args = parser.parse_args()
    shots = load_shots()
    if args.slide:
        shots = [shot for shot in shots if shot["id"] == args.slide.zfill(2)]
        if not shots:
            parser.error(f"Unknown slide {args.slide}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(SOURCE.as_uri() + "?still=1&frame=" + str(shots[0]["ms"]), wait_until="load")
        page.evaluate("document.fonts.ready")
        for shot in shots:
            page.evaluate("ms => window.renderAt(ms)", shot["ms"])
            target = OUTPUT / f"{shot['id']}.png"
            page.locator("#viewport").screenshot(path=str(target))
            print(target)
        browser.close()
    if errors:
        raise RuntimeError("Browser errors: " + "; ".join(errors))


if __name__ == "__main__":
    main()
