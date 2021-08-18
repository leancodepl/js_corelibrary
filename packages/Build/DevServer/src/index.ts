import { AppUrlContext, Configure, DeployContext, EnvironmentContext } from "@leancode/build-base";

export default function devServer<TInCtx extends EnvironmentContext & AppUrlContext & DeployContext>(
    port: number = 40112,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        if (!ctx.isProduction) {
            ctx.config.devServer = {
                hot: true,
                historyApiFallback: true,
                allowedHosts: "all",
                port,
                host: "0.0.0.0",

                devMiddleware: {
                    publicPath: "/",
                },
                static: {
                    directory: ctx.deployDir,
                },
            };
        }

        return ctx;
    };
}
