import time
from playwright.sync_api import sync_playwright, expect

def verify_rank_screen():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            print("Navigating to game...")
            page.goto("http://localhost:8000/index.html")

            # Wait for game to load
            page.wait_for_selector("text=Economics Master", timeout=10000)

            # Start Game
            print("Starting game...")
            page.get_by_text("START GAME").click()

            # Wait for game board
            expect(page.get_by_text("自国 (あなた)")).to_be_visible()

            # Wait for cheat to be attached (useEffect runs after render)
            print("Waiting for cheat object...")
            page.wait_for_function("typeof window.gameCheat !== 'undefined'")

            # Trigger Win Cheat
            print("Triggering Win Cheat...")
            page.evaluate("window.gameCheat.win()")

            time.sleep(1) # Give it a sec to render

            # Verify Result Screen
            print("Verifying Result Screen...")
            # Wait for the overlay to appear
            expect(page.get_by_text("Result Report")).to_be_visible(timeout=5000)

            expect(page.get_by_text("VICTORY")).to_be_visible()
            expect(page.get_by_text("S", exact=True)).to_be_visible() # Rank S
            expect(page.get_by_text("LEGENDARY")).to_be_visible()

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="verification/rank_screen.png")
            print("Screenshot saved to verification/rank_screen.png")

        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/debug_failure.png")
            print("Failure screenshot saved to verification/debug_failure.png")
            raise e

if __name__ == "__main__":
    verify_rank_screen()
