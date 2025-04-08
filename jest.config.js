module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  coverageReporters: [
    "json",
    "html",
    "lcov",
    "clover",
    "cobertura",
    "text-summary",
    "text"
  ],
  collectCoverageFrom: [
    "src/**/*.{component,service}.ts",
    "!src/**/*.component.spec.ts",
    "!src/**/*.{d,module,directive,spec}.ts",
    "!src/**/*.{scss,css,html,xml}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/e2e/",
  ],
  roots: [
    "<rootDir>"
  ],
  testTimeout: 30000,
  testMatch: [
    "<rootDir>/src/**/*.component.spec.ts",
    "<rootDir>/src/**/*.spec.ts",
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec,test).ts"
  ],
  transformIgnorePatterns: [ 'node_modules/(?!.*\\.mjs$|@datorama/akita|uuid)'],
  transform: {}
};
