import { getSession } from "@/lib/auth";
import { getScrapbooks } from "@/lib/db";
import CreateScrapbook from "./CreateScrapbook";
import Link from "next/link";

export default async function Scrapbooks() {
    // get session and send request for scrapbooks
    const session = await getSession();
    const getScrapbooksResult = await getScrapbooks(session?.user.id);

    if (!getScrapbooksResult.ok) {
        // if there was an error getting scrapbooks, display an error message
        return (
            <main className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold text-[black] mb-6">Scrapbooks</h1>
                <p>Error getting scrapbooks.</p>
                <Link href="/scrapbooks">Try again</Link>
            </main>
        )
    } else {
        // Display scrapbooks
        const scrapbooks = getScrapbooksResult.data;
        return (
            <main className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg mt-10">
                <h1 className="text-3xl font-bold text-[black] mb-6">My Scrapbooks</h1>

                {/* Scrapbook List */}
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scrapbooks.map(scrapbook => (
                        <li key={scrapbook._id} className="bg-[var(--lightgreen)] p-4 rounded-lg shadow hover:bg-[var(--lightgreen)] transition">
                            <Link href={`/scrapbooks/${scrapbook._id}`} className="text-xl font-semibold text-[var(--darkestgreen)] hover:text-[black]">
                                {scrapbook.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* New Scrapbook Button */}
                <div className="mt-6 flex justify-center">
                    <CreateScrapbook />
                </div>
            </main>
        );
    }
}