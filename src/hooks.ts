import type { Handle, GetSession } from "@sveltejs/kit";
import * as cookie from "cookie";

export const handle: Handle = async ({ request, resolve }) => {
    request.locals.token = cookie.parse(request.headers.cookie ?? "").token;

    const response = await resolve(request);
    return response;
};

export const getSession: GetSession = (request) => {
    return {
        token: request.locals.token
    };
};
