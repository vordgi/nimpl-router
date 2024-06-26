import { cookies } from "next/headers";
import { type BaseRule } from "../types/changers";

export const checkCookie = (_url: URL, rule: BaseRule) => {
    if (!rule.value) return { match: cookies().has(rule.key), groups: {} };

    const cookie = cookies().get(rule.key);
    const match = cookie?.value?.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
