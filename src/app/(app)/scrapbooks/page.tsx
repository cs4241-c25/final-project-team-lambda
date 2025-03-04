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
        <main className="flex flex-col m-4">
            <h1>Scrapbooks</h1>
            <ul className="flex flex-wrap gap-2 w-full">
                {scrapbooks.map((scrapbook) => (
                    <li key={scrapbook._id}>
                        <Link
                            href={`/scrapbook/${scrapbook._id}`}
                            className="flex flex-col no-underline rounded-md bg-[--mediumgreen] p-2 w-[250px] h-[150px] hover:bg-[--darkgreen]"
                        >
                            <h2 className="mb-auto">{scrapbook.title}</h2>
                            <p>{scrapbook.visibility == "public" ? "Public" : "Private"}</p>
                            <p>{scrapbook.width} x {scrapbook.height}</p>
                        </Link>
                    </li>
                ))}
                <li>
                    <Link
                        href="/scrapbooks/create"
                        className="flex justify-center items-center no-underline rounded-md border-2 border-[--mediumgreen] p-2 w-[250px] h-[150px]"
                    >+ Create Scrapbook</Link>
                </li>
            </ul>
        </main>
    );
}
