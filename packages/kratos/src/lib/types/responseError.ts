import { AxiosError } from "axios"

export type ResponseError<T = any> = AxiosError<T>
