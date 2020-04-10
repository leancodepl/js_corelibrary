import appConfig from "@leancode/build-app-config";
import { applyConfig, Configure, deploy, entrypoint, environment, optimizations } from "@leancode/build-base";
import css from "@leancode/build-css";
import devServer from "@leancode/build-dev-server";
import html from "@leancode/build-html";
import sass from "@leancode/build-sass";
import staticFiles from "@leancode/build-static-files";
import svg from "@leancode/build-svg";
import typescript, { BabelContext } from "@leancode/build-typescript";
import path from "path";

require("dotenv").config();

const paths = (() => {
    const configRoot = __dirname;
    const appRoot = path.resolve(configRoot, "..");
    const src = path.join(appRoot, "src");
    const tsConfig = path.join(appRoot, "tsconfig.json");
    const nodeModules = path.join(appRoot, "node_modules");
    const favicon = path.join(configRoot, "favicon.png");
    const styles = path.join(src, "styles");
    const indexHtml = path.join(appRoot, "index.html");

    return {
        appRoot,
        src,
        tsConfig,
        nodeModules,
        favicon,
        styles,
        indexHtml,
        config: (env: "production" | "development") => path.join(src, "configuration", `config.${env}.ts`),
    };
})();

function babelLoaders<TInCtx extends BabelContext>(): Configure<TInCtx, TInCtx> {
    return ctx => {
        const classPropertiesIndex = ctx.babelPlugins.indexOf("@babel/plugin-proposal-class-properties");

        if (classPropertiesIndex >= 0) {
            ctx.babelPlugins[classPropertiesIndex] = ["@babel/plugin-proposal-class-properties", { loose: true }];
        }

        return ctx;
    };
}

const config = applyConfig(
    entrypoint(path.join(paths.src, "index.tsx"), process.env.APP_URL || "http://localhost:8000"),
    deploy(path.join(paths.appRoot, "deploy")),
    optimizations(),

    environment(),
    html({
        template: paths.indexHtml,
    }),
    staticFiles(),

    typescript(paths.tsConfig, paths.src),
    babelLoaders(),

    css(),
    sass([path.join(paths.styles, "_variables.scss")]),
    svg(),

    appConfig(paths.config),
    devServer(8000),
);

export default config;
