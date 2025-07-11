// Allowed: import from direct sibling index
import { ActivityWizard } from "../../wizards"
import { ActivityEditor } from "../ActivityEditor"
// Allowed: import from own child (same feature)
import { validateDescription } from "./validators"
import { validateName } from "./validators/validateName"

export function PollEditor() {
    validateDescription("test")
    validateName("test")

    return (
        <>
            <ActivityWizard />
            <ActivityEditor />
        </>
    )
}
