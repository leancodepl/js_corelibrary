// Forbidden: import from sibling's nested child
import { SurveyEditor } from "../../surveys/SurveyEditor"
import { PollHeader } from "../PollEditor/PollHeader"

export function SnapshotPollEditor() {
    return (
        <>
            <PollHeader />
            <SurveyEditor />
        </>
    )
}
