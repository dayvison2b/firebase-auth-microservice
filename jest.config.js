module.exports = {
  testEnvironment: 'node',
  testMatch: ['tests/**/*.test.js'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};