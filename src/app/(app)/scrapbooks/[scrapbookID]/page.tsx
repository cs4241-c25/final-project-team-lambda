import Link from 'next/link';

export default function ScrapbookPage({ params }: { params: { scrapbookID: string } }) {
    // Mock page IDs (replace with API call)
    const pages = [1, 2, 3];

    return (
        <div>
            <h1>Scrapbook {params.scrapbookID}</h1>
            <h2>Pages</h2>
            <ul>
                {pages.map((pageID) => (
                    <li key={pageID}>
                        <Link href={`/scrapbooks/${params.scrapbookID}/page/${pageID}`}>
                            Page {pageID}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
