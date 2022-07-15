import ApiBinary, { toRaw } from "@leancode/api-binary";
import base64toBlob from "./base64ToBlob";

export default function toBlob(apiBinary: ApiBinary, contentType?: string): Blob;
export default function toBlob(apiBinary?: ApiBinary | null, contentType?: string): Blob | undefined;
export default function toBlob(apiBinary?: ApiBinary | null, contentType?: string) {
    if (apiBinary === undefined || apiBinary === null) {
        return undefined;
    }

    return base64toBlob(toRaw(apiBinary), contentType);
}
