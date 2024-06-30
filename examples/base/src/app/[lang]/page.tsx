import Nav from "../../components/nav";

export default function LangHome({ params }: { params: { lang: string } }) {
    return (
        <div>
            <h1>i18n {params.lang} page</h1>
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
