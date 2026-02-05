# loggers

Pre-built loggers using `@leancodepl/logger-base`.

## CLI Logger

A colored console logger with log levels for CLI applications.

### Basic Usage

```typescript
import { createCliLogger } from "@leancodepl/loggers"

const logger = createCliLogger()

logger.info("Application started")
logger.warn("This is a warning")
logger.error("Something went wrong")
logger.debug("Debug information")
logger.verbose("Verbose output")
```

### Log Levels

Control which messages are shown by setting the log level:

```typescript
import { createCliLogger, LogLevel } from "@leancodepl/loggers"

// Only show errors and warnings
const quietLogger = createCliLogger({ logLevel: LogLevel.Warn })

// Show everything including debug
const verboseLogger = createCliLogger({ logLevel: LogLevel.Debug })
```

Available log levels (from least to most verbose):

- `LogLevel.Error` (0) - Only errors
- `LogLevel.Warn` (1) - Errors and warnings
- `LogLevel.Info` (2) - Errors, warnings, and info (default)
- `LogLevel.Verbose` (3) - All above plus verbose
- `LogLevel.Debug` (4) - Everything

### Adding Context

Use `withContext` to add contextual information:

```typescript
const logger = createCliLogger()
const requestLogger = logger.withContext({ requestId: "req-123" })

requestLogger.info(({ requestId }) => `Processing request ${requestId}`)
```

### Adding Middleware

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
