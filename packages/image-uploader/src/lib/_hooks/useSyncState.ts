import { useState } from "react"

export function useSyncState<T>(state: T, onChange: (state: T) => void) {
  const [prevState, setPrevState] = useState(state)

  if (state !== prevState) {
    setPrevState(state)
    onChange(state)
  }
}
