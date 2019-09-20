import { Configure } from "@leancode/build-base/configure";
import { DeployContext } from "@leancode/build-base/deploy";
import { AppUrlContext } from "@leancode/build-base/entrypoint";
import { EnvironmentContext } from "@leancode/build-base/environment";

export default function devServer<TInCtx extends EnvironmentContext & AppUrlContext & DeployContext>(
    port: number = 40112,
): Configure<TInCtx, TInCtx> {
    return ctx => {
        if (!ctx.isProduction) {
            ctx.config.devServer = {
                hot: true,
                contentBase: ctx.deployDir,
                publicPath: "/",
                disableHostCheck: true,
                public: ctx.appUrl,
                port,
                compress: true,

                host: "0.0.0.0",
                historyApiFallback: true,
            };
        }

        return ctx;
    };
}
