import { Page } from "@/lib/models";

import { useState, useContext } from "react";
import ScrapbookPage from "./ScrapbookPage";
import ScrapbookContext from "./ScrapbookContext";

export default function PageNavigator(
    { pages, appendPage, addElement }:
    { pages: Page[], appendPage: () => void, addElement: (type: string) => void }
) {
    const { selectedPage, setSelectedPage } = useContext(ScrapbookContext);

    const [ zoom, setZoom ] = useState(1);

    function addpage() {
        appendPage();
        setSelectedPage(pages.length);
    }

    return (
        <div className="flex flex-1 min-h-0 m-4 gap-2">
            { selectedPage == 1 ?
                <div className="w-6"></div> :
                <button className="w-6 m-auto" onClick={() => setSelectedPage(selectedPage - 1)}>{"<"}</button>
            }
            <div className="flex flex-1 min-h-0 flex-col gap-2">
                <div className="flex gap-8 justify-center">
                    {/* buttons to add elements */}
                    <div className="flex gap-4">
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
                    <div className="flex gap-2 [&_*]:bg-[#9DA993] [&_*]:text-white [&_*]:rounded [&_*]:w-10">
                        <button onClick={() => setZoom(zoom / 1.1)}>-</button>
                        <button onClick={() => setZoom(1)}>↔</button>
                        <button onClick={() => setZoom(zoom * 1.1)}>+</button>
                    </div>
                </div>
                <div className="min-h-0 w-full mb-auto overflow-auto">
                    <ScrapbookPage page={pages.find((p) => p.number == selectedPage)!} zoom={zoom} />
                </div>
                <p className="text-center h-8 shrink-0">{selectedPage} / {pages.length}</p>
            </div>
            { selectedPage < pages.length - 1 ?
                <button className="w-6 m-auto" onClick={() => setSelectedPage(selectedPage + 1)}>{">"}</button> :
                <button className="w-6 m-auto" onClick={addpage}>+</button>
            }
        </div>
    );
}