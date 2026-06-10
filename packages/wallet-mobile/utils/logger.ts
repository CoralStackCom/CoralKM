/**
 * Structured logging utility with levels, namespaces, and dev-only filtering.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  namespace: string
  message: string
  data?: Record<string, unknown>
  error?: Error
}

interface Logger {
  debug(message: string, data?: Record<string, unknown>): void
  info(message: string, data?: Record<string, unknown>): void
  warn(message: string, data?: Record<string, unknown>): void
  error(message: string, error?: Error, data?: Record<string, unknown>): void
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// In production, only show warn and above. In dev, show everything.
const currentLevel: LogLevel = __DEV__ ? 'debug' : 'warn'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLevel]
}

function formatEntry(entry: LogEntry): string {
  const time = entry.timestamp.split('T')[1]?.split('.')[0] ?? entry.timestamp
  return `[${time}] [${entry.level.toUpperCase()}] [${entry.namespace}] ${entry.message}`
}

/**
 * Creates a namespaced logger instance.
 * @param namespace - Identifier for the logging context (e.g., 'Wallet', 'WSConnection')
 */
export function createLogger(namespace: string): Logger {
  const log = (level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) => {
    if (!shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      namespace,
      message,
      data,
      error,
    }

    const formatted = formatEntry(entry)

    switch (level) {
      case 'debug':
        data ? console.debug(formatted, data) : console.debug(formatted)
        break
      case 'info':
        data ? console.info(formatted, data) : console.info(formatted)
        break
      case 'warn':
        data ? console.warn(formatted, data) : console.warn(formatted)
        break
      case 'error':
        if (error && data) {
          console.error(formatted, error, data)
        } else if (error) {
          console.error(formatted, error)
        } else if (data) {
          console.error(formatted, data)
        } else {
          console.error(formatted)
        }
        break
    }
  }

  return {
    debug: (message, data) => log('debug', message, data),
    info: (message, data) => log('info', message, data),
    warn: (message, data) => log('warn', message, data),
    error: (message, error, data) => log('error', message, data, error),
  }
}
