import { Footer } from "../../activities/Footer"
import { SurveyEditor } from "../../surveys/SurveyEditor"
import { PollHeader } from "../PollEditor/PollHeader"

export function SnapshotPollEditor() {
  return (
    <>
      <PollHeader />
      <SurveyEditor />
      <Footer />
    </>
  )
}
