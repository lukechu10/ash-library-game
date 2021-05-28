import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";

/**
 * Unauthenticated users are redirected to `/login/admin`.
 * @returns a `LoadOutput` for a protected page (requiring authentication).
 */
export function protectedPage({ session }: LoadInput): LoadOutput {
    if (session.token === undefined) return { status: 302, redirect: "/login/admin" };
    else return { status: 200 };
}
