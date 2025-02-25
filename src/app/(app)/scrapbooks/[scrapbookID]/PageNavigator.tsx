// Library imports
import { useState, useContext, useRef } from "react";

// Model imports
import { Page, IScrapbook } from "@/lib/models";

// Component imports
import ScrapbookPage from "./ScrapbookPage";
import ScrapbookContext from "./ScrapbookContext";

export default function PageNavigator(
    { scrapbook, appendPage, addElement }:
    { scrapbook: IScrapbook, appendPage: () => void, addElement: (type: string) => void }
) {
    const { selectedPage, setSelectedPage } = useContext(ScrapbookContext);
    const container = useRef<HTMLDivElement>(null);

    const [ zoom, setZoom ] = useState(1);

    function addPage() {
        appendPage();
        setSelectedPage(selectedPage + 1);
    }

    function fitWidth() {
        const containerWidth = container.current?.clientWidth;
        setZoom(containerWidth ? containerWidth / scrapbook.width : 1);
    }

    function fitHeight() {
        const containerHeight = container.current?.clientHeight;
        setZoom(containerHeight ? containerHeight / scrapbook.height : 1);
    }

    return (
        <div className="flex flex-1 min-h-0 mx-4 gap-2">
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
                        <button onClick={() => fitWidth()}>↔</button>
                        <button onClick={() => fitHeight()}>↕</button>
                        <button onClick={() => setZoom(zoom * 1.1)}>+</button>
                    </div>
                </div>
                <div className="w-full mb-auto overflow-auto relative h-full" ref={container}>
                    <ScrapbookPage
                        size={{width: scrapbook.width, height: scrapbook.height}}
                        page={scrapbook.pages.find((p) => p.number == selectedPage)!}
                        zoom={zoom}
                    />
                </div>
                <p className="text-center h-8 shrink-0">{selectedPage} / {scrapbook.pages.length}</p>
            </div>
            { selectedPage < scrapbook.pages.length ?
                <button className="w-6 m-auto" onClick={() => setSelectedPage(selectedPage + 1)}>{">"}</button> :
                <button className="w-6 m-auto" onClick={addPage}>+</button>
            }
        </div>
    );
}