export function base64toBlob(base64Data: string, contentType?: string, sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays: ArrayBuffer[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        byteArrays.push(new Uint8Array(byteNumbers).buffer);
    }

    const blob = new Blob(byteArrays, { type: contentType });

    return blob;
}
