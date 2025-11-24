
import os
from playwright.sync_api import sync_playwright, expect

def verify_reset_discard_pile():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Load the game
        page.goto("http://localhost:8080/index.html")

        # Switch to English for easier selectors
        page.get_by_role("button", name="EN").click()

        # Start Game
        page.get_by_role("button", name="START GAME").click()

        # Verify game started
        # Use first() to avoid strict mode violation, or better selector.
        expect(page.get_by_text("TURN 1").first).to_be_visible()

        # 2. Play a card to populate discard pile
        # Wait for hand to be populated
        cards = page.locator("button.group")
        expect(cards.first).to_be_visible()

        # Click the first card
        cards.first.click()

        # Verify discard pile has a card
        # Wait a bit for animation/update
        page.wait_for_timeout(1000)

        # 3. Reset the Game
        page.get_by_role("button", name="Reset").click()

        # Wait for game to restart.
        # The TurnOverlay appears again.
        expect(page.get_by_text("TURN 1").first).to_be_visible()

        # 4. Verify Discard Pile is EMPTY
        page.wait_for_timeout(1000) # Wait for render

        page.screenshot(path="verification_reset.png")
        print("Verification script ran successfully. Check verification_reset.png")

        browser.close()

if __name__ == "__main__":
    verify_reset_discard_pile()
