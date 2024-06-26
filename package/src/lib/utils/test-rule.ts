import { type Rule } from "../types/changers";
import { checkers } from "../checkers";

export const testRule = (url: URL, rule: Rule) => {
    const checker = checkers[rule.type];

    // todo add correct types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (checker) return checker(url, rule as any);

    return { match: false, groups: {} };
};
