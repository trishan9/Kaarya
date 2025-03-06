// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)",   // normal tests
    "**/features/*.feature"            // include feature files
  ],
};
