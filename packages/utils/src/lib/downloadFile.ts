type DownloadFileOptions = {
    name?: string
}

/**
 * Downloads a file from a URL by creating a temporary download link.
 * 
 * @param url - The URL to download from
 * @param options - Optional download options including filename
 * @example
 * ```typescript
 * // Download from URL
 * downloadFile('https://example.com/file.pdf', { name: 'document.pdf' });
 * ```
 */
export function downloadFile(url: string, options?: DownloadFileOptions): void
/**
 * Downloads a file from a Blob or MediaSource object by creating a temporary object URL.
 * 
 * @param obj - The Blob or MediaSource object to download
 * @param options - Optional download options including filename
 * @example
 * ```typescript
 * // Download from Blob
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * downloadFile(blob, { name: 'hello.txt' });
 * ```
 */
export function downloadFile(obj: Blob | MediaSource, options?: DownloadFileOptions): void
export function downloadFile(dataOrUrl: Blob | MediaSource | string, options: DownloadFileOptions = {}) {
    if (typeof dataOrUrl === "string") {
        const { name } = options
        const a = document.createElement("a")

        a.href = dataOrUrl
        a.target = "_blank"
        if (name) a.download = name

        a.click()
    } else {
        const url = URL.createObjectURL(dataOrUrl)
        downloadFile(url, options)
        URL.revokeObjectURL(url)
    }
}
