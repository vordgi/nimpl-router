import { checkCookie } from "./check-cookie";
import { checkHeader } from "./check-header";
import { checkHost } from "./check-host";
import { checkQuery } from "./check-query";

export const checkers = {
    header: checkHeader,
    cookie: checkCookie,
    host: checkHost,
    query: checkQuery,
};
