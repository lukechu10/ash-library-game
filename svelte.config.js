import sveltePreprocess from "svelte-preprocess";
import vercel from "@sveltejs/adapter-vercel";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssNesting from "postcss-nesting";

const config = {
    kit: {
        adapter: vercel(),
    },
    preprocess: sveltePreprocess({
        postcss: {
            plugins: [tailwindcss, autoprefixer, postcssNesting],
        },
    }),
};

export default config;
