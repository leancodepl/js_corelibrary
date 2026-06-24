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
import {
  allLogLevels,
  defaultEnabledLogLevels,
  isLogLevelEnabled,
  LogLevel,
  type LogLevelLabel,
  logLevelToLabel,
} from "./logLevels"

const logLevelToColor: Record<LogLevel, (text: string) => string> = {
  [LogLevel.Error]: chalk.red,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Success]: chalk.green,
  [LogLevel.Info]: chalk.blue,
  [LogLevel.Verbose]: chalk.gray,
  [LogLevel.Debug]: chalk.magenta,
} as const

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

/**
 * Creates a logger preset for command-line output. Each log level maps to the
 * matching `console` method and is prefixed with a colorized `[LEVEL]` label
 * via middleware. Messages below the enabled threshold are skipped.
 *
 * @param options - Configuration for the CLI logger
 * @param options.enabledLogLevels - Levels that should be emitted; defaults to
 *   {@link defaultEnabledLogLevels} (error, warn, success, info)
 * @returns A logger with one method per {@link LogLevel} label
 * @example
 * ```typescript
 * const logger = createCliLogger()
 * logger.info("server started")
 * logger.error("something failed", new Error("boom"))
 * ```
 */
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

/**
 * The logger type produced by {@link createCliLogger}.
 */
type CliLogger = ReturnType<typeof createCliLogger>

export { type CliLogger, createCliLogger }
