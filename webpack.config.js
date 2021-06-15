const webpack = require("webpack");
const WebpackModules = require("webpack-modules");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const sapperConfig = require("sapper/config/webpack.js");
const pkg = require("./package.json");
const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const alias = {
    svelte: path.resolve("node_modules", "svelte"),
    $components: path.resolve("src", "components"),
    $routes: path.resolve("src", "routes"),
    $services: path.resolve("src", "services"),
    $store: path.resolve("src", "store"),
};
const extensions = [".mjs", ".js", ".ts", ".json", ".svelte", ".html"];
const mainFields = ["svelte", "module", "browser", "main"];
const fileLoaderRule = {
    test: /\.(png|jpe?g|gif)$/i,
    use: ["file-loader"],
};
const tsLoaderRule = {
    test: /\.(ts|tsx)$/i,
    use: ["ts-loader"],
};
const postcssLoaderRule = {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
};
const babelLoaderRule = {
    test: /\.m?js$/i,
    use: !dev ? {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { targets: "ios_saf 9" }]
          ]
        }
      } : []
};

const config = {
    client: {
        entry: {
            main: path.resolve(`src/client`),
        },
        output: {
            path: sapperConfig.client.output().path,
            filename: "[hash]/[name].js",
            chunkFilename: "[hash]/[name].[id].js",
            publicPath: "client/",
        },
    },
    server: {
        entry: {
            server: path.resolve(`src/server`),
        },
        output: {
            path: sapperConfig.server.output().path,
            filename: "[name].js",
            chunkFilename: "[hash]/[name].[id].js",
            publicPath: "client/",
            libraryTarget: "commonjs2",
        },
    },
};

module.exports = {
    client: {
        name: "client",
        entry: config.client.entry,
        output: config.client.output,
        resolve: { alias, extensions, mainFields },
        module: {
            rules: [
                {
                    test: /\.(svelte|html)$/,
                    use: {
                        loader: "svelte-loader-hot",
                        options: {
                            preprocess: sveltePreprocess(),
                            dev,
                            hydratable: true,
                            emitCss: false, // currently broken with HMR
                            hotReload: true,
                            hotOptions: {
                                noPreserveState: false,
                                acceptAccessors: true,
                                acceptNamedExports: true,
                            },
                        },
                    },
                },
                fileLoaderRule,
                tsLoaderRule,
                postcssLoaderRule,
                babelLoaderRule,
            ],
        },
        mode,
        plugins: [
            // pending https://github.com/sveltejs/svelte/issues/2377
            // dev && new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            new MiniCssExtractPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ].filter(Boolean),
        devtool: dev && "inline-source-map",
    },

    server: {
        name: "server",
        entry: config.server.entry,
        output: config.server.output,
        target: "node",
        resolve: { alias, extensions, mainFields },
        externals: Object.keys(pkg.dependencies).concat("encoding"),
        module: {
            rules: [
                {
                    test: /\.(svelte|html)$/,
                    use: {
                        loader: "svelte-loader",
                        options: {
                            preprocess: sveltePreprocess(),
                            css: false,
                            generate: "ssr",
                            hydratable: true,
                            dev,
                        },
                    },
                },
                fileLoaderRule,
                tsLoaderRule,
                postcssLoaderRule,
            ],
        },
        mode,
        plugins: [new WebpackModules()],
        performance: {
            hints: false, // it doesn't matter if server.js is large
        },
    },
};
