type DownloadFileOptions = {
    name?: string
}

export function downloadFile(url: string, options?: DownloadFileOptions): void
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
