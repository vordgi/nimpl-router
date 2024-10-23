import Nav from "../../components/nav";

export default async function LangHome({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <div>
            <h1>i18n {lang} page</h1>
            <pre>
                {`basePath: "/doc",
i18n: {
    defaultLocale: "en",
    locales: ["en", "de"],
}`}
            </pre>
            <Nav />
        </div>
    );
}
