import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"

type ValueContextData<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>]

type ProviderProps<T> = {
  children?: ReactNode
  initialValue?: T
}

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
