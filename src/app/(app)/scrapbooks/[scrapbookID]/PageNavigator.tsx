import { Page } from "@/lib/models";

import { useState } from "react";
import ScrapbookPage from "./ScrapbookPage";

export default function PageNavigator(
    { pages, appendPage }:
    { pages: Page[], appendPage: () => void } ) {
    const [ currentPage, setCurrentPage ] = useState(0);

    function addpage() {
        appendPage();
        setCurrentPage(pages.length);
    }

    return (
        <div className="flex items-center justify-center w-full h-full bg-gray-200">
            { currentPage == 0 ?
                <div className="w-6"></div> :
                <button className="w-6" onClick={() => setCurrentPage(currentPage - 1)}>{"<"}</button>
            }
            <div className="flex-1 h-full">
                <ScrapbookPage page={pages[currentPage]} numPages={pages.length} />
            </div>
            { currentPage < pages.length - 1 ?
                <button className="w-6" onClick={() => setCurrentPage(currentPage + 1)}>{">"}</button> :
                <button className="w-6" onClick={addpage}>+</button>
            }
        </div>
    );
}