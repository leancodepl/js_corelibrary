type DataLayerArguments<T extends { event: string }> = T & {
    /**
     * Function that will be called after all Tags have fired for the given event
     *
     * Will not be called when GTM is not initialized
     */
    eventCallback?: (containerId: string) => void
    eventTimeout?: number
}

declare global {
    interface Window {
        dataLayer?: DataLayerArguments<{ event: string }>[]
    }
}

export function mkgtag<T extends { event: string }>() {
    return (dataLayerArguments: DataLayerArguments<T>) => {
        window.dataLayer?.push(dataLayerArguments)
    }
}
