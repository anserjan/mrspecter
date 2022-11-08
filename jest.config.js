/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  reporters: [
    "default",
    ["jest-junit", { suiteNameTemplate: "{filename}" }],
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  collectCoverageFrom: ['<rootDir>/endpoints/**/*.{ts,js,jsm,tsx,jsx,tsm}', '<rootDir>/httpServer.js'],
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/tests/"]
};