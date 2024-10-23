import { headers } from "next/headers";
import { type BaseRule } from "../types/changers";

export const checkHeader = (_url: URL, rule: BaseRule, store: Awaited<ReturnType<typeof headers>>) => {
    if (!rule.value) return { match: store.has(rule.key), groups: {} };

    const value = store.get(rule.key);
    const match = value?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
