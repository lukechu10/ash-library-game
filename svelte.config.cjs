const sveltePreprocess = require("svelte-preprocess");
const vercel = require("@sveltejs/adapter-vercel");

module.exports = {
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
                require("postcss-nesting"),
            ],
        },
    }),
    kit: {
        adapter: vercel(),
    }
};
