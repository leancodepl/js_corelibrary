/* eslint-disable no-console */
import chalk from "chalk"
import {
  createLogger,
  DefaultContext,
  isContextualMessage,
  LoggerMessage,
  MethodHandler,
  SupportedOutput,
} from "@leancodepl/logger-base"

enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Verbose = 3,
  Debug = 4,
}

const allLogLevels = [LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Verbose, LogLevel.Debug] as const

const logLevelToLabel = {
  [LogLevel.Error]: "error",
  [LogLevel.Warn]: "warn",
  [LogLevel.Info]: "info",
  [LogLevel.Verbose]: "verbose",
  [LogLevel.Debug]: "debug",
} as const
type LogLevelLabel = (typeof logLevelToLabel)[keyof typeof logLevelToLabel]

const logLevelToColor: Record<LogLevel, (text: string) => string> = {
  [LogLevel.Error]: chalk.red,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Info]: chalk.green,
  [LogLevel.Verbose]: chalk.gray,
  [LogLevel.Debug]: chalk.blue,
} as const

function isLogLevelEnabled(logLevel: LogLevel, enabledLogLevel: LogLevel) {
  return logLevel <= enabledLogLevel
}

function mapMessages<TContext extends DefaultContext, TOutput extends SupportedOutput>(
  context: TContext,
  messages: LoggerMessage<TContext, TOutput>[],
): TOutput[] {
  return messages.map(m => (isContextualMessage(m) ? m(context) : m))
}

function createLoggerMethod(logLevel: LogLevel, enabledLogLevel: LogLevel) {
  return (context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) => {
    if (isLogLevelEnabled(logLevel, enabledLogLevel)) {
      const mappedMessages = mapMessages(context, messages)
      switch (logLevel) {
        case LogLevel.Error:
          console.error(...mappedMessages)
          break
        case LogLevel.Warn:
          console.warn(...mappedMessages)
          break
        case LogLevel.Info:
          console.info(...mappedMessages)
          break
        case LogLevel.Verbose:
          console.log(...mappedMessages)
          break
        case LogLevel.Debug:
          console.log(...mappedMessages)
          break
      }
    }
  }
}

function mkFormatLoggerMiddlewareMethod(logLevel: LogLevel) {
  return (next: MethodHandler<SupportedOutput>) =>
    (context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) => {
      const color = logLevelToColor[logLevel]
      const label = logLevelToLabel[logLevel]

      next(context, color(`[${label.toUpperCase()}]`), ...messages)
    }
}

function createCliLogger({ logLevel = LogLevel.Info }: { logLevel?: LogLevel } = {}) {
  const logger = createLogger({
    ...allLogLevels.reduce(
      (acc, level) => {
        const label = logLevelToLabel[level]
        acc[label] = createLoggerMethod(level, logLevel)
        return acc
      },
      {} as Record<LogLevelLabel, MethodHandler<SupportedOutput>>,
    ),
  })

  return logger.withMiddleware({
    ...allLogLevels.reduce(
      (acc, level) => {
        const label = logLevelToLabel[level]
        acc[label] = mkFormatLoggerMiddlewareMethod(level)
        return acc
      },
      {} as Record<LogLevelLabel, ReturnType<typeof mkFormatLoggerMiddlewareMethod>>,
    ),
  })
}

export { createCliLogger, LogLevel }
