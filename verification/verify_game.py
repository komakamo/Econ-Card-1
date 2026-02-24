from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # 1. Navigate to the game (local server)
    page.goto("http://localhost:3000/index.html")

    # 2. Verify Title Screen
    print("Checking Title Screen...")
    # Wait for the title "Economics Master" (english title even in ja mode?)
    # UI_TEXT ja.title is "エコノミクス・マスター"
    # But header has "Economics Master" hardcoded?
    # <h1 className="...">Economics Master</h1> in header.
    page.wait_for_selector("text=Economics Master", timeout=10000)

    # The start button on title screen says "START" (from UI_TEXT.ja.start="Start", uppercased)
    page.wait_for_selector("text=START", timeout=10000)

    # 3. Click Start to go to Setup
    print("Clicking Start...")
    page.click("text=START")

    # 4. Verify Setup Screen
    print("Checking Setup Screen...")
    # Setup screen title is "エコノミクス・マスター" (ja.title)
    page.wait_for_selector("text=エコノミクス・マスター", timeout=10000)

    # 5. Click Start Game to go to Gameplay
    print("Starting Gameplay...")
    # The button text is "ゲーム開始" (ja.startGame)
    page.click("text=ゲーム開始")

    # 6. Verify Gameplay Screen
    print("Checking Gameplay Screen...")
    # Turn indicator: "TURN 1" (UI_TEXT.ja.turn="TURN")
    page.wait_for_selector("text=TURN 1", timeout=10000)
    # Player name: "自国 (あなた)" (UI_TEXT.ja.myCountry)
    page.wait_for_selector("text=自国 (あなた)", timeout=10000)

    # 7. Take Screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/gameplay.png")
    print("Screenshot saved to verification/gameplay.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
