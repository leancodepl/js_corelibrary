"use client"

import { useMemo } from "react"
import { Unpromisify } from "../types"
import { useRunInTask } from "./useRunInTask"

type AnyFunction = (...args: any[]) => any

/**
 * React hook for bound task execution with loading state.
 * Creates a wrapped version of a function that automatically tracks loading state.
 *
 * @template T - The type of the function being wrapped
 * @param block - The function to wrap with task tracking
 * @returns A tuple containing [isLoading: boolean, wrappedFunction: T]
 * @example
 * ```typescript
 * function UserProfile({ userId }: { userId: string }) {
 *   const [user, setUser] = useState<User | null>(null);
 *
 *   const [isLoading, loadUser] = useBoundRunInTask(async () => {
 *     const userData = await fetchUser(userId);
 *     setUser(userData);
 *   });
 *
 *   useEffect(() => {
 *     loadUser();
 *   }, [userId, loadUser]);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>{user?.name}</div>;
 * }
 * ```
 */
export function useBoundRunInTask<T extends AnyFunction>(block: T): [boolean, T]
export function useBoundRunInTask<T extends AnyFunction>(block: T | undefined): [boolean, T | undefined]
export function useBoundRunInTask<T extends AnyFunction>(block: T | undefined) {
  const [isRunning, runInTask] = useRunInTask()

  const runBlockInTask = useMemo(
    () => (block ? (...args: Parameters<T>) => runInTask<Unpromisify<ReturnType<T>>>(() => block(...args)) : undefined),
    [block, runInTask],
  )

  return [isRunning, runBlockInTask] as const
}
