import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { type Rewrite, type Redirect } from "./types/changers";
import { type ChangerOptions } from "./types/changers";
import { formatDestination } from "./utils/format-destination";
import { createRuleTester } from "./utils/test-rule";

export class Router {
    rewrites?: ChangerOptions["rewrites"];

    redirects?: ChangerOptions["redirects"];

    basePath?: ChangerOptions["basePath"];

    i18n?: ChangerOptions["i18n"];

    constructor(opts: ChangerOptions) {
        this.redirects = opts.redirects;
        this.rewrites = opts.rewrites;
        this.basePath = opts.basePath?.replace(/\/$/, "");
        this.i18n = opts.i18n;
    }

    getRequestLocale = async (url: URL) => {
        if (!this.i18n) return null;

        const domainI18n = this.i18n.domains?.find((domainData) => domainData.domain === url.host);

        const locales = domainI18n?.locales || this.i18n.locales;
        const defaultLocale = domainI18n?.defaultLocale || this.i18n.defaultLocale;

        const pathnameLocale = url.pathname.match(new RegExp(`/(?<locale>${locales.join("|")})(?:/|$)`));
        let preferredLocale = pathnameLocale?.groups?.locale;

        if (!preferredLocale) {
            const cookiesStore = await cookies();
            preferredLocale = cookiesStore.get("NEXT_LOCALE")?.value;
        }

        if (preferredLocale) return preferredLocale;

        const detectedLocale = this.i18n.localeDetector?.(url);
        return detectedLocale || defaultLocale;
    };

    findChanger = async <T extends Redirect[] | Rewrite[]>(
        changers: T,
        url: URL,
        routeData: {
            basePath: string | null | undefined;
            locale: string | null | undefined;
            pathname: string;
        },
    ) => {
        for (const changer of changers) {
            let targetLocale: string | null = null;
            let targetBasePath: string | null = null;

            if (this.basePath && changer.basePath !== false) {
                if (routeData.basePath) {
                    targetBasePath = this.basePath;
                } else {
                    continue;
                }
            }

            if (changer.locale !== false && routeData.locale) {
                targetLocale = routeData.locale;
            }

            const match = url.pathname.match(
                `^${targetBasePath || ""}${targetLocale ? `/${routeData.locale}` : ""}${changer.source.replace(/([^/])$/, "$1/")}?$`,
            );

            if (!match) continue;

            const groups = match.groups || {};

            const testRule = createRuleTester();

            if (changer.has) {
                let validRules = true;
                for (const rule of changer.has) {
                    const { match, groups: ruleGroups } = await testRule(url, rule);

                    if (!match) {
                        validRules = false;
                        break;
                    }

                    Object.assign(groups, ruleGroups);
                }
                if (!validRules) continue;
            }

            if (changer.missing) {
                let validRules = true;
                for (const rule of changer.missing) {
                    const { match, groups: ruleGroups } = await testRule(url, rule);

                    if (match) {
                        validRules = false;
                        break;
                    }

                    Object.assign(groups, ruleGroups);
                }
                if (!validRules) continue;
            }

            return {
                changer: changer as T[number],
                groups,
            };
        }
    };

    parsePathname(pathname: string) {
        const routeData = {
            basePath: null as string | null | undefined,
            locale: null as string | null | undefined,
            pathname,
        };
        const basePathMatch = this.basePath && pathname.match(new RegExp(`^${this.basePath}(/|$)`));
        if (basePathMatch) {
            routeData.basePath = this.basePath;
            routeData.pathname = routeData.pathname.replace(new RegExp(`^${this.basePath}(/|$)`), "/");
        }
        const localeMatch =
            this.i18n && routeData.pathname.match(new RegExp(`^/(${this.i18n.locales.join("|")})(/|$)`));
        if (localeMatch) {
            routeData.locale = localeMatch[1];
            routeData.pathname = routeData.pathname.replace(new RegExp(`^/${routeData.locale}(/|$)`), "/");
        }

        return routeData;
    }

    async navigate(nextUrl: URL) {
        const originRouteData = this.parsePathname(nextUrl.pathname);
        const nextRouteData = {
            basePath: this.basePath,
            locale: originRouteData.locale,
            pathname: originRouteData.pathname,
            type: "none" as "none" | "rewrite" | "redirect",
            status: 200,
        };
        if (!nextRouteData.locale) nextRouteData.locale = await this.getRequestLocale(nextUrl);

        if (this.redirects) {
            const targetChanger = await this.findChanger(this.redirects, nextUrl, originRouteData);

            if (targetChanger) {
                const destination = formatDestination(targetChanger.changer.destination, targetChanger.groups);
                nextRouteData.pathname = destination;
                if (targetChanger.changer.locale === false) nextRouteData.locale = null;
                if (targetChanger.changer.basePath === false) nextRouteData.basePath = null;
                nextRouteData.type = "redirect";
                nextRouteData.status = targetChanger.changer.permanent ? 308 : 307;
            }
        }
        if (this.rewrites && nextRouteData.type !== "redirect") {
            const targetChanger = await this.findChanger(this.rewrites, nextUrl, originRouteData);

            if (targetChanger) {
                const destination = formatDestination(targetChanger.changer.destination, targetChanger.groups);
                nextRouteData.pathname = destination;
                if (targetChanger.changer.locale === false) nextRouteData.locale = null;
                if (targetChanger.changer.basePath === false) nextRouteData.basePath = null;
                nextRouteData.type = "rewrite";
            }
        }

        if (this.basePath && nextRouteData.basePath && nextRouteData.type === "none") {
            if (originRouteData.basePath) {
                nextRouteData.type = "rewrite";
            } else {
                const newNextUrl = new URL(nextUrl);
                newNextUrl.pathname = "/404/";
                return NextResponse.rewrite(newNextUrl, { status: 404 });
            }
        }

        // if i18n configurated and locale wasnt disabled by rewrite or redirect
        if (this.i18n && nextRouteData.locale && nextRouteData.type !== "redirect") {
            // if in original route was default locale - redirect to pathname without default locale
            if (originRouteData.locale === this.i18n.defaultLocale) {
                nextRouteData.type = "redirect";
                nextRouteData.status = 307;
            } else {
                nextRouteData.type = "rewrite";
            }
        }

        if (nextRouteData.type === "redirect") {
            const newNextUrl = new URL(nextUrl);
            newNextUrl.pathname = `${nextRouteData.basePath || ""}${!this.i18n || !nextRouteData.locale || nextRouteData.locale === this.i18n.defaultLocale ? "" : `/${nextRouteData.locale}`}${nextRouteData.pathname}`;
            return NextResponse.redirect(newNextUrl, { status: nextRouteData.status });
        }

        if (nextRouteData.type === "rewrite") {
            const newNextUrl = new URL(nextUrl);
            newNextUrl.pathname = `${nextRouteData.locale ? `/${nextRouteData.locale}` : ""}${nextRouteData.pathname}`;
            return NextResponse.rewrite(newNextUrl, { status: nextRouteData.status });
        }

        return NextResponse.next();
    }
}
