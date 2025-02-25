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

    // save scrapbook status
    const [ saveStatus, setSaveStatus ] = useState("Saved");


    /**
     * Fetches the scrapbook from the database
     */
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

    /**
     * Appends a new page to the scrapbook and saves it
     */
    function appendPage() {
        if (!scrapbook) return;

        // add a new page to the scrapbook
        // since react doesn't re-render on mutations,
        // we need to use immer to create a new object
        const newScrapbook = produce(scrapbook, draft => {
            if (!draft) return;
            draft.pages.push({
                number: draft.pages.length + 1,
                elements: []
            });
        });

        // update the scrapbook state
        setScrapbook(newScrapbook);
        save(newScrapbook);
    }

    /**
     * Saves the scrapbook by updating it in the database
     * @param newScrapbook The new scrapbook to save
     */
    async function save(newScrapbook: IScrapbook) {
        // save the scrapbook
        setSaveStatus("Saving...");
        const saveResult = await fetch(`/api/scrapbooks/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newScrapbook)
        });

        if (saveResult.ok) {
            setSaveStatus("Saved");
        } else {
            const error = await saveResult.text() as string;
            setSaveStatus(error);
        }
    }

    /**
     * Deletes the current scrapbook
     * @param scrapbookID takes scrapbook and deletes it from database
     */
    async function deleteScrapbook(scrapbookID: string) {
        const res = await fetch("/api/scrapbooks/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scrapbookID }),
        });

        if (res.ok) {
            console.log("Scrapbook deleted successfully");
            window.location.href = "/scrapbooks"; // Redirect to scrapbook list after deletion - or router.push("/scrapbooks")
        } else {
            const errorText = await res.text();
            console.error("Error deleting scrapbook:", errorText);
        }
    }

    if (scrapbookStatus === "success" && scrapbook) {
        return (
            <div>
                <p>{saveStatus}</p>
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
                <button
                    onClick={() => { if (confirm("Are you sure you want to delete this scrapbook?")) {deleteScrapbook(scrapbookID);}}}>
                    Delete
                </button>
                <button onClick={appendPage}>+ Add Page</button>
            </div>
        );
    } else if (scrapbookStatus === "loading") {
        return <div>Loading...</div>;
    } else {
        return <div>Error: {scrapbookStatus}</div>;
    }
}
