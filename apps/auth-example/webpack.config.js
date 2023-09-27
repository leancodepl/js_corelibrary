const { withReact } = require("@nx/react");
const { composePlugins, withNx } = require("@nx/webpack");

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

    return config;
});
