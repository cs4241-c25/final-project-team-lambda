"use client";

// Library imports
import { useParams } from 'next/navigation';
import { useEffect, useState} from 'react';
import { produce } from 'immer';

// Model imports
import { Element, IScrapbook } from '@/lib/models';

// Component imports
import Toolbox from './Toolbox';
import PageNavigator from './PageNavigator';
import ScrapbookContext from './ScrapbookContext';

export default function Scrapbook() {
    const { scrapbookID } = useParams<{ scrapbookID: string }>();

    // scrapbook state
    const [ scrapbook, setScrapbook ] = useState<IScrapbook>();
    const [ selectedElement, setSelectedElement ] = useState<any | null>(null);
    const [ selectedPage, setSelectedPage ] = useState(1);

    // status messages
    const [ scrapbookStatus, setScrapbookStatus ] = useState("loading");
    const [ saveStatus, setSaveStatus ] = useState("");
    const [ timeSinceSave, setTimeSinceSave ] = useState(new Date(0));

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
                setScrapbookStatus("success");
            } else {
                const error = await res.text() as string;
                setScrapbookStatus(error);
            }
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
     * Attempts to save the scrapbook by updating it in the database
     * @param newScrapbook The new scrapbook to save
     */
    async function save(newScrapbook: IScrapbook) {
        // determine if the scrapbook has changed
        if (JSON.stringify(scrapbook) === JSON.stringify(newScrapbook)) return;

        // determine if it has been long enough since last save
        const now = new Date();
        const timeSinceLastSave = now.getTime() - timeSinceSave.getTime();
        if (timeSinceLastSave < 10000) {
            // if it hasn't been long enough, just update the status
            setSaveStatus("Unsaved changes");
            return;
        }

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
            setTimeSinceSave(new Date());
        } else {
            const error = await saveResult.text() as string;
            setSaveStatus(error);
        }
    }


    /**
     * Adds a new element to the scrapbook
     * @param type The type of element to add
     */
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
                position: { x: 200, y: 200 },
                size: { x: 150, y: 150 },
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
                size: 100,
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

    /**
     * Updates the selected element in the scrapbook
     * @param element The new element to replace the old one
     */
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
        save(newScrapbook);
    }

    /**
     * Deletes the selected element from the scrapbook
     */
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
                        <PageNavigator scrapbook={scrapbook} appendPage={appendPage} addElement={addElement} />
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
