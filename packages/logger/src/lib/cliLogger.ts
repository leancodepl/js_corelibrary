/* eslint-disable no-console */
import chalk from "chalk"
import {
  createLogger,
  DefaultContext,
  isContextualMessage,
  LoggerMessage,
  MethodHandler,
  SupportedOutput,
} from "./logger"

enum LogLevel {
  Error = 0,
  Warn = 1,
  Success = 2,
  Info = 3,
  Verbose = 4,
  Debug = 5,
}

const allLogLevels = [LogLevel.Error, LogLevel.Warn, LogLevel.Success, LogLevel.Info, LogLevel.Verbose, LogLevel.Debug]

const defaultEnabledLogLevels = [LogLevel.Error, LogLevel.Warn, LogLevel.Success, LogLevel.Info]

const logLevelToLabel = {
  [LogLevel.Error]: "error",
  [LogLevel.Warn]: "warn",
  [LogLevel.Success]: "success",
  [LogLevel.Info]: "info",
  [LogLevel.Verbose]: "verbose",
  [LogLevel.Debug]: "debug",
} as const
type LogLevelLabel = (typeof logLevelToLabel)[keyof typeof logLevelToLabel]

const logLevelToColor: Record<LogLevel, (text: string) => string> = {
  [LogLevel.Error]: chalk.red,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Success]: chalk.green,
  [LogLevel.Info]: chalk.blue,
  [LogLevel.Verbose]: chalk.gray,
  [LogLevel.Debug]: chalk.magenta,
} as const

function isLogLevelEnabled(logLevel: LogLevel, enabledLogLevels: LogLevel[]) {
  return enabledLogLevels.includes(logLevel)
}

function mapMessages<TContext extends DefaultContext, TOutput extends SupportedOutput>(
  context: TContext,
  messages: LoggerMessage<TContext, TOutput>[],
): TOutput[] {
  return messages.map(m => (isContextualMessage(m) ? m(context) : m))
}

function createLoggerMethod(logLevel: LogLevel, enabledLogLevels: LogLevel[]) {
  return (context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) => {
    if (isLogLevelEnabled(logLevel, enabledLogLevels)) {
      const mappedMessages = mapMessages(context, messages)
      switch (logLevel) {
        case LogLevel.Error:
          console.error(...mappedMessages)
          break
        case LogLevel.Warn:
          console.warn(...mappedMessages)
          break
        case LogLevel.Success:
          console.log(...mappedMessages)
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

type CreateCliLoggerOptions = { enabledLogLevels?: LogLevel[] }

function createCliLogger({ enabledLogLevels = defaultEnabledLogLevels }: CreateCliLoggerOptions = {}) {
  const logger = createLogger({
    ...allLogLevels.reduce(
      (acc, level) => {
        const label = logLevelToLabel[level]
        acc[label] = createLoggerMethod(level, enabledLogLevels)
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

export { allLogLevels, createCliLogger, LogLevel }
