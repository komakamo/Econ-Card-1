/**
 * @jest-environment node
 */
const fs = require('fs');
const path = require('path');

describe('Code Health: Magic Numbers', () => {
    test('Universal Health Care card uses constants for cost', () => {
        const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

        // Verify CARD_DATA is defined
        expect(html).toContain('const CARD_DATA = {');
        expect(html).toContain('UNIVERSAL_HEALTH_CARE: {');
        expect(html).toContain('COST: 50');

        // Verify ALL_CARDS uses the constant
        // Note: We need to handle potential whitespace variations
        const cardUsageRegex = /id:\s*CARD_DATA\.UNIVERSAL_HEALTH_CARE\.ID[\s\S]*?cost:\s*([^\n,]+)/;
        const match = html.match(cardUsageRegex);

        expect(match).toBeTruthy();
        if (match) {
            const costValue = match[1].trim();
            expect(costValue).toBe('CARD_DATA.UNIVERSAL_HEALTH_CARE.COST');
        }
    });
});
