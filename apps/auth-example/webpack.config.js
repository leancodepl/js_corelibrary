const { withReact } = require("@nx/react");
const { composePlugins, withNx } = require("@nx/webpack");
const { configurationGeneratorInternal } = require("@nx/webpack/src/generators/configuration/configuration");

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), config => {
    config.devServer = {
        ...config.devServer,
        client: {
            ...config.devServer?.client,
            webSocketURL: {
                hostname: "local.lncd.pl",
                port: 443,
                pathname: "/ws",
                protocol: "wss",
            },
        },
    };

    // const loader = config.module.rules.find(e => typeof e.loader === "string" && e.loader.includes("swc-loader"))
    // loader.options.jsc.target = "es2016"
    // loader.options.jsc.loose = false
    // console.log(loader.options.jsc)
    // config.module.rules = [
    //     // loader,
    //      ...config.module.rules.filter(e => !(typeof e.loader === "string" && e.loader.includes("swc-loader"))), 
    //      loader
    //     ]

    return config;
});
