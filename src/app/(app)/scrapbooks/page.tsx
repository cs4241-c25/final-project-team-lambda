import { getSession } from "@/lib/auth";
import { getScrapbooks } from "@/lib/db";
import CreateScrapbook from "./CreateScrapbook";

export default async function Scrapbooks() {
    // get session and send request for scrapbooks
    const session = await getSession();
    const getScrapbooksResult = await getScrapbooks(session?.user.id);

    if (!getScrapbooksResult.ok) {
        // if there was an error getting scrapbooks, display an error message
        return (
            <main>
                <h1>Scrapbooks</h1>
                <p>Error getting scrapbooks.</p>
                <a href="/scrapbooks">Try again</a>
            </main>
        )
    } else {
        // if scrapbooks were successfully retrieved, display them
        const scrapbooks = getScrapbooksResult.data;
        return (
            <main>
                <h1>Scrapbooks</h1>
                <ul>
                    { scrapbooks.map(scrapbook => (
                        <li key={scrapbook._id}>
                            <a href={`/scrapbooks/${scrapbook._id}`}>{scrapbook.title}</a>
                        </li>
                    ))}
                    <CreateScrapbook />
                </ul>
            </main>
        );
    }
}