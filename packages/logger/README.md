# logger

A lightweight, type-safe logger with middleware support and contextual messages.

**Entry points:**

- **`@leancodepl/logger`** – Core API below (custom handlers, context, middleware).
- **`@leancodepl/logger/cli`** – Colored console preset with log levels: `createCliLogger`, `LogLevel`, `allLogLevels`.
- **`@leancodepl/logger/json`** – JSON lines to stdout: `createJsonLogger` with the same level options as CLI.
- **`@leancodepl/logger/nest`** – NestJS adapter: `createNestJsonLogger()` implementing `LoggerService` with JSON
  output.

## Installation

```bash
npm install @leancodepl/logger
# or
yarn add @leancodepl/logger
```

## API

### `createLogger(methods)`

Creates a logger from a map of method definitions. Each definition becomes a callable method on the returned logger, and
the logger starts with an empty context that can be extended via `withContext`.

**Parameters:**

- `methods: TDefs` - Map of method name to its `MethodHandler`

**Returns:** A logger exposing the defined methods plus `withContext` and `withMiddleware`.

```typescript
import { createLogger } from "@leancodepl/logger"

const logger = createLogger({
  info: (context, ...messages) => console.info(...messages),
})

logger.withContext({ requestId: "req-1" }).info("started")
```

### `isContextualMessage(message)`

Type guard that narrows a `LoggerMessage` to a `ContextualLoggerMessage`. Used by logger implementations to decide
whether a message must be invoked with the context or logged as-is.

**Parameters:**

- `message: LoggerMessage<TContext, TOutput>` - The message to inspect

**Returns:** `true` when the message is a context-consuming function.

```typescript
import { isContextualMessage } from "@leancodepl/logger"

const resolved = isContextualMessage(message) ? message(context) : message
```

### `createCliLogger(options)`

Creates a logger preset for command-line output. Each log level maps to the matching `console` method and is prefixed
with a colorized `[LEVEL]` label via middleware. Messages below the enabled threshold are skipped.

**Parameters:**

- `options?: { enabledLogLevels?: LogLevel[] }` - Levels that should be emitted; defaults to `defaultEnabledLogLevels`
  (error, warn, success, info)

**Returns:** A logger with one method per `LogLevel` label.

```typescript
import { createCliLogger } from "@leancodepl/logger/cli"

const logger = createCliLogger()
logger.info("server started")
logger.error("something failed", new Error("boom"))
```

### `createJsonLogger(options)`

Creates a logger preset that writes one JSON object per line to `process.stdout`. Each entry includes the level label,
an ISO timestamp, the joined message, and the context (when non-empty). `Error` values are serialized to
`{ message, stack }`. Messages below the enabled threshold are skipped.

**Parameters:**

- `options?: { enabledLogLevels?: LogLevel[] }` - Levels that should be emitted; defaults to `defaultEnabledLogLevels`
  (error, warn, success, info)

**Returns:** A logger with one method per `LogLevel` label.

```typescript
import { createJsonLogger } from "@leancodepl/logger/json"

const logger = createJsonLogger()
logger.withContext({ requestId: "req-1" }).info("request handled")
// {"level":"info","timestamp":"...","message":"request handled","context":{"requestId":"req-1"}}
```

### `createNestJsonLogger()`

Creates a NestJS-compatible `LoggerService` that emits one JSON object per line to `process.stdout`. When the final
optional parameter is a string, it is treated as Nest's `context` argument and recorded separately; remaining params are
joined into the message, with `Error` values reduced to their message.

**Returns:** A logger implementing Nest's `log`/`error`/`warn`/`debug`/`verbose`/`fatal` methods.

```typescript
import { createNestJsonLogger } from "@leancodepl/logger/nest"

const app = await NestFactory.create(AppModule, { logger: createNestJsonLogger() })
```

### `isLogLevelEnabled(logLevel, enabledLogLevels)`

Returns whether a given level is present in the list of enabled levels.

**Parameters:**

- `logLevel: LogLevel` - The level to test
- `enabledLogLevels: LogLevel[]` - The currently enabled levels

**Returns:** `true` when `logLevel` is enabled.

```typescript
import { isLogLevelEnabled, LogLevel, defaultEnabledLogLevels } from "@leancodepl/logger"

isLogLevelEnabled(LogLevel.Debug, defaultEnabledLogLevels) // false
```

### Exported values and types

- `LogLevel` - Severity levels enum, ordered from most to least severe (lower numeric value is more severe): `Error`
  (0), `Warn` (1), `Success` (2), `Info` (3), `Verbose` (4), `Debug` (5).
- `allLogLevels: LogLevel[]` - Every `LogLevel` in severity order.
- `defaultEnabledLogLevels: LogLevel[]` - Levels emitted by default by the presets: error, warn, success, and info.
- `logLevelToLabel` - Maps each `LogLevel` to its lowercase string label.
- `SupportedOutput` - The value types a logger method can accept and emit: `boolean | number | object | string`.
- `DefaultContext` - Default shape of a logger's context: `Record<string, unknown>`.
- `LoggerMessage<TContext, TOutput>` - A log argument: either a plain value or a function deriving the value from
  context.
- `MethodHandler<TOutput>` - Low-level handler backing a single log method; receives the resolved context as its first
  argument.
