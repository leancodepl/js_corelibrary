# loggers

Pre-built loggers using `@leancodepl/logger-base`.

## CLI Logger

A colored console logger with log levels for CLI applications.

### Basic Usage

```typescript
import { createCliLogger } from "@leancodepl/loggers"

const logger = createCliLogger()

logger.info("Application started")
logger.success("Operation completed")
logger.warn("This is a warning")
logger.error("Something went wrong")
logger.debug("Debug information")
logger.verbose("Verbose output")
```

### Log Levels

Control which messages are shown by setting `enabledLogLevels` (array of levels to include):

```typescript
import { createCliLogger, allLogLevels, LogLevel } from "@leancodepl/loggers"

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
