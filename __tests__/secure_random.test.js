/**
 * @jest-environment node
 */
import GameLogic from '../src/logic';

const { secureRandom } = GameLogic;

describe('secureRandom', () => {
    const originalCrypto = global.crypto;

    afterEach(() => {
        global.crypto = originalCrypto;
    });

    test('uses crypto.getRandomValues when available', () => {
        const mockGetRandomValues = jest.fn((array) => {
            array[0] = 2147483648; // half of 2^32
        });
        global.crypto = {
            getRandomValues: mockGetRandomValues
        };

        const result = secureRandom();
        expect(mockGetRandomValues).toHaveBeenCalled();
        expect(result).toBe(0.5);
    });

    test('throws error when crypto is unavailable', () => {
        delete global.crypto;
        expect(() => secureRandom()).toThrow('Secure random number generation is not supported in this environment.');
    });
});
