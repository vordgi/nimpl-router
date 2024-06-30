import { createMiddleware } from "@nimpl/router/dist/middleware";

export const middleware = createMiddleware({
    redirects: [
        {
            source: "/old",
            destination: "/",
            permanent: false,
            has: [
                {
                    type: "host",
                    value: "example.com",
                },
            ],
        },
        {
            source: "/private",
            destination: "/",
            permanent: false,
            missing: [
                {
                    type: "query",
                    key: "secret",
                    value: "admin",
                },
            ],
        },
    ],
    rewrites: [
        {
            source: "/",
            destination: "/",
            basePath: false,
            locale: false,
        },
        {
            source: "/to-rewritten",
            destination: "/rewritten",
        },
    ],
    basePath: "/doc",
    i18n: {
        defaultLocale: "en",
        locales: ["en", "de"],
    },
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
