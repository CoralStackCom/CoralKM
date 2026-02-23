import { createLogger } from '@/utils/logger'

describe('createLogger', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns a logger with all log methods', () => {
    const log = createLogger('Test')
    expect(log.debug).toBeDefined()
    expect(log.info).toBeDefined()
    expect(log.warn).toBeDefined()
    expect(log.error).toBeDefined()
  })

  it('returns functions for each log method', () => {
    const log = createLogger('Test')
    expect(typeof log.debug).toBe('function')
    expect(typeof log.info).toBe('function')
    expect(typeof log.warn).toBe('function')
    expect(typeof log.error).toBe('function')
  })

  it('debug outputs messages in dev mode', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation()
    const log = createLogger('DevTest')
    log.debug('debug message')
    // __DEV__ is true in test environment, so debug should be called
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('debug message'))
  })

  it('formats messages with namespace', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const log = createLogger('MyModule')
    log.warn('something happened')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[MyModule]'))
  })

  it('includes log level in formatted output', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const log = createLogger('Test')
    log.warn('test message')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[WARN]'))
  })

  it('passes data objects to console', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const log = createLogger('Test')
    const data = { key: 'value' }
    log.warn('test', data)
    expect(spy).toHaveBeenCalledWith(expect.any(String), data)
  })

  it('passes error objects for error level', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    const log = createLogger('Test')
    const err = new Error('test error')
    log.error('failed', err)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Test]'), err)
  })

  it('error level includes [ERROR] in output', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    const log = createLogger('ErrTest')
    log.error('something broke')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'))
  })

  it('error with both error and data passes all arguments', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    const log = createLogger('Test')
    const err = new Error('boom')
    const data = { context: 'unit test' }
    log.error('failed', err, data)
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[Test]'), err, data)
  })

  it('info outputs to console.info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation()
    const log = createLogger('InfoTest')
    log.info('info message')
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[InfoTest]'))
  })

  it('info passes data when provided', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation()
    const log = createLogger('Test')
    const data = { count: 42 }
    log.info('with data', data)
    expect(spy).toHaveBeenCalledWith(expect.any(String), data)
  })
})
