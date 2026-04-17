import GameLogic from '../src/logic';

const { getLoc, t } = GameLogic;

describe('Localization Helpers', () => {
    describe('getLoc', () => {
        const mockObj = {
            name: '名前',
            name_en: 'Name',
            desc: '説明'
        };

        test('should return English version when lang is en and English key exists', () => {
            expect(getLoc(mockObj, 'name', 'en')).toBe('Name');
        });

        test('should return default version when lang is en but English key is missing', () => {
            expect(getLoc(mockObj, 'desc', 'en')).toBe('説明');
        });

        test('should return default version when lang is ja', () => {
            expect(getLoc(mockObj, 'name', 'ja')).toBe('名前');
        });

        test('should return default version for unsupported languages', () => {
            expect(getLoc(mockObj, 'name', 'fr')).toBe('名前');
        });
    });

    describe('t (UI Text Translation)', () => {
        test('should return English text for valid key and en lang', () => {
            expect(t('title', 'en')).toBe('Economics Master');
        });

        test('should return Japanese text for valid key and ja lang', () => {
            expect(t('title', 'ja')).toBe('エコノミクス・マスター');
        });

        test('should return the key itself if missing in both en and ja', () => {
            expect(t('NON_EXISTENT_KEY', 'en')).toBe('NON_EXISTENT_KEY');
            expect(t('NON_EXISTENT_KEY', 'ja')).toBe('NON_EXISTENT_KEY');
        });

        test('should handle unsupported language by falling back to ja', () => {
             // UI_TEXT['fr'] is undefined, now safely handled with optional chaining
             expect(t('title', 'fr')).toBe('エコノミクス・マスター');
        });
    });
});
