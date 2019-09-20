import { ClientType } from "./ClientType";

interface CacheEntry {
    exp: Date;
    data: any;
}

const cache: { [key: string]: CacheEntry | undefined } = {};

export interface CacheOptions {
    readonly cache: undefined | true | "force";
}

export function withCache<
    TClientParams,
    TOptions,
    TOutputMapper extends { [K in keyof TClientParams]: any }
>(client: ClientType<TClientParams, TOptions, TOutputMapper>) {
    let cachedClient: ClientType<
        TClientParams,
        TOptions & CacheOptions,
        TOutputMapper
    > = {} as any;
    let key: keyof TClientParams;

    for (key in client) {
        const base = client[key];

        (cachedClient[key] as any) = (dto: any, options: any) => {
            if (!options || !options.cache) {
                return base(dto, options);
            } else if (options.cache === "force") {
                return base(dto, options).then(result => {
                    const cacheKey = key + JSON.stringify(dto);

                    cache[cacheKey] = {
                        exp: new Date(new Date().getTime() + 5 * 60 * 1000),
                        data: result
                    };

                    return result;
                });
            } else {
                const cacheKey = key + JSON.stringify(dto);

                let obj = cache[cacheKey];

                if (obj) {
                    return Promise.resolve(obj);
                } else {
                    return base(dto, options).then(result => {
                        cache[cacheKey] = {
                            exp: new Date(new Date().getTime() + 5 * 60 * 1000),
                            data: result
                        };

                        return result;
                    });
                }
            }
        };
    }

    return cachedClient;
}
