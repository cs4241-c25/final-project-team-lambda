import Image from "next/image";
import { useContext, useState, useRef } from "react";
import { Element } from "@/lib/models";
import ScrapbookContext from "./ScrapbookContext";
import RotateControls from "./RotateControls";

export default function ScrapbookElement({ el }: { el: Element }) {
    const { setSelectedElement, selectedElement, updateSelectedElement } = useContext(ScrapbookContext);
    const [element, setElement] = useState<Element>(el);
    const ref = useRef<HTMLDivElement>(null);

    const handleChange = (updatedElement: Element) => {
        setElement(updatedElement); // Update local state for live changes
    }

    const handleUpdate = (updatedElement: Element) => {
        updateSelectedElement(updatedElement); // Final update to the main scrapbook object
    };

    if (element.type === "text") return (
        <div
            className="absolute flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedElement(el)}
            ref={ref}
            style={{
                top: element.position.y,
                left: element.position.x,
                transform: `rotate(${element.rotation}deg)`,
                width: element.size.x,
                height: element.size.y,
                outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
                backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
            }}>
            {el === selectedElement && <RotateControls element={element} onChange={handleChange} onUpdate={handleUpdate} ref={ref}/>}
            <p style={{ fontSize: element.font_size, color: element.color, fontFamily: element.font }}>
                {element.content}
            </p>
        </div>
    );

    if (element.type === "image") return (
        <div
            className="absolute flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedElement(el)}
            ref={ref}
            style={{
                top: element.position.y,
                left: element.position.x,
                transform: `rotate(${element.rotation}deg)`,
                width: element.size.x,
                height: element.size.y,
                outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
                backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
            }}>
            {el === selectedElement && <RotateControls element={element} onChange={handleChange} onUpdate={handleUpdate} ref={ref}/>}
            <Image
                src={element.url} alt="Element" className="w-full h-full"
                width={element.size.x} height={element.size.y}
            />
        </div>
    );

    if (element.type === "rectangle") return (
        <div
            className="absolute flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedElement(el)}
            ref={ref}
            style={{
                top: element.position.y,
                left: element.position.x,
                transform: `rotate(${element.rotation}deg)`,
                width: element.size.x,
                height: element.size.y,
                outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
                backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
            }}>
            {el === selectedElement && <RotateControls element={element} onChange={handleChange} onUpdate={handleUpdate} ref={ref}/>}
            <div className="w-full h-full" style={{ backgroundColor: element.color }}></div>
        </div>
    );

    if (element.type === "circle") return (
        <div
            className="absolute flex items-center justify-center cursor-pointer"
            onClick={() => setSelectedElement(el)}
            ref={ref}
            style={{
                top: element.position.y,
                left: element.position.x,
                width: element.size,
                height: element.size,
                outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
                backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
            }}>
            {el === selectedElement && <RotateControls element={element} onChange={handleChange} onUpdate={handleUpdate} ref={ref} />}
            <div className="w-full h-full rounded-[50%]" style={{ backgroundColor: element.color }}></div>
        </div>
    );
}