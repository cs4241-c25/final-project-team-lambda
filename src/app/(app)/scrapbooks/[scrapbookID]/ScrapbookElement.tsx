import { useState } from "react";
import Image from "next/image";
import { useContext } from "react";
import ScrapbookContext from "./ScrapbookContext";
import DragResize from "./DragResize";
import { Element } from "@/lib/models";

export default function ScrapbookElement({ el }: { el: Element }) {
    const { updateSelectedElement, setSelectedElement, selectedElement } = useContext(ScrapbookContext);
    const [hasResized, setHasResized] = useState(false);

    return (
        <DragResize
            element={el}
            onUpdate={updateSelectedElement}
            onSelect={setSelectedElement}
            isSelected={selectedElement?.id === el.id}
        >
            {el.type === "text" && (
                <p
                    style={{
                        fontSize: el.font_size,
                        color: el.color,
                        fontFamily: el.font,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {el.content}
                </p>
            )}

            {el.type === "image" && (
                <img
                    src={el.url}
                    alt="Scrapbook Image"
                    draggable={false}
                    style={{
                        width: el.size.x,
                        height:  el.size.y,
                        objectFit: "fill",
                    }}
                />
            )}

            {el.type === "rectangle" && (
                <div style={{ width: "100%", height: "100%", backgroundColor: el.color }} />
            )}

            {el.type === "circle" && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: el.color,
                        borderRadius: "50%",
                    }}
                />
            )}
        </DragResize>
    );
}