import { cookies } from "next/headers";
import { type BaseRule } from "../types/changers";

export const checkCookie = (_url: URL, rule: BaseRule, store: Awaited<ReturnType<typeof cookies>>) => {
    if (!rule.value) return { match: store.has(rule.key), groups: {} };

    const cookie = store.get(rule.key);
    const match = cookie?.value?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