- `Logger<TContext, TDefs>` - A fully built logger: its methods plus `withMiddleware` and `withContext`.
- `LoggerWithContext<TContext, TLogger>` - Re-derives a built logger's public shape for a given context; use it to type
  values that hold a logger.
- `CliLogger`, `JsonLogger`, `NestJsonLogger` - The logger types produced by the respective preset factories.
- `LoggerService` - Subset of the NestJS `LoggerService` interface implemented by `createNestJsonLogger`.

## Usage Examples

### Creating a Logger

```typescript
import { createLogger, isContextualMessage } from "@leancodepl/logger"

const logger = createLogger({
  info: (context, ...messages) => {
    console.log(messages.map(m => (isContextualMessage(m) ? m(context) : m)).join(" "))
  },
})

logger.info("Hello", "world") // "Hello world"
```

### Adding Context

Use `withContext` to add context values. Context accumulates across calls.

```typescript
const appLogger = logger.withContext({ appName: "MyApp" })
const requestLogger = appLogger.withContext({ requestId: "req-123" })
```

### Using Context in Messages

Messages can be functions that receive the current context.

```typescript
const userLogger = logger.withContext({ userId: "user-456" })

userLogger.info(({ userId }) => `User ${userId} logged in`)
// "User user-456 logged in"
```

### Adding Middleware

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

### Modifying Context in Middleware

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

### Chaining Middleware

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

### Typing Functions

When passing a logger to functions, use `LoggerWithContext` for proper typing.

```typescript
import { LoggerWithContext, DefaultContext } from "@leancodepl/logger"

type AppLogger<TContext extends DefaultContext> = LoggerWithContext<TContext, typeof logger>

function handleRequest(log: AppLogger<{ requestId: string }>) {
  log.info(({ requestId }) => `Processing ${requestId}`)
}

const requestLogger = logger.withContext({ requestId: "req-789" })
handleRequest(requestLogger)
```

Provided types can also be used to type `createLogger` and `withMiddleware` functions arguments.

```typescript
import { createLogger, DefaultContext, LoggerMessage, MethodHandler, SupportedOutput } from "@leancodepl/logger"

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

---

## CLI preset (`@leancodepl/logger/cli`)

Colored console logger with log levels for CLI applications.

### Basic usage

```typescript
import { createCliLogger } from "@leancodepl/logger/cli"

const logger = createCliLogger()

logger.info("Application started")
logger.success("Operation completed")
logger.warn("This is a warning")
logger.error("Something went wrong")
logger.debug("Debug information")
logger.verbose("Verbose output")
```

### Log levels

Control which messages are shown by setting `enabledLogLevels` (array of levels to include):

```typescript
import { createCliLogger, allLogLevels, LogLevel } from "@leancodepl/logger/cli"

// Only show errors and warnings
const quietLogger = createCliLogger({ enabledLogLevels: [LogLevel.Error, LogLevel.Warn] })

// Show everything including debug and verbose
const verboseLogger = createCliLogger({ enabledLogLevels: allLogLevels })
```

Available log levels (from least to most verbose):

- `LogLevel.Error` (0) - Only errors
- `LogLevel.Warn` (1) - Errors and warnings
- `LogLevel.Success` (2) - Errors, warnings, and success
- `LogLevel.Info` (3) - Errors, warnings, success, and info (default)
- `LogLevel.Verbose` (4) - All above plus verbose
- `LogLevel.Debug` (5) - Everything

### Adding context

Use `withContext` to add contextual information:

```typescript
const logger = createCliLogger()
const requestLogger = logger.withContext({ requestId: "req-123" })

requestLogger.info(({ requestId }) => `Processing request ${requestId}`)
```

### Adding middleware

Use `withMiddleware` to customize logging behavior:

```typescript
const logger = createCliLogger()

const timedLogger = logger.withMiddleware({
  info:
    next =>
    (context, ...messages) => {
      next(context, `[${new Date().toISOString()}]`, ...messages)
    },
})
```

---

## JSON preset (`@leancodepl/logger/json`)

Logger that writes one JSON object per line to stdout (level, timestamp, msg, optional context). Same log levels and
`enabledLogLevels` option as the CLI preset.

```typescript
import { createJsonLogger, allLogLevels, LogLevel } from "@leancodepl/logger/json"

const logger = createJsonLogger()
logger.info("Request completed") // {"level":"info","timestamp":"...","msg":"Request completed"}

const quiet = createJsonLogger({ enabledLogLevels: [LogLevel.Error, LogLevel.Warn] })
const verbose = createJsonLogger({ enabledLogLevels: allLogLevels })
```

Supports `withContext` and `withMiddleware` like the base logger.

---

## Nest preset (`@leancodepl/logger/nest`)

NestJS `LoggerService` implementation that outputs JSON (same shape as the JSON preset). Use as a drop-in logger in Nest
apps.

```typescript
import { createNestJsonLogger, type LoggerService } from "@leancodepl/logger/nest"

const logger: LoggerService = createNestJsonLogger()
logger.log("Application started")
logger.error("Something went wrong", "MyService")
```

If the last argument is a string, it is used as the `context` field in the JSON output (same behavior as Nest’s built-in
logger).
