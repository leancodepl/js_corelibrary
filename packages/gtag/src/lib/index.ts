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

/**
 * Creates a type-safe Google Tag Manager data layer push function.
 * 
 * Returns a function that pushes events to the GTM data layer with type safety.
 * Handles cases where GTM is not initialized by safely checking for dataLayer existence.
 * 
 * @template T - Event object type extending { event: string }
 * @returns Function that accepts data layer arguments and pushes to GTM
 * @example
 * ```typescript
 * const gtag = mkgtag<{ event: 'purchase'; value: number }>();
 * gtag({ event: 'purchase', value: 29.99 });
 * ```
 */
export function mkgtag<T extends { event: string }>() {
    return (dataLayerArguments: DataLayerArguments<T>) => {
        window.dataLayer?.push(dataLayerArguments)
    }
}
