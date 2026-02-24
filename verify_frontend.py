
from playwright.sync_api import sync_playwright
import time

def verify(page):
    page.on("console", lambda msg: print(f"Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))

    # Navigate to local server
    page.goto("http://localhost:3000")

    # Wait for title screen
    page.wait_for_selector("text=Start", timeout=5000)

    # Click start (TITLE)
    page.click("text=Start")

    # Wait for setup screen
    time.sleep(1)

    # Click start game (SETUP)
    # "ゲーム開始"
    page.click("button:has-text('ゲーム開始')")

    # Wait for game board
    page.wait_for_selector("text=手札", timeout=5000)

    # Take screenshot
    page.screenshot(path="verification_final.png")
    print("Screenshot taken.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()
