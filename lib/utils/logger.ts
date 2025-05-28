/**
 * Logger utility for consistent logging across the application
 * Follows the Windsurf logging guidelines
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogPayload {
  message: string
  [key: string]: unknown
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: Record<string, unknown>): LogPayload {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    console.info(this.formatMessage('info', message, data))
  }

  warn(message: string, data?: Record<string, unknown>): void {
    console.warn(this.formatMessage('warn', message, data))
  }

  error(message: string, data?: Record<string, unknown>): void {
    console.error(this.formatMessage('error', message, data))
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, data))
    }
  }
}

export const logger = new Logger()
