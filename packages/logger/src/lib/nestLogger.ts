import { createLogger, DefaultContext, SupportedOutput } from "./logger"

/**
 * Adapts an arbitrary value coming from NestJS (whose logger API is untyped) to
 * the {@link SupportedOutput} surface accepted by the underlying logger. The
 * value is forwarded unchanged; downstream serialization (see
 * {@link formatNestMessage}) handles every runtime type, so this only reconciles
 * the static types at the Nest boundary without altering behavior.
 */
function asSupportedOutput(value: unknown): SupportedOutput {
  return value as SupportedOutput
}

function formatNestMessage(message: unknown, optionalParams: unknown[]): string {
  const parts = [message, ...optionalParams].map(p => {
    if (p instanceof Error) return p.message
    if (typeof p === "object" && p !== null) return JSON.stringify(p)
    return String(p)
  })
  return parts.join(" ")
}

function writeJsonLog(level: string, message: unknown, optionalParams: unknown[]) {
  const last = optionalParams.at(-1)
  const context = typeof last === "string" ? last : undefined
  const msgParams = context !== undefined ? optionalParams.slice(0, -1) : optionalParams
  const msg = formatNestMessage(message, msgParams)
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message: msg,
    ...(context !== undefined ? { context } : {}),
  }
  process.stdout.write(JSON.stringify(entry) + "\n")
}

function nestJsonHandler(level: string) {
  return (_context: DefaultContext, ...messages: SupportedOutput[]) => {
    const [message = "", ...optionalParams] = messages
    writeJsonLog(level, message, optionalParams)
  }
}

/**
 * Subset of the NestJS `LoggerService` interface implemented by
 * {@link createNestJsonLogger}. Mirrors Nest's expected logger contract so the
 * JSON logger can be passed directly to a Nest application.
 */
export interface LoggerService {
  log(message: any, ...optionalParams: any[]): any
  error(message: any, ...optionalParams: any[]): any
  warn(message: any, ...optionalParams: any[]): any
  debug?(message: any, ...optionalParams: any[]): any
  verbose?(message: any, ...optionalParams: any[]): any
  fatal?(message: any, ...optionalParams: any[]): any
  setLogLevels?(levels: any[]): any
}

/**
 * Creates a NestJS-compatible {@link LoggerService} that emits one JSON object
 * per line to `process.stdout`. When the final optional parameter is a string,
 * it is treated as Nest's `context` argument and recorded separately; remaining
 * params are joined into the message, with `Error` values reduced to their
 * message.
 *
 * @returns A logger implementing Nest's `log`/`error`/`warn`/`debug`/`verbose`/`fatal` methods
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule, { logger: createNestJsonLogger() })
 * ```
 */
function createNestJsonLogger(): LoggerService {
  const nestLogger = createLogger({
    log: nestJsonHandler("info"),
    error: nestJsonHandler("error"),
    warn: nestJsonHandler("warn"),
    debug: nestJsonHandler("debug"),
    verbose: nestJsonHandler("verbose"),
    fatal: nestJsonHandler("fatal"),
  })

  return {
    log(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.log(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
    error(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.error(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
    warn(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.warn(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
    debug(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.debug(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
    verbose(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.verbose(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
    fatal(message: unknown, ...optionalParams: unknown[]) {
      nestLogger.fatal(asSupportedOutput(message), ...optionalParams.map(asSupportedOutput))
    },
  }
}

/**
 * The logger type produced by {@link createNestJsonLogger}.
 */
type NestJsonLogger = ReturnType<typeof createNestJsonLogger>

export { createNestJsonLogger, type NestJsonLogger }
