import { Configure } from "@leancode/build-base/configure";
import { EnvironmentContext } from "@leancode/build-base/environmentCheck";
import { parse } from "json2csv";
import { StatsWriterPlugin } from "webpack-stats-plugin";

export default function appConfig<TInCtx extends EnvironmentContext>(filename: string): Configure<TInCtx, TInCtx> {
    function transformStats(data: any) {
        let fields: any[] = [];
        let assets: any = {};

        for (let entrypoint in data.entrypoints) {
            for (let asset of data.entrypoints[entrypoint].assets) {
                fields.push(asset);
                assets[asset] = data.assets.find(a => a.name === asset).size;
            }
        }

        return parse([assets], { fields });
    }

    return ctx => {
        ctx.config.plugins = ctx.config.plugins || [];

        if (ctx.isProduction) {
            ctx.config.plugins.push(
                new StatsWriterPlugin({
                    fields: ["assets", "entrypoints"],
                    filename,
                    transform: transformStats,
                }),
            );
        }

        return ctx;
    };
}
