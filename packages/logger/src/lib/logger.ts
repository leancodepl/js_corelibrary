/**
 * The set of value types a logger method can accept and emit.
 *
 * The `unknown` member was intentionally dropped: a union containing `unknown`
 * collapses to `unknown`, which silently widened every output type and defeated
 * the generic inference the logger relies on. The remaining members cover every
 * value the built-in loggers produce (strings, numbers, booleans, and arbitrary
 * objects — including serialized `Error`s).
 */
type SupportedOutput = boolean | number | object | string

/**
 * Default shape of the contextual data carried by a logger. Any object keyed by
 * string is accepted; richer context types narrow this via the generic
 * parameters on {@link Logger} and {@link createLogger}.
 */
type DefaultContext = Record<string, unknown>

/**
 * A message that is computed lazily from the logger's current context. Receives
 * the context and returns the value to log, so the value can depend on whatever
 * context was attached via {@link Logger.withContext}.
 *
 * @template TContext - The context shape passed to the message factory
 * @template TOutput - The value type the factory produces
 */
type ContextualLoggerMessage<TContext extends DefaultContext, TOutput = SupportedOutput> = (
  context: TContext,
) => TOutput

/**
 * A single argument accepted by a log method: either a plain value to log or a
 * {@link ContextualLoggerMessage} that derives the value from the context.
 *
 * @template TContext - The context shape available to contextual messages
 * @template TOutput - The value type produced
 */
type LoggerMessage<TContext extends DefaultContext = DefaultContext, TOutput extends SupportedOutput = string> =
  | ContextualLoggerMessage<TContext, TOutput>
  | TOutput

/**
 * Call signature of a log method on a built logger. Accepts any number of
 * messages (plain or contextual) and returns nothing.
 *
 * @template TContext - The context shape available to contextual messages
 * @template TOutput - The value type each message produces
 */
interface LogMethod<TContext extends DefaultContext = DefaultContext, TOutput extends SupportedOutput = string> {
  (...messages: LoggerMessage<TContext, TOutput>[]): void
}

/**
 * Low-level handler backing a single log method. Unlike {@link LogMethod}, it
 * receives the resolved context explicitly as its first argument, which is what
 * lets middleware wrap and transform it.
 *
 * @template TOutput - The value type each message produces
 */
type MethodHandler<TOutput extends SupportedOutput = string> = (
  context: DefaultContext,
  ...messages: LoggerMessage<DefaultContext, TOutput>[]
) => void

/**
 * Map of method name to {@link MethodHandler}. This is the definition object
 * passed to {@link createLogger} to describe the methods a logger exposes.
 *
 * @template TOutput - The value type each handler produces
 */
type MethodDefinitions<TOutput extends SupportedOutput = string> = Record<string, MethodHandler<TOutput>>

type MethodsFromDefinitions<TContext extends DefaultContext, TDefs extends MethodDefinitions<SupportedOutput>> = {
  [K in keyof TDefs]: TDefs[K] extends MethodHandler<infer TOutput> ? LogMethod<TContext, TOutput> : never
}

/**
 * A middleware wrapping a {@link MethodHandler}. Given the next handler in the
 * chain, it returns a new handler, allowing it to transform the context or
 * messages before (or after) delegating to `next`.
 *
 * @template TOutput - The value type the wrapped handler produces
 */
type Middleware<TOutput extends SupportedOutput = string> = (next: MethodHandler<TOutput>) => MethodHandler<TOutput>

type MiddlewaresFor<TDefs extends MethodDefinitions<SupportedOutput>> = {
  [K in keyof TDefs]?: TDefs[K] extends MethodHandler<infer TOutput> ? Middleware<TOutput> : never
}

/**
 * A fully built logger: every method from its definitions plus the
 * {@link Logger.withMiddleware} and {@link Logger.withContext} combinators for
 * deriving new loggers.
 *
 * @template TContext - The context shape carried by this logger
 * @template TDefs - The method definitions backing this logger
 */
type Logger<TContext extends DefaultContext, TDefs extends MethodDefinitions<SupportedOutput>> = MethodsFromDefinitions<
  TContext,
  TDefs
> & {
  /**
   * Returns a new logger whose listed methods are wrapped by the given
   * middleware. Methods not listed are left untouched, and the original logger
   * is not modified.
   */
  withMiddleware: (middlewares: MiddlewaresFor<TDefs>) => Logger<TContext, TDefs>
  /**
   * Returns a new logger with `context` merged into the existing context. The
   * original logger is not modified, so derived loggers can be created freely.
   */
  withContext: <TNewContext extends DefaultContext>(context: TNewContext) => Logger<TContext & TNewContext, TDefs>
}

