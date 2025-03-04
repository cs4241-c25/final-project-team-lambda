import { getSession } from "@/lib/auth";
import { getScrapbooks } from "@/lib/db";
import Link from "next/link";

export default async function Scrapbooks() {
    const session = await getSession();
    const getScrapbooksResult = await getScrapbooks(session?.user.id);

    if (!getScrapbooksResult.ok) {
        return (
            <main>
                <h1>Scrapbooks</h1>
                <p>Error getting scrapbooks.</p>
                <Link href="/scrapbooks">Try again</Link>
            </main>
        );
    }

    const scrapbooks = getScrapbooksResult.data;

    return (
        <main>
            <h1>Scrapbooks</h1>
            <ul>
                {scrapbooks.map((scrapbook) => (
                    <li key={scrapbook._id}>
                        <Link href={`/scrapbook/${scrapbook._id}`}>{scrapbook.title}</Link>
                    </li>
                ))}
            </ul>
            <Link href="/scrapbooks/create">
                <button>+ Create Scrapbook</button>
            </Link>
        </main>
    );
}
