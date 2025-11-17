import { listenOnForceUpdate } from "../src"
import { mockVersionEndpoint } from "./_utils"

jest.mock("rxjs/internal/ajax/ajax")

const versionCheckIntervalPeriod = 1000

describe("listenOnForceUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should notify when version changes", () => {
    mockVersionEndpoint(["1.0.0", "1.0.0", "1.0.1"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).toHaveBeenCalledTimes(1)

    cleanup()
  })

  it("should not notify when version stays the same", () => {
    mockVersionEndpoint(["1.0.0", "1.0.0", "1.0.0"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).not.toHaveBeenCalled()

    cleanup()
  })

  it("should not notify when network error occurs and initial version is fetched", () => {
    mockVersionEndpoint(["1.0.0", "1.0.0", null])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).not.toHaveBeenCalled()

    cleanup()
  })

  it("should notify when network errors occur, but new version is fetched eventually", () => {
    mockVersionEndpoint(["1.0.0", null, null, "1.0.1"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).toHaveBeenCalledTimes(1)

    cleanup()
  })

  it("should notify when initial version is not fetched initially, but fetched eventually", () => {
    mockVersionEndpoint([null, null, "1.0.0", "1.0.1"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).toHaveBeenCalledTimes(1)

    cleanup()
  })

  it("should notify only once when version changes", () => {
    mockVersionEndpoint(["1.0.0", "1.0.1", "1.0.2"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).toHaveBeenCalledTimes(1)

    cleanup()
  })

  it("should not notify when unsubscribed", () => {
    mockVersionEndpoint(["1.0.0", "1.0.1"])

    const onNewVersionAvailable = jest.fn()

    const cleanup = listenOnForceUpdate({
      onNewVersionAvailable,
      versionCheckIntervalPeriod,
    })

    cleanup()

    jest.advanceTimersByTime(5000)

    expect(onNewVersionAvailable).not.toHaveBeenCalled()
  })
})
