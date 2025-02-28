import { createContext } from "react";
import { Element } from "@/lib/models";

const ScrapbookContext = createContext<{
    selectedElement: Element | null
    setSelectedElement: (element: Element | null) => void
    selectedPage: number
    setSelectedPage: (page: number) => void
    updateSelectedElement: (element: Element) => void
    deleteSelectedElement: () => void
}>({
    selectedElement: null,
    setSelectedElement: () => {},
    selectedPage: 0,
    setSelectedPage: () => {},
    updateSelectedElement: () => {},
    deleteSelectedElement: () => {}
});

export default ScrapbookContext;