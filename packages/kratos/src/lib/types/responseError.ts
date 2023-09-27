import { AxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResponseError<T = any> = AxiosError<T>;
