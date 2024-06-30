import Nav from "../../../components/nav";

export default function Private({ params }: { params: { lang: string } }) {
    return (
        <div>
            <h1>i18n {params.lang} private page</h1>
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
