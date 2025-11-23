from playwright.sync_api import sync_playwright
import time

def verify_era_system():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        # Navigate to the game
        page.goto("http://localhost:8001/index.html")

        # Wait for load
        page.wait_for_load_state("networkidle")

        # Click START GAME
        try:
            page.wait_for_selector("button:has-text('START GAME')", timeout=5000)
            page.click("button:has-text('START GAME')")
            print("Clicked START GAME")
        except Exception as e:
            print(f"Click failed: {e}")
            return

        # Wait for Turn 1
        try:
            page.wait_for_selector("text=TURN 1", timeout=5000)
            print("Game started, Turn 1")
            page.screenshot(path="verification/phase1_growth.png")
        except Exception as e:
            print(f"Wait for TURN 1 failed: {e}")
            return

        # Check Era 1 Name
        if page.locator("text=高度経済成長期").count() > 0:
            print("Verified Era: 高度経済成長期")
        else:
            print("Failed to verify Era 1")

        # Loop to Turn 8
        for i in range(1, 8):
            print(f"Finishing Turn {i}...")
            try:
                page.click("button:has-text('ターン終了')")
                # Wait for turn to increment
                page.wait_for_selector(f"text=TURN {i + 1}", timeout=10000)
                print(f"Now at Turn {i + 1}")
                # Small delay to let animations finish
                time.sleep(0.5)
            except Exception as e:
                print(f"Error progressing turn: {e}")
                page.screenshot(path=f"verification/error_turn_{i}.png")
                break

        # Check Era 2
        # Era 2 is 'バブル崩壊・停滞期'
        try:
            page.wait_for_selector("text=バブル崩壊・停滞期", timeout=5000)
            print("Verified Era 2: バブル崩壊・停滞期")
            page.screenshot(path="verification/phase2_stagnation.png")
        except Exception as e:
            print(f"Failed to verify Era 2: {e}")
            page.screenshot(path="verification/phase2_fail.png")

        browser.close()

if __name__ == "__main__":
    verify_era_system()
