import { beforeEach, describe, expect, it, vi } from "vitest"
import { allLogLevels, createCliLogger, LogLevel } from "./cliLogger"

describe("cliLogger", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("should only log errors when log level is Error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {})
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    const logger = createCliLogger({ enabledLogLevels: [LogLevel.Error] })

    logger.error("error")
    logger.warn("warn")
    logger.success("success")
    logger.info("info")
    logger.verbose("verbose")
    logger.debug("debug")

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).not.toHaveBeenCalled()
    expect(infoSpy).not.toHaveBeenCalled()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("should log all levels when log level is Debug", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {})
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {})

    const logger = createCliLogger({ enabledLogLevels: allLogLevels })

    logger.error("error")
    logger.warn("warn")
    logger.success("success")
    logger.info("info")
    logger.verbose("verbose")
    logger.debug("debug")

    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledTimes(3) // success + verbose + debug
  })
})
