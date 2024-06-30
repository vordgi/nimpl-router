import Nav from "../components/nav";

export default function Home() {
    return (
        <div>
            <h1>Root page</h1>
            <pre>
                {`rewrites: [
    {
        source: "/",
        destination: "/",
        basePath: false,
        locale: false,
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
