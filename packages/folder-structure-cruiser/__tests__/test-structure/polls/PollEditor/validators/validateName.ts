export function validateName(name: string) {
  if (name.length < 3) {
    throw new Error("Name must be at least 3 characters long")
  }
}
