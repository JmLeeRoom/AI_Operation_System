/**
 * 로깅 유틸리티
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf('info')
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (context) {
      return `${prefix} ${message} ${JSON.stringify(context)}`
    }
    return `${prefix} ${message}`
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return
    if (import.meta.env.DEV) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return
    if (import.meta.env.DEV) {
      console.log(this.formatMessage('info', message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return
    if (import.meta.env.DEV) {
      console.warn(this.formatMessage('warn', message, context))
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog('error')) return
    
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    }

    if (import.meta.env.DEV) {
      console.error(this.formatMessage('error', message, errorContext))
      if (error instanceof Error) {
        console.error(error)
      }
    }
  }

  success(message: string, context?: LogContext): void {
    this.info(`✅ ${message}`, context)
  }
}

export const logger = new Logger()

export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | unknown, context?: LogContext) => 
    logger.error(message, error, context),
  success: (message: string, context?: LogContext) => logger.success(message, context),
}

export default logger
