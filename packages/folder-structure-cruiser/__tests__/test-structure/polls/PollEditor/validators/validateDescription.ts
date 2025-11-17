export function validateDescription(description: string) {
  if (description.length < 3) {
    throw new Error("Description must be at least 3 characters long")
  }
}
