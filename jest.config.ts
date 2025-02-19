module.exports = {
    preset: 'ts-jest',  // Use ts-jest to handle TypeScript files
    testEnvironment: 'node',  // Set the test environment to Node.js
    transform: {
      '^.+\\.ts$': 'ts-jest',  // Transform TypeScript files using ts-jest
    },
    moduleFileExtensions: ['js', 'ts'],  // Add 'ts' for TypeScript files
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',  // Ensure Jest uses the correct tsconfig
      },
    },
  };
  