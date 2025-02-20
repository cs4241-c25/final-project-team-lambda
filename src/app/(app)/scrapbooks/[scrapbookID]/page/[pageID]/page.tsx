import Link from 'next/link';

export default function ScrapbookPageDetail({ params }: { params: { scrapbookID: string; pageID: string } }) {
    const currentPage = parseInt(params.pageID, 10) || 1;
    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage = currentPage + 1;

    return (
        <div>
            <h1>Scrapbook {params.scrapbookID} - Page {currentPage}</h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Link href={`/scrapbooks/${params.scrapbookID}/page/${prevPage}`}>
                    <button>&larr; Prev</button>
                </Link>
                <span>Page {currentPage}</span>
                <Link href={`/scrapbooks/${params.scrapbookID}/page/${nextPage}`}>
                    <button>Next &rarr;</button>
                </Link>
            </div>
        </div>
    );
}
