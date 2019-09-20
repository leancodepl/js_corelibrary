type WebpackConfiguration = import("webpack").Configuration;

export type BaseContext = {
    env: any;
    argv: any;
    config: WebpackConfiguration;
};

export type Configure<TInCtx, TOutCtx> = (context: TInCtx) => TOutCtx;

export type ConfigFunc = (env: any, argv: any) => WebpackConfiguration;
