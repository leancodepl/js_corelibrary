/* eslint-disable import/no-extraneous-dependencies */
import { vi } from "vitest"

vi.mock("@inquirer/checkbox", () => ({
  default: vi.fn().mockResolvedValue(["testTerm1"]),
}))

vi.mock("@inquirer/confirm", () => ({
  default: vi.fn().mockResolvedValue(true),
}))
