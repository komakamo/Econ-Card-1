import re
from playwright.sync_api import sync_playwright

def verify_tip():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Load the page (assuming local file access)
        import os
        file_path = os.path.abspath("index.html")
        page.goto(f"file://{file_path}")

        # Wait for game to load
        page.wait_for_selector("button:has-text('START GAME')", timeout=5000)

        # Start Game
        page.click("button:has-text('START GAME')")
        page.wait_for_selector("text=Your Hand", timeout=2000)

        # 1. Verify Card Info Panel exists in Right Column
        info_panel = page.locator("text=カード解説")
        if info_panel.count() > 0:
            print("SUCCESS: Card Info Panel placeholder found.")
        else:
            print("WARNING: Card Info Panel placeholder NOT found.")

        # 2. Play a card and check Log for Tip
        # Target buttons inside the grid (cards), exclude the "Issue Bonds" button which is in the header
        # The grid has class 'grid-cols-2'
        card_grid = page.locator("div.grid.grid-cols-2")
        card_buttons = card_grid.locator("button:not([disabled])")

        if card_buttons.count() == 0:
            print("ERROR: No playable cards found in hand.")
            browser.close()
            return

        first_card = card_buttons.first

        # Get card name to verify log later
        card_text = first_card.inner_text()
        print(f"Playing card (raw text): {card_text[:50]}...")

        first_card.click()

        # Wait for log update
        page.wait_for_timeout(1000)

        # Check logs for "【経済メモ】"
        logs = page.locator("text=【経済メモ】")
        if logs.count() > 0:
            print("SUCCESS: Tip found in logs.")
            print(f"Log content: {logs.first.inner_text()}")
        else:
            print("FAILURE: Tip NOT found in logs.")

        # 3. Verify Card Info Panel updates to last played card
        tip_section = page.locator("div:has-text('経済メモ')")
        visible_tips = tip_section.all_inner_texts()
        print(f"Found {len(visible_tips)} occurrences of '経済メモ'.")

        if len(visible_tips) >= 2:
            print("SUCCESS: Tip appears in both Log and Info Panel (as last played).")
        elif len(visible_tips) == 1:
             print("PARTIAL SUCCESS: Tip found once (likely Log). Check Info Panel.")
        else:
             print("FAILURE: Tip text not found anywhere.")

        browser.close()

if __name__ == "__main__":
    verify_tip()
