const generateJWT = require('../../src/utils/generateJWT');

describe('generateJWT', () => {
  it('should generate a JWT token', () => {
    const userId = '1234567890';
    const token = generateJWT(userId);

    expect(token).toBeDefined();
    // TODO implement more asserts
  });
});
