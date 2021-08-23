import { Configure, EnvironmentContext } from "@leancode/build-base";

export default function appConfig<TInCtx extends EnvironmentContext>(): Configure<TInCtx, TInCtx> {
    const svgoLoader = {
        loader: require.resolve("svgo-loader"),
        options: {
            plugins: [
                {
                    name: "preset-default",
                    params: {
                        overrides: {
                            removeViewBox: false,
                        },
                    },
                },
            ],
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
                                name: "static/media/[name].[contenthash].[ext]",
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
