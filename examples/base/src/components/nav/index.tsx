import Link from "next/link";

export default function Nav() {
    return (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
            <div>
                <Link href="/">Root page /</Link>
            </div>
            <div style={{ marginTop: 20 }}>
                <p>Default (en) lang</p>
                <Link href="/doc">i18n doc</Link>
                <br />
                <Link href="/doc/to-rewritten">i18n doc/to-rewritten</Link>
                <br />
                <Link href="/doc/private">private (unauthenticated)</Link>
                <br />
                <Link href="/doc/private?secret=admin">private (authenticated)</Link>
            </div>
            <div style={{ marginTop: 20 }}>
                <p>De lang</p>
                <Link href="/doc/de">i18n doc/de</Link>
                <br />
                <Link href="/doc/de/to-rewritten">i18n doc/de/to-rewritten</Link>
                <br />
                <Link href="/doc/de/private">private (unauthenticated)</Link>
                <br />
                <Link href="/doc/de/private?secret=admin">private (authenticated)</Link>
            </div>
        </div>
    );
}
