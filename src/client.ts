import * as sapper from "@sapper/app";
import "./global.css";

console.log("Start");

sapper.start({
    target: document.querySelector("#sapper"),
});
