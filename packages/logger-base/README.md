# logger-base

A lightweight, type-safe logger with middleware support and contextual messages.

## Creating a Logger

```typescript
import { createLogger, isContextualMessage } from "@leancodepl/logger-base"

const logger = createLogger({
  info: (context, ...messages) => {
    console.log(messages.map(m => (isContextualMessage(m) ? m(context) : m)).join(" "))
  },
})

logger.info("Hello", "world") // "Hello world"
```

## Adding Context

Use `withContext` to add context values. Context accumulates across calls.

```typescript
const appLogger = logger.withContext({ appName: "MyApp" })
const requestLogger = appLogger.withContext({ requestId: "req-123" })
```

## Using Context in Messages

Messages can be functions that receive the current context.

```typescript
const userLogger = logger.withContext({ userId: "user-456" })

userLogger.info(({ userId }) => `User ${userId} logged in`)
// "User user-456 logged in"
```

## Adding Middleware

Use `withMiddleware` to wrap log methods. Middleware receives `next` (it is used to call a middleware from `logger` in
this case) and returns a new handler.

```typescript
const loggerWithPrefix = logger.withMiddleware({
  info:
    next =>
    (context, ...messages) => {
      next(context, "[INFO]", ...messages)
    },
})

loggerWithPrefix.info("test") // "[INFO] test"
```

## Modifying Context in Middleware

Middleware can modify context before passing to the next handler.

```typescript
const loggerWithTimestamp = logger.withMiddleware({
  info:
    next =>
    (context, ...messages) => {
      const newContext = { ...context, timestamp: Date.now() }
      next(newContext, ...messages)
    },
})
```

## Chaining Middleware

Middleware is applied in order, with later middleware being executed first, and passing its changes to the middleware
that was created before it.

```typescript
const logger2 = logger
  .withMiddleware({
    info:
      next =>
      (context, ...messages) => {
        next(context, "[1]", ...messages)
      },
  })
  .withMiddleware({
    info:
      next =>
      (context, ...messages) => {
        next(context, "[2]", ...messages)
      },
  })

logger2.info("test") // "[1] [2] test"
```

## Typing Functions

When passing a logger to functions, use `LoggerWithContext` for proper typing.

```typescript
import { LoggerWithContext, DefaultContext } from "@leancodepl/logger-base"

type AppLogger<TContext extends DefaultContext> = LoggerWithContext<TContext, typeof logger>

function handleRequest(log: AppLogger<{ requestId: string }>) {
  log.info(({ requestId }) => `Processing ${requestId}`)
}

const requestLogger = logger.withContext({ requestId: "req-789" })
handleRequest(requestLogger)
```

Provided types can also be used to type `createLogger` and `withMiddleware` functions arguments.

```typescript
import { createLogger, DefaultContext, LoggerMessage, MethodHandler, SupportedOutput } from "@leancodepl/logger-base"

function log(context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) {
  console.log(
    messages
      .map(m => {
        if (m instanceof Error) {
          return m.message
        }
        if (typeof m === "object" && m !== null) {
          return JSON.stringify(m)
        }
        return m
      })
      .join(" "),
  )
}

const logger = createLogger({
  info: log,
})

function infoMiddleWare(next: MethodHandler<SupportedOutput>) {
  return (context: DefaultContext, ...messages: LoggerMessage<DefaultContext, SupportedOutput>[]) => {
    next(context, "[INFO]", ...messages)
  }
}

const logger2 = logger.withMiddleware({
  info: infoMiddleWare,
})

logger2.info("test") // "[INFO] test"
```
