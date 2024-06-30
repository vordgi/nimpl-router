import Nav from "../../../components/nav";

export default function Rewritten({ params }: { params: { lang: string } }) {
    return (
        <div>
            <h1>i18n {params.lang} rewritten page</h1>
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
