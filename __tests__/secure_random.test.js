import GameLogic from '../src/logic';

const { secureRandom } = GameLogic;

describe('secureRandom', () => {
  const originalCrypto = global.crypto;

  afterEach(() => {
    global.crypto = originalCrypto;
  });

  test('returns a number between 0 and 1 when crypto.getRandomValues is available', () => {
    const mockGetRandomValues = jest.fn((array) => {
      array[0] = 2147483648; // Half of 2^32
      return array;
    });

    delete global.crypto;
    global.crypto = {
      getRandomValues: mockGetRandomValues,
    };

    const result = secureRandom();
    expect(result).toBe(0.5);
    expect(mockGetRandomValues).toHaveBeenCalled();
  });

  test('throws an error when crypto.getRandomValues is NOT available', () => {
    delete global.crypto;

    expect(() => secureRandom()).toThrow('Secure PRNG not available');
  });
});
