import { AxiosError } from "axios";

export async function handleCancelError(err: AxiosError) {
    if (err.code !== "ERR_CANCELED") {
        throw err;
    }
}
