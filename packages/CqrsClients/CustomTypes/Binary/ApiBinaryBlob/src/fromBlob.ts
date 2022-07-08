import ApiBinary, { fromRaw } from "@leancode/api-binary";

export default function fromBlob(blob: Blob): Promise<ApiBinary>;
export default function fromBlob(blob?: Blob): Promise<ApiBinary | undefined>;
export default function fromBlob(blob?: Blob) {
    if (!blob) return Promise.resolve(undefined);

    return new Promise<ApiBinary>((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                if (typeof result === "string") {
                    // we need to strip the `data:*/*;base64,` from the beginning
                    resolve(fromRaw(result.substring(1 + result.indexOf(",", result.indexOf(";")))));
                    return;
                }

                throw new Error("Unknown blob result received for ApiBinary creation");
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        } catch (e) {
            reject(e);
        }
    });
}
