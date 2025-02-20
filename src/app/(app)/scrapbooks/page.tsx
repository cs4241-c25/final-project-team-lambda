import { getSession } from "@/lib/auth";

export default async function Scrapbooks() {
    const session = await getSession();
    return (
        <main>
            <h1>Scrapbooks</h1>
            { session != null && <p>Logged in as {session.user?.name ?? "unknown user"}.</p> }
        </main>
    );
}