type ExtractMethodDefs<T> = {
  [K in keyof T as K extends "withContext" | "withMiddleware"
    ? never
    : T[K] extends LogMethod<DefaultContext, SupportedOutput>
      ? K
      : never]: T[K] extends LogMethod<DefaultContext, infer TOutput> ? MethodHandler<TOutput> : never
}

/**
 * Re-derives a logger's public shape for a given context from the logger type
 * itself (rather than from its method definitions). Useful for typing values
 * that hold an already-built logger while preserving its method signatures and
 * the {@link Logger.withMiddleware} / {@link Logger.withContext} combinators.
 *
 * @template TContext - The context shape to expose
 * @template TLogger - The source logger type to extract methods from
 */
type LoggerWithContext<TContext extends DefaultContext, TLogger> = {
  [K in keyof ExtractMethodDefs<TLogger>]: ExtractMethodDefs<TLogger>[K] extends MethodHandler<infer TOutput>
    ? LogMethod<TContext, TOutput>
    : never
} & {
  withMiddleware: (middlewares: {
    [K in keyof ExtractMethodDefs<TLogger>]?: ExtractMethodDefs<TLogger>[K] extends MethodHandler<infer TOutput>
      ? Middleware<TOutput>
      : never
  }) => LoggerWithContext<TContext, TLogger>
  withContext: <TNewContext extends DefaultContext>(
    context: TNewContext,
  ) => LoggerWithContext<TContext & TNewContext, TLogger>
}

/**
 * Type guard that narrows a {@link LoggerMessage} to a
 * {@link ContextualLoggerMessage}. Used by logger implementations to decide
 * whether a message must be invoked with the context or logged as-is.
 *
 * @template TContext - The context shape available to contextual messages
 * @template TOutput - The value type produced
 * @param message - The message to inspect
 * @returns `true` when the message is a context-consuming function
 * @example
 * ```typescript
 * const resolved = isContextualMessage(message) ? message(context) : message
 * ```
 */
function isContextualMessage<TContext extends DefaultContext, TOutput extends SupportedOutput>(
  message: LoggerMessage<TContext, TOutput>,
): message is ContextualLoggerMessage<TContext, TOutput> {
  return typeof message === "function"
}

/**
 * Creates a logger from a map of method definitions. Each definition becomes a
 * callable method on the returned logger, and the logger starts with an empty
 * context that can be extended via {@link Logger.withContext}.
 *
 * @template TDefs - The method definitions backing the logger
 * @param methods - Map of method name to its {@link MethodHandler}
 * @returns A logger exposing the defined methods plus `withContext` and `withMiddleware`
 * @example
 * ```typescript
 * const logger = createLogger({
 *   info: (context, ...messages) => console.info(...messages),
 * })
 *
 * logger.withContext({ requestId: "req-1" }).info("started")
 * ```
 */
function createLogger<TDefs extends MethodDefinitions<SupportedOutput>>(methods: TDefs): Logger<{}, TDefs> {
  return buildLogger({}, methods)
}

function buildLogger<TContext extends DefaultContext, TDefs extends MethodDefinitions<SupportedOutput>>(
  context: TContext,
  methods: TDefs,
): Logger<TContext, TDefs> {
  const handlers = { ...methods }
  const logger = {} as Logger<TContext, TDefs>

  for (const key of Object.keys(handlers)) {
    Object.defineProperty(logger, key, {
      value: (...messages: LoggerMessage<TContext, SupportedOutput>[]) => {
        handlers[key]?.(context, ...messages)
      },
      enumerable: true,
      configurable: true,
    })
  }

  logger.withMiddleware = (middlewares: MiddlewaresFor<TDefs>): Logger<TContext, TDefs> => {
    const newHandlers: MethodDefinitions<SupportedOutput> = { ...handlers }

    for (const key of Object.keys(middlewares)) {
      const middleware = middlewares[key as keyof typeof middlewares]
      const existingHandler = handlers[key]
      if (middleware && existingHandler) {
        newHandlers[key] = middleware(existingHandler)
      }
    }

    return buildLogger(context, newHandlers as TDefs)
  }

  logger.withContext = <TNewContext extends DefaultContext>(
    newContext: TNewContext,
  ): Logger<TContext & TNewContext, TDefs> => buildLogger({ ...context, ...newContext }, handlers)

  return logger
}

export { createLogger, isContextualMessage }
export type { DefaultContext, Logger, LoggerMessage, LoggerWithContext, MethodHandler, SupportedOutput }
