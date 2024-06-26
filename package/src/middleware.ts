import { type NextRequest } from "next/server";
import { type ChangerOptions } from "./lib/types/changers";
import { Router } from "./lib/router";

export const createMiddleware = (opts: ChangerOptions) => {
    const changer = new Router(opts);

    return (request: NextRequest) => {
        const nextResponse = changer.navigate(request.nextUrl);
        return nextResponse;
    };
};
