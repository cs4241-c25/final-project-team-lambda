"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { produce } from "immer";
import Canvas from "../../ScrapbookCanvas";
import Toolbox from "../../Toolbox";

import { IScrapbook } from "@/lib/models";

export default function ScrapbookPageDetail() {
    const { scrapbookID, pageID } = useParams<{ scrapbookID: string; pageID: string }>();

    // State
    const [scrapbook, setScrapbook] = useState<IScrapbook | null>(null);
    const [scrapbookStatus, setScrapbookStatus] = useState("loading");
    const [saveStatus, setSaveStatus] = useState("Saved");

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

        // Add a new page using immer
        const newScrapbook = produce(scrapbook, draft => {
            if (!draft) return;
            draft.pages.push({
                number: draft.pages.length + 1,
                elements: []
            });
        });

        // Update state for immediate UI response
        setScrapbook(newScrapbook);
        save(newScrapbook);
    }

    /**
     * Saves the scrapbook by updating it in the database
     * @param newScrapbook The updated scrapbook object
     */
    async function save(newScrapbook: IScrapbook) {
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
            const error = await saveResult.text();
            setSaveStatus(error);
        }
    }

    if (scrapbookStatus === "success" && scrapbook) {
        const currentPageNumber = Number(pageID);
        const prevPageExists = currentPageNumber > 1;
        const nextPageExists = scrapbook.pages.some((p) => p.number === currentPageNumber + 1);

        return (
            <div>
                <p>{saveStatus}</p>
                <Toolbox />
                <Canvas />
                {/* Navigation Controls */}
                <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                    {/* Left Arrow: Show only if it's not page 1 */}
                    {prevPageExists && (
                        <Link href={`/scrapbooks/${scrapbookID}/page/${currentPageNumber - 1}`}>
                            <button>&larr; Prev</button>
                        </Link>
                    )}

                    <span>Page {currentPageNumber}</span>

                    {/* Right Navigation: Show + if next page does not exist */}
                    {nextPageExists ? (
                        <Link href={`/scrapbooks/${scrapbookID}/page/${currentPageNumber + 1}`}>
                            <button>Next &rarr;</button>
                        </Link>
                    ) : (
                        <button onClick={appendPage}>+</button>
                    )}
                </div>
            </div>
        );
    } else if (scrapbookStatus === "loading") {
        return <div>Loading...</div>;
    } else {
        return <div>Error: {scrapbookStatus}</div>;
    }
}
