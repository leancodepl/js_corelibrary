export type Unpromisify<T> = T extends Promise<infer TResult> ? TResult : T;
