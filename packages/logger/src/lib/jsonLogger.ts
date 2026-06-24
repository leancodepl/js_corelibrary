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

function mapMessages<TContext extends DefaultContext, TOutput extends SupportedOutput>(
  context: TContext,
  messages: LoggerMessage<TContext, TOutput>[],
): TOutput[] {
  return messages.map(m => (isContextualMessage(m) ? m(context) : m))
}

function serializeMessageValue(value: unknown): unknown {
  if (value instanceof Error) {
    return { message: value.message, stack: value.stack }
  }
  return value
}

function formatMessageValue(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value)
  }
  return String(value)
}

function createJsonLoggerMethod(logLevel: LogLevel, enabledLogLevels: LogLevel[]) {
  const levelLabel = logLevelToLabel[logLevel]
  return (context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) => {
    if (!isLogLevelEnabled(logLevel, enabledLogLevels)) {
      return
    }
    const mapped = mapMessages(context, messages)
    const message = mapped.map(m => formatMessageValue(serializeMessageValue(m))).join(" ")
    const entry = {
      level: levelLabel,
      timestamp: new Date().toISOString(),
      message,
      ...(Object.keys(context).length > 0 ? { context } : {}),
    }
    process.stdout.write(JSON.stringify(entry) + "\n")
  }
}

type CreateJsonLoggerOptions = { enabledLogLevels?: LogLevel[] }

/**
 * Creates a logger preset that writes one JSON object per line to
 * `process.stdout`. Each entry includes the level label, an ISO timestamp, the
 * joined message, and the context (when non-empty). `Error` values are
 * serialized to `{ message, stack }`. Messages below the enabled threshold are
 * skipped.
 *
 * @param options - Configuration for the JSON logger
 * @param options.enabledLogLevels - Levels that should be emitted; defaults to
 *   {@link defaultEnabledLogLevels} (error, warn, success, info)
 * @returns A logger with one method per {@link LogLevel} label
 * @example
 * ```typescript
 * const logger = createJsonLogger()
 * logger.withContext({ requestId: "req-1" }).info("request handled")
 * // {"level":"info","timestamp":"...","message":"request handled","context":{"requestId":"req-1"}}
 * ```
 */
function createJsonLogger({ enabledLogLevels = defaultEnabledLogLevels }: CreateJsonLoggerOptions = {}) {
  return createLogger({
    ...allLogLevels.reduce(
      (acc, level) => {
        const label = logLevelToLabel[level]
        acc[label] = createJsonLoggerMethod(level, enabledLogLevels)
        return acc
      },
      {} as Record<LogLevelLabel, MethodHandler<SupportedOutput>>,
    ),
  })
}

/**
 * The logger type produced by {@link createJsonLogger}.
 */
type JsonLogger = ReturnType<typeof createJsonLogger>

export { createJsonLogger, type JsonLogger }
