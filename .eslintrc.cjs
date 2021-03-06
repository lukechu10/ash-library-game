module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    plugins: ["svelte3", "@typescript-eslint"],
    ignorePatterns: ["*.cjs"],
    overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
    settings: {
        "svelte3/typescript": () => require("typescript")
    },
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2019
    },
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    rules: {
        semi: ["warn", "always"],
        "@typescript-eslint/no-explicit-any": ["off", "always"],
        "@typescript-eslint/no-non-null-assertion": ["off", "always"]
    }
};
