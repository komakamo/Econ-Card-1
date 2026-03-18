import GameLogic from '../src/logic';

const { secureRandom } = GameLogic;

describe('secureRandom', () => {
    let originalCrypto;

    beforeEach(() => {
        // Handle both window (jsdom) and global (node)
        if (typeof window !== 'undefined') {
            originalCrypto = window.crypto;
        } else {
            originalCrypto = global.crypto;
        }
    });

    afterEach(() => {
        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'crypto', {
                value: originalCrypto,
                configurable: true
            });
        } else {
            global.crypto = originalCrypto;
        }
        jest.restoreAllMocks();
    });

    test('uses crypto.getRandomValues when available', () => {
        const mockGetRandomValues = jest.fn((array) => {
            array[0] = 2147483648; // Half of 4294967296
        });

        const mockCrypto = {
            getRandomValues: mockGetRandomValues
        };

        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'crypto', {
                value: mockCrypto,
                configurable: true
            });
        } else {
            global.crypto = mockCrypto;
        }

        const result = secureRandom();
        expect(result).toBe(0.5);
        expect(mockGetRandomValues).toHaveBeenCalled();
    });

    test('throws error when crypto is unavailable', () => {
        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'crypto', {
                value: undefined,
                configurable: true
            });
        } else {
            global.crypto = undefined;
        }

        expect(() => secureRandom()).toThrow('Secure PRNG not available');
    });
});
