import { join } from "node:path"
import { MockInstance } from "vitest"
import { validateSharedComponent } from "../src/commands/validateSharedComponent"
import { checkSharedComponents } from "../src/lib/checkSharedComponents"
import { getCruiseResult } from "../src/lib/getCruiseResult"

describe("shared-components validation", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>
  let consoleInfoSpy: MockInstance<typeof console.info>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(globalThis.console, "error").mockImplementation(() => {})
    consoleInfoSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {})
  })

  afterEach(() => {
    consoleInfoSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  it("should not flag a components as shared to be moved", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const filePath = join(testDir, "surveys/SurveyEditor/index.tsx")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const violationsCount = await validateSharedComponent({
      directories: [filePath],
      configPath: configPath,
    })

    expect(violationsCount).toBe(0)
    expect(consoleInfoSpy).not.toHaveBeenCalledWith(expect.anything(), expect.stringContaining("not-shared-level"))
  })

  it("should flag shared components to be moved", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const violationsCount = await validateSharedComponent({
      directories: [testDir],
      configPath: configPath,
    })

    expect(violationsCount).toBe(0)
    expect(consoleInfoSpy).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("not-shared-level"))
  })

  it("should suggest using the barrel for a component imported directly past its own barrel", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const { messages } = checkSharedComponents(await getCruiseResult({ directories: [testDir], configPath }))

    const validateName = messages.find(
      message =>
        message.rule === "not-shared-level" &&
        message.component.endsWith("polls/PollEditor/validators/validateName.ts"),
    )

    expect(validateName).toMatchObject({
      remedy: {
        kind: "use-barrel",
        barrel: expect.stringContaining("polls/PollEditor/validators/index.ts"),
      },
    })
  })

  it("should suggest using the barrel when an ancestor barrel re-exports a grandchild", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const { messages } = checkSharedComponents(await getCruiseResult({ directories: [testDir], configPath }))

    const util = messages.find(
      message => message.rule === "not-shared-level" && message.component.endsWith("buckets/deep/util.ts"),
    )

    expect(util).toMatchObject({
      remedy: {
        kind: "use-barrel",
        barrel: expect.stringContaining("buckets/index.ts"),
      },
    })
  })

  it("should suggest moving a component imported only from outside its folder", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const { messages } = checkSharedComponents(await getCruiseResult({ directories: [testDir], configPath }))

    const footer = messages.find(
      message => message.rule === "not-shared-level" && message.component.endsWith("activities/Footer/index.tsx"),
    )

    expect(footer).toMatchObject({ remedy: { kind: "move" } })
  })

  it("should not flag a shared component placed correctly behind an opaque directory", async () => {
    const dirname = import.meta.dirname
    const testDir = join(dirname, "test-structure")
    const configPath = join(dirname, "../.dependency-cruiser.json")

    const violationsCount = await validateSharedComponent({
      directories: [testDir],
      configPath: configPath,
    })

    expect(violationsCount).toBe(0)
    expect(consoleInfoSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining("gadgets/shared_/Widget"),
    )
  })
})
