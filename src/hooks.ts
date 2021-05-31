import type { Request, Response } from "@sveltejs/kit";
import * as cookie from "cookie";

export async function handle({
    request,
    render,
}: {
    request: Request;
    render: (request: Request) => Response | Promise<Response>;
}): Promise<Response> {
    request.locals.token = cookie.parse(request.headers.cookie ?? "").token;

    const response = await render(request);
    return response;
}

export function getSession(request: Request): { token?: string } {
    return {
        token: request.locals.token
    };
}
