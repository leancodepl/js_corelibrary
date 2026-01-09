jest.mock("@inquirer/checkbox", () => ({
  default: jest.fn().mockResolvedValue(["testTerm1"]),
}))

jest.mock("@inquirer/confirm", () => ({
  default: jest.fn().mockResolvedValue(true),
}))