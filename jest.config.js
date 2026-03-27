const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
  'src/components/**/*.{js,jsx}',
  ],
}

module.exports = createJestConfig(customJestConfig) 