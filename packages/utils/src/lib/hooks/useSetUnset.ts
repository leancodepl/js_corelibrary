"use client"

import { Dispatch, SetStateAction, useCallback } from "react"

/**
 * React hook for boolean state management helpers.
 *
 * @param set - The state setter function from useState
 * @returns A tuple containing [setTrue: function, setFalse: function]
 * @example
 * ```typescript
 * function MyComponent() {
 *   const [isVisible, setIsVisible] = useState(false);
 *   const [show, hide] = useSetUnset(setIsVisible);
 *
 *   return (
 *     <div>
 *       <button onClick={show}>Show</button>
 *       <button onClick={hide}>Hide</button>
 *       {isVisible && <div>Content is visible</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSetUnset(set: Dispatch<SetStateAction<boolean>>) {
  return [useCallback(() => set(true), [set]), useCallback(() => set(false), [set])] as const
}
