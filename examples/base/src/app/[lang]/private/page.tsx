import Nav from "../../../components/nav";

export default async function Private({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <div>
            <h1>i18n {lang} private page</h1>
            <pre>
                {`redirects: [
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
basePath: "/doc",
i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
}`}
            </pre>
            <Nav />
        </div>
    );
}
