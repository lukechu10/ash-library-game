/// <reference types="@sveltejs/kit" />

declare module "*/static/books.json" {
    const value: import("$lib/bookApi").BookData[];
    export default value;
}
