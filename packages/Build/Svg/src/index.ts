import { Configure, EnvironmentContext } from "@leancode/build-base";
import { extendDefaultPlugins } from "svgo";

export default function appConfig<TInCtx extends EnvironmentContext>(): Configure<TInCtx, TInCtx> {
    const svgoLoader = {
        loader: "svgo-loader",
        options: {
            plugins: extendDefaultPlugins([
                {
                    name: "removeViewBox",
                    active: false,
                },
            ]),
        },
    };

    return ctx => {
        ctx.config.module ??= {};
        ctx.config.module.rules ??= [];

        ctx.config.module.rules.push({
            test: /\.svg$/,
            oneOf: [
                {
                    resourceQuery: /inline/,
                    use: ["svg-react-loader", svgoLoader],
                },
                {
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "images/[name]-[hash:5].[ext]",
                            },
                        },
                        svgoLoader,
                    ],
                },
            ],
        });

        return ctx;
    };
}
