
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the game
        page.goto("http://localhost:8000/index.html")

        # Start game
        time.sleep(1)
        page.get_by_role("button", name="START").click()
        time.sleep(0.5)
        page.get_by_role("button", name="ゲーム開始").click()
        time.sleep(1)

        # Take screenshot showing "End Turn" button
        page.screenshot(path="verification/verification_final.png")

        print("Screenshot taken.")
        browser.close()

if __name__ == "__main__":
    run()
