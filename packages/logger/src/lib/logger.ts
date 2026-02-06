type SupportedOutput = boolean | number | object | string | unknown

type DefaultContext = Record<string, unknown>

type ContextualLoggerMessage<TContext extends DefaultContext, TOutput = SupportedOutput> = (
  context: TContext,
) => TOutput

type LoggerMessage<TContext extends DefaultContext = DefaultContext, TOutput extends SupportedOutput = string> =
  | ContextualLoggerMessage<TContext, TOutput>
  | TOutput

interface LogMethod<TContext extends DefaultContext = DefaultContext, TOutput extends SupportedOutput = string> {
  (...messages: LoggerMessage<TContext, TOutput>[]): void
}

type MethodHandler<TOutput extends SupportedOutput = string> = (
  context: DefaultContext,
  ...messages: LoggerMessage<DefaultContext, TOutput>[]
) => void

type MethodDefinitions<TOutput extends SupportedOutput = string> = Record<string, MethodHandler<TOutput>>

type MethodsFromDefinitions<TContext extends DefaultContext, TDefs extends MethodDefinitions<SupportedOutput>> = {
  [K in keyof TDefs]: TDefs[K] extends MethodHandler<infer TOutput> ? LogMethod<TContext, TOutput> : never
}

type Middleware<TOutput extends SupportedOutput = string> = (next: MethodHandler<TOutput>) => MethodHandler<TOutput>

type MiddlewaresFor<TDefs extends MethodDefinitions<SupportedOutput>> = {
  [K in keyof TDefs]?: TDefs[K] extends MethodHandler<infer TOutput> ? Middleware<TOutput> : never
}

type Logger<TContext extends DefaultContext, TDefs extends MethodDefinitions<SupportedOutput>> = MethodsFromDefinitions<
  TContext,
  TDefs
> & {
  withMiddleware: (middlewares: MiddlewaresFor<TDefs>) => Logger<TContext, TDefs>
  withContext: <TNewContext extends DefaultContext>(context: TNewContext) => Logger<TContext & TNewContext, TDefs>
}

type ExtractMethodDefs<T> = {
  [K in keyof T as K extends "withContext" | "withMiddleware"
    ? never
    : T[K] extends LogMethod<DefaultContext, SupportedOutput>
      ? K
      : never]: T[K] extends LogMethod<DefaultContext, infer TOutput> ? MethodHandler<TOutput> : never
}

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

function isContextualMessage<TContext extends DefaultContext, TOutput extends SupportedOutput>(
  message: LoggerMessage<TContext, TOutput>,
): message is ContextualLoggerMessage<TContext, TOutput> {
  return typeof message === "function"
}

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
        handlers[key](context, ...messages)
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
