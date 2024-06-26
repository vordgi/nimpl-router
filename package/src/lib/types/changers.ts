export type RuleType = "header" | "cookie" | "host" | "query";

export type BaseRule = {
    type: "header" | "cookie" | "query";
    key: string;
    value?: string;
};
export type HostRule = {
    type: "host";
    value: string;
};

export type Rule = BaseRule | HostRule;

export type RouteChanger = {
    source: string;
    destination: string;
    basePath?: false;
    locale?: false;
    has?: Rule[];
    missing?: Rule[];
};

export type Rewrite = RouteChanger;

export interface Redirect extends RouteChanger {
    permanent: boolean;
}

export type ChangerOptions = {
    rewrites?: Rewrite[];
    redirects?: Redirect[];
    basePath?: string | null;
    i18n?: {
        locales: string[];
        defaultLocale: string;
        localeDetector?: (url: URL) => string | undefined | null;
        domains?: {
            domain: string;
            defaultLocale?: string;
            locales?: string[];
        }[];
    };
};
