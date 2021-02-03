import sirv from "sirv";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const app = express();

app.use(
    // @ts-expect-error middleware type error
    compression({ threshold: 1024 }),
    sirv("static", { dev }),
    sapper.middleware()
);
app.use((err) => {
    if (err) console.log("error", err);
});
app.listen(PORT);

export default app;
