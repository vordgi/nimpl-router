import { type Rule } from "../types/changers";
import { checkers } from "../checkers";
import { cookies, headers } from "next/headers";

export const createRuleTester = () => {
    const stores = {
        headers: null as Awaited<ReturnType<typeof headers>> | null,
        cookies: null as Awaited<ReturnType<typeof cookies>> | null,
    };

    return async (url: URL, rule: Rule) => {
        const checker = checkers[rule.type];

        if (checker) {
            let store = null;
            if (rule.type === "header") {
                if (stores.headers) {
                    store = stores.headers;
                } else {
                    store = await headers();
                    stores.headers = store;
                }
            } else if (rule.type === "cookie") {
                if (stores.cookies) {
                    store = stores.cookies;
                } else {
                    store = await cookies();
                    stores.cookies = store;
                }
            }
            // todo add correct types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return checker(url, rule as any, store as any);
        }

        return { match: false, groups: {} };
    };
};
