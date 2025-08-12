import { Footer } from "../../activities/Footer"
import { ActivityWizard } from "../../wizards"
import { ActivityEditor } from "../ActivityEditor"
import { validateDescription } from "./validators"
import { validateName } from "./validators/validateName"

export function PollEditor() {
  validateDescription("test")
  validateName("test")

  return (
    <>
      <ActivityWizard />
      <ActivityEditor />
      <Footer />
    </>
  )
}
