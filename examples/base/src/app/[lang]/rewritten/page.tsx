import Nav from "../../../components/nav";

export default async function Rewritten({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <div>
            <h1>i18n {lang} rewritten page</h1>
            <pre>
                {`rewrites: [
    {
        source: "/to-rewritten",
        destination: "/rewritten",
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
