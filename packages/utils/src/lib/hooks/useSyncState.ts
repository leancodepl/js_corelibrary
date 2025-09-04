import { useState } from "react"

/**
 * Synchronizes external state changes with a callback function, calling the callback only when state actually changes.
 *
 * @param state - The current state value to monitor for changes
 * @param onChange - Callback function executed when state changes
 * @param compare - Optional comparison function to determine if state has changed (defaults to strict equality)
 * @example
 * ```typescript
 * import { useSyncState } from "@leancodepl/utils";
 *
 * function MyComponent({ externalValue }: { externalValue: string }) {
 *   useSyncState(externalValue, (newValue) => {
 *     console.log('Value changed to:', newValue);
 *   });
 *
 *   return <div>{externalValue}</div>;
 * }
 * ```
 */
export function useSyncState<T>(state: T, onChange: (state: T) => void, compare?: (a: T, b: T) => boolean) {
  const [prevState, setPrevState] = useState(state)

  const hasChanged = compare ? !compare(state, prevState) : state !== prevState

  if (hasChanged) {
    setPrevState(state)
    onChange(state)
  }
}
