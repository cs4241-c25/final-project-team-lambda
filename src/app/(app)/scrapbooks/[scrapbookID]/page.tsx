"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState} from 'react';
import { produce } from 'immer';

import { IScrapbook } from '@/lib/models';

export default function ScrapbookPage() {
    const { scrapbookID } = useParams<{ scrapbookID: string }>();

    // scrapbook state
    const [ scrapbook, setScrapbook ] = useState<IScrapbook>();
    const [ scrapbookStatus, setScrapbookStatus ] = useState("loading");

    // load scrapbook
    useEffect(() => {
        async function fetchScrapbook() {
            setScrapbookStatus("loading");
            const res = await fetch(`/api/scrapbooks/get/${scrapbookID}`);
            if (res.ok) {
                const data = await res.json() as IScrapbook;
                setScrapbook(data);
            } else {
                const error = await res.text() as string;
                setScrapbookStatus(error);
            }
            setScrapbookStatus("success");
        }
        fetchScrapbook();
    }, [scrapbookID]);

    function appendPage() {
        // add a new page to the scrapbook
        setScrapbook(produce(draft => {
            // since react doesn't re-render on mutations,
            // we need to use immer to create a new object
            if (!draft) return;
            draft.pages.push({
                number: draft.pages.length + 1,
                elements: []
            });
        }));
    }

    if (scrapbookStatus === "success" && scrapbook) {
        return (
            <div>
                <h1>{scrapbook.title}</h1>
                <h2>Pages</h2>
                <ul>
                    {scrapbook.pages.map((page) => (
                        <li key={page.number}>
                            <Link href={`/scrapbooks/${scrapbookID}/page/${page.number}`}>
                                Page {page.number}
                            </Link>
                        </li>
                    ))}
                </ul>
                <button onClick={appendPage}>+ Add Page</button>
            </div>
        );
    } else if (scrapbookStatus === "loading") {
        return <div>Loading...</div>;
    } else {
        return <div>Error: {scrapbookStatus}</div>;
    }
}
