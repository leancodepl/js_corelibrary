import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"

type ValueContextData<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>]

type ProviderProps<T> = {
  children?: ReactNode
  initialValue?: T
}

/**
 * Creates a React context hook for managing optional state values with Provider and setter utilities.
 * Returns a hook with attached Provider component and set function for declarative value management.
 *
 * @returns Hook function with attached Provider component and set function
 * @example
 * ```typescript
 * import { mkValueContext } from "@leancodepl/utils";
 *
 * const useTheme = mkValueContext<string>();
 *
 * function App() {
 *   return (
 *     <useTheme.Provider initialValue="dark">
 *       <ThemeConsumer />
 *     </useTheme.Provider>
 *   );
 * }
 *
 * function ThemeConsumer() {
 *   const [theme] = useTheme();
 *   return <div>Current theme: {theme}</div>;
 * }
 * ```
 * @example
 * ```typescript
 * // Using set to declaratively set context value
 * const useActiveUser = mkValueContext<string>();
 *
 * function UserProfile({ userId }: { userId: string }) {
 *   useActiveUser.set(userId); // Sets value on mount, clears on unmount
 *   return <div>Profile content</div>;
 * }
 *
 * function UserBadge() {
 *   const [activeUserId] = useActiveUser();
 *   return <div>Active user: {activeUserId}</div>;
 * }
 * ```
 */
export function mkValueContext<T>() {
  const valueContext = createContext<ValueContextData<T>>([undefined, () => void 0])

  function useValueContext() {
    return useContext(valueContext)
  }

  useValueContext.Provider = function ValueContextProvider({ children, initialValue }: ProviderProps<T>) {
    const contextValue = useState(initialValue)

    return <valueContext.Provider value={contextValue}>{children}</valueContext.Provider>
  }

  useValueContext.set = function useSetter(value: T | undefined) {
    const [, setValue] = useValueContext()

    useEffect(() => void setValue(value), [setValue, value])
    useEffect(() => () => setValue(undefined), [setValue])
  }

  return useValueContext
}
