"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState} from 'react';
import { produce } from 'immer';
import { Element } from '@/lib/models';

import Toolbox from './Toolbox';

import { IScrapbook } from '@/lib/models';

import PageNavigator from './PageNavigator';

import ScrapbookContext from './ScrapbookContext';

export default function Scrapbook() {
    const { scrapbookID } = useParams<{ scrapbookID: string }>();

    // scrapbook state
    const [ scrapbook, setScrapbook ] = useState<IScrapbook>();
    const [ scrapbookStatus, setScrapbookStatus ] = useState("loading");
    const [ selectedElement, setSelectedElement ] = useState<any | null>(null);
    const [ selectedPage, setSelectedPage ] = useState(1);

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

    // function to add a new element
    const addElement = (type: string) => {
        if (!scrapbook) return;

        let element: Element;
        if (type === "text") {
            element = {
                type: "text",
                position: { x: 100, y: 100 },
                size: { x: 200, y: 50 },
                rotation: 0,
                content: "New Text",
                font_size: 16,
                color: "#000000",
                font: "Arial",
            }
        } else if (type === "image") {
            const randomSeed = Math.floor(Math.random() * 200);
            element = {
                type: "image",
                position: { x: 150, y: 150 },
                scale: { x: 1, y: 1 },
                rotation: 0,
                url: `https://picsum.photos/seed/${randomSeed}/150`,
            }
        } else if (type === "rectangle") {
            element = {
                type: "rectangle",
                position: { x: 100, y: 100 },
                size: { x: 100, y: 50 },
                rotation: 0,
                color: "#BCA88E",
            }
        } else if (type === "circle") {
            element = {
                type: "circle",
                position: { x: 100, y: 100 },
                size: 50,
                color: "#E4B4B4",
            }
        } else {
            throw new Error("Invalid element type");
        }

        const newScrapbook = produce(scrapbook, draft => {
            if (!draft) return;
            for (const page of draft.pages)
                if (page.number === selectedPage)
                    page.elements.push(element);
        });

        // update the scrapbook state
        setScrapbook(newScrapbook);
    };

    function updateSelectedElement(element: Element) {
        if (!scrapbook) return;

        // this SUCKS i'm sorry
        let pageIndex = -1;
        let elementIndex = -1;
        for (let i = 0; i < scrapbook.pages.length; i++) {
            for (let j = 0; j < scrapbook.pages[i].elements.length; j++) {
                if (scrapbook.pages[i].elements[j] === selectedElement) {
                    pageIndex = i;
                    elementIndex = j;
                    break;
                }
            }
        }

        if (pageIndex === -1 || elementIndex === -1) return;

        const newScrapbook = produce(scrapbook, draft => {
            draft.pages[pageIndex].elements[elementIndex] = element;
        });

        // update the scrapbook state
        setScrapbook(newScrapbook);
        setSelectedElement(element);
    }

    function deleteSelectedElement() {
        if (!scrapbook || !selectedElement) return;

        // this SUCKS i'm sorry
        let pageIndex = -1;
        let elementIndex = -1;
        for (let i = 0; i < scrapbook.pages.length; i++) {
            for (let j = 0; j < scrapbook.pages[i].elements.length; j++) {
                if (scrapbook.pages[i].elements[j] === selectedElement) {
                    pageIndex = i;
                    elementIndex = j;
                    break;
                }
            }
        }

        if (pageIndex === -1 || elementIndex === -1) return;

        const newScrapbook = produce(scrapbook, draft => {
            draft.pages[pageIndex].elements.splice(elementIndex, 1);
        });

        // update the scrapbook state
        setScrapbook(newScrapbook);
        setSelectedElement(null);
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement instanceof HTMLInputElement) return;

                // Prevent backspace from navigating back
                e.preventDefault();
                deleteSelectedElement();
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [deleteSelectedElement]);

    if (scrapbookStatus === "success" && scrapbook) {
        return (
            <div className="flex flex-1 min-h-0 flex-col">
                <header className="flex items-center gap-4 px-4">
                    <h1>{scrapbook.title}</h1>
                    <p>{saveStatus}</p>
                </header>
                <main className="flex flex-1 min-h-0">
                    <ScrapbookContext.Provider value={{
                        selectedElement, setSelectedElement,
                        selectedPage, setSelectedPage,
                        updateSelectedElement, deleteSelectedElement
                    }}>
                        <Toolbox />
                        <div className="flex flex-col flex-1 min-h-0">
                            {/* buttons to add elements */}
                            <div className="flex gap-4 mt-4">
                                {["text", "image", "rectangle", "circle"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => addElement(type)}
                                        className="p-2 bg-[#9DA993] text-white rounded"
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <PageNavigator pages={scrapbook.pages} appendPage={appendPage} />
                        </div>
                    </ScrapbookContext.Provider>
                </main>
            </div>
        );
    } else if (scrapbookStatus === "loading") {
        return <div>Loading...</div>;
    } else {
        return <div>Error: {scrapbookStatus}</div>;
    }
}
