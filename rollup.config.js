import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
    (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
    (warning.code === "CIRCULAR_DEPENDENCY" &&
        /[/\\]@sapper[/\\]/.test(warning.message)) ||
    warning.code === "THIS_IS_UNDEFINED" ||
    onwarn(warning);

export default {
    client: {
        input: config.client.input().replace(/.js$/, ".ts"),
        output: config.client.output(),
        plugins: [
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                dev,
                hydratable: true,
                preprocess: sveltePreprocess({
                    scss: {
                        includePaths: ["src/theme"],
                    },
                }),
                emitCss: true,
            }),
            resolve({
                browser: true,
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript({ sourceMap: dev }),

            legacy &&
                babel({
                    extensions: [".js", ".mjs", ".html", ".svelte"],
                    babelHelpers: "runtime",
                    exclude: ["node_modules/@babel/**"],
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: "> 0.25%, not dead, ios_saf 9",
                            },
                        ],
                    ],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        [
                            "@babel/plugin-transform-runtime",
                            {
                                useESModules: true,
                            },
                        ],
                    ],
                }),

            !dev &&
                terser({
                    module: true,
                }),
        ],

        preserveEntrySignatures: false,
        onwarn,
        watch: {
            buildDelay: 50,
        },
    },

    server: {
        input: { server: config.server.input().server.replace(/.js$/, ".ts") },
        output: { ...config.server.output(), exports: "auto" },
        plugins: [
            replace({
                "process.browser": false,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            svelte({
                generate: "ssr",
                hydratable: true,
                preprocess: sveltePreprocess({
                    scss: {
                        includePaths: ["src/theme"],
                    },
                }),
                dev,
            }),
            resolve({
                dedupe: ["svelte"],
            }),
            commonjs(),
            typescript({ sourceMap: dev }),
            json({ namedExports: false, preferConst: true }),
        ],
        external: Object.keys(pkg.dependencies).concat(
            require("module").builtinModules
        ),

        preserveEntrySignatures: "strict",
        onwarn,
        watch: {
            buildDelay: 50,
        },
    },

    serviceworker: {
        input: config.serviceworker.input().replace(/.js$/, ".ts"),
        output: config.serviceworker.output(),
        plugins: [
            resolve(),
            replace({
                "process.browser": true,
                "process.env.NODE_ENV": JSON.stringify(mode),
            }),
            commonjs(),
            typescript({ sourceMap: dev }),
            !dev && terser(),
        ],

        preserveEntrySignatures: false,
        onwarn,
        watch: {
            buildDelay: 50,
        },
    },
};
