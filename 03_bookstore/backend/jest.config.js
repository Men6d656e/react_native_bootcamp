/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  // Use the ESM preset for ts-jest
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  // Tell Jest how to handle .ts files as ESM
  extensionsToTreatAsEsm: [".ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleNameMapper: {
    // This allows you to use .js extensions in your imports while writing .ts files
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};
