/**
 * Jest setup file that runs after the test framework is installed.
 * This file can use beforeAll/afterAll/beforeEach/afterEach globals.
 */

// Silence console in tests unless specifically testing logging
const originalConsole = { ...console }
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'debug').mockImplementation(() => {})
  jest.spyOn(console, 'info').mockImplementation(() => {})
})

afterAll(() => {
  console.log = originalConsole.log
  console.debug = originalConsole.debug
  console.info = originalConsole.info
})
