import type { Request, Response } from "@sveltejs/kit";
import * as cookie from "cookie";

export async function handle({
    request,
    resolve
}: {
    request: Request;
    resolve: (request: Request) => Response | Promise<Response>;
}): Promise<Response> {
    request.locals.token = cookie.parse(request.headers.cookie ?? "").token;

    const response = await resolve(request);
    return response;
}

export function getSession(request: Request): { token?: string } {
    return {
        token: request.locals.token
    };
}
