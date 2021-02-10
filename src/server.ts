import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();

app.disable("x-powered-by");

app.use(
    compression({ threshold: 1024 }),
    sirv("static", { dev }),
    sapper.middleware()
);
app.use((err: any) => {
    if (err) console.log("error", err);
});
app.listen(PORT);

export default app;
