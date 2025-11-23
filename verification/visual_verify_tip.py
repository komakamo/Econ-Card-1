from playwright.sync_api import sync_playwright

def visual_verify_tip():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        import os
        file_path = os.path.abspath("index.html")
        page.goto(f"file://{file_path}")

        page.wait_for_selector("button:has-text('START GAME')", timeout=5000)
        page.click("button:has-text('START GAME')")
        page.wait_for_selector("text=Your Hand", timeout=2000)

        right_col = page.locator("div.lg\\:col-span-3")

        # 1. Initial State
        right_col.screenshot(path="verification/tip_initial.png")
        print("Captured initial state.")

        # 2. Hover State
        # Find card in the grid
        card_grid = page.locator("div.grid.grid-cols-2")
        card_buttons = card_grid.locator("button:not([disabled])")

        if card_buttons.count() > 0:
            first_card = card_buttons.first
            # Text might be split by children, get first line usually name
            card_text = first_card.inner_text().split('\n')[0]
            print(f"Targeting card: {card_text}")

            # HOVER
            first_card.hover()
            page.wait_for_timeout(1000) # Wait for fade-in
            right_col.screenshot(path="verification/tip_hover.png")
            print(f"Captured hover state for {card_text}.")

            # CLICK
            first_card.click()
            page.wait_for_timeout(1000)
            right_col.screenshot(path="verification/tip_played.png")
            print(f"Captured played state for {card_text}.")

        else:
            print("No playable cards found!")

        browser.close()

if __name__ == "__main__":
    visual_verify_tip()
