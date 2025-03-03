import { useContext, useState } from "react";
import ScrapbookContext from "./ScrapbookContext";
import TransformControls from "./TransformControls";
import { Element } from "@/lib/models";

export default function ScrapbookElement({ el }: { el: Element }) {
    const { selectedElement } = useContext(ScrapbookContext);

    // local element state
    const [element, setElement] = useState(el);

    return (
        <TransformControls
            element={element}
            onUpdate={setElement}
            isSelected={selectedElement === el}
        >
            {element.type === "text" && (
                <p
                    style={{
                        fontSize: element.font_size,
                        color: element.color,
                        fontFamily: element.font,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {element.content}
                </p>
            )}

            {element.type === "image" && (
                <img
                    src={element.url}
                    alt="Scrapbook Image"
                    draggable={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                    }}
                />
            )}

            {element.type === "rectangle" && (
                <div style={{ width: "100%", height: "100%", backgroundColor: element.color }} />
            )}

            {element.type === "circle" && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: element.color,
                        borderRadius: "50%",
                    }}
                />
            )}
        </TransformControls>
    );
}