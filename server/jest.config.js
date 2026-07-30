const config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.cjs"],
  globalTeardown: "<rootDir>/src/__tests__/teardown.ts",
  testMatch: ["**/__tests__/**/*.test.ts", "**/modules/**/*.test.ts"],
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/server.ts",
  ],
  coverageDirectory: "coverage",
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  verbose: true,
};

export default config;
