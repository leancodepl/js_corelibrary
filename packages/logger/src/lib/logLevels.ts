/**
 * Severity levels supported by the loggers, ordered from most to least severe.
 * Lower numeric values are more severe.
 */
enum LogLevel {
  Error = 0,
  Warn = 1,
  Success = 2,
  Info = 3,
  Verbose = 4,
  Debug = 5,
}

/**
 * Every {@link LogLevel} in severity order. Useful for building a logger method
 * per level.
 */
const allLogLevels = [LogLevel.Error, LogLevel.Warn, LogLevel.Success, LogLevel.Info, LogLevel.Verbose, LogLevel.Debug]

/**
 * Levels emitted by default by the logger presets: error, warn, success, and
 * info. Verbose and debug are excluded.
 */
const defaultEnabledLogLevels = [LogLevel.Error, LogLevel.Warn, LogLevel.Success, LogLevel.Info]

/**
 * Maps each {@link LogLevel} to its lowercase string label.
 */
const logLevelToLabel = {
  [LogLevel.Error]: "error",
  [LogLevel.Warn]: "warn",
  [LogLevel.Success]: "success",
  [LogLevel.Info]: "info",
  [LogLevel.Verbose]: "verbose",
  [LogLevel.Debug]: "debug",
} as const

/**
 * Union of the lowercase string labels for every {@link LogLevel}.
 */
type LogLevelLabel = (typeof logLevelToLabel)[keyof typeof logLevelToLabel]

/**
 * Returns whether a given level is present in the list of enabled levels.
 *
 * @param logLevel - The level to test
 * @param enabledLogLevels - The currently enabled levels
 * @returns `true` when `logLevel` is enabled
 */
function isLogLevelEnabled(logLevel: LogLevel, enabledLogLevels: LogLevel[]) {
  return enabledLogLevels.includes(logLevel)
}

export { allLogLevels, defaultEnabledLogLevels, isLogLevelEnabled, LogLevel, logLevelToLabel }
export type { LogLevelLabel }
