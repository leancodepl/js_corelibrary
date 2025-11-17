// Forbidden: import from sibling's nested child (should fail)
import { ActivityWizard } from "../../wizards/ActivityWizard"

export function SurveyEditor() {
  return <ActivityWizard />
}
