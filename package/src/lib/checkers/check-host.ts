import { type HostRule } from "../types/changers";

export const checkHost = (url: URL, rule: HostRule) => {
    if (!rule.value) return { match: true, groups: {} };

    const match = url.host.match(`^${rule.value}$`);

    if (match) return { match: true, groups: match.groups || {} };

    return { match: false, groups: {} };
};
