import { beforeEach, describe, expect, it } from "vitest"
import { createLogger, isContextualMessage } from "./logger"

describe("logger", () => {
  let output: string[]

  const createTestLogger = () =>
    createLogger({
      info: (context, ...messages) => {
        output.push(
          messages
            .map(m => (isContextualMessage(m) ? m(context) : m))
            .map(m => {
              if (typeof m === "object" && m !== null) {
                return JSON.stringify(m)
              }
              return m
            })
            .join(" "),
        )
      },
      error: (context, ...messages) => {
        output.push(
          messages
            .map(m => (isContextualMessage(m) ? m(context) : m))
            .map(m => {
              if (m instanceof Error) {
                return m.message
              }
              return m
            })
            .join(" "),
        )
      },
    })

  beforeEach(() => {
    output = []
  })

  it("should log simple messages", () => {
    const logger = createTestLogger()

    logger.info("[logger]", "test")

    expect(output).toEqual(["[logger] test"])
  })

  it("should handle Error objects", () => {
    const logger = createTestLogger()

    logger.error("[logger]", new Error("test error"))

    expect(output).toEqual(["[logger] test error"])
  })

  it("should handle objects by stringifying them", () => {
    const logger = createTestLogger()

    logger.info("[logger]", { test: "test" })

    expect(output).toEqual(['[logger] {"test":"test"}'])
  })

  it("should handle contextual messages", () => {
    const logger = createTestLogger().withContext({ userId: "user-1", requestId: "req-1" })

    logger.info(({ userId, requestId }) => `User ${userId} in ${requestId}`)

    expect(output).toEqual(["User user-1 in req-1"])
  })

  it("should update context with withContext", () => {
    const logger = createTestLogger().withContext({ userId: "user-1", requestId: "" })
    const logger2 = logger.withContext({ userId: "user-2", requestId: "req-1" })

    logger2.info(({ userId, requestId }) => `User ${userId} in ${requestId}`)

    expect(output).toEqual(["User user-2 in req-1"])
  })

  it("should apply middleware that modifies context", () => {
    const logger = createTestLogger().withContext({ userId: "user-2", requestId: "req-1", contextFromPrev: false })
    const logger2 = logger.withMiddleware({
      info:
        next =>
        (context, ...messages) => {
          const newContext = { ...context, userId: "user-3" }
          next(newContext, ...messages, `[contextFromPrev: ${context["contextFromPrev"]}]`)
        },
    })

    logger2.info(({ userId, requestId }) => `User ${userId} in ${requestId}`)

    expect(output).toEqual(["User user-3 in req-1 [contextFromPrev: false]"])
  })

  it("should chain multiple middlewares", () => {
    const logger = createTestLogger().withContext({ userId: "user-2", requestId: "req-1", contextFromPrev: false })
    const logger2 = logger.withMiddleware({
      info:
        next =>
        (context, ...messages) => {
          const newContext = { ...context, userId: "user-3" }
          next(newContext, ...messages, `[contextFromPrev: ${context["contextFromPrev"]}]`)
        },
    })
    const logger3 = logger2.withMiddleware({
      info:
        next =>
        (context, ...messages) => {
          const newContext = { ...context, contextFromPrev: true }
          next(newContext, ...messages)
        },
    })

    logger3.info(({ userId, requestId }) => `User ${userId} in ${requestId}`)

    expect(output).toEqual(["User user-3 in req-1 [contextFromPrev: true]"])
  })

  it("should not affect original logger when creating derived loggers", () => {
    const logger = createTestLogger().withContext({ userId: "user-1", requestId: "" })
    const logger2 = logger.withContext({ userId: "user-2", requestId: "req-1" })

    logger.info(({ userId }) => `Original: ${userId}`)
    logger2.info(({ userId }) => `Derived: ${userId}`)

    expect(output).toEqual(["Original: user-1", "Derived: user-2"])
  })
})
