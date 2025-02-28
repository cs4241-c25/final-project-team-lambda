import Image from "next/image";
import { useContext } from "react";

import ScrapbookContext from "./ScrapbookContext";
import { Element } from "@/lib/models";

export default function ScrapbookElement({ el }: { el: Element }) {
    const { setSelectedElement, selectedElement } = useContext(ScrapbookContext);

    if (el.type === "text") return (
        <div
        className="absolute flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setSelectedElement(el)}
        style={{
            top: el.position.y,
            left: el.position.x,
            transform: `rotate(${el.rotation}deg)`,
            width: el.size.x,
            height: el.size.y,
            outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
            backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
        }}>
            <p style={{ fontSize: el.font_size, color: el.color, fontFamily: el.font }}>
                {el.content}
            </p>
        </div>
    )

    if (el.type === "image") return (
        <div
        className="absolute flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setSelectedElement(el)}
        style={{
            top: el.position.y,
            left: el.position.x,
            transform: `rotate(${el.rotation}deg)`,
            width: el.size.x,
            height: el.size.y,
            outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
            backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
        }}>
            <Image 
                src={el.url} alt="Element" className="w-full h-full"
                width={el.size.x} height={el.size.y}
            />
        </div>
    )

    if (el.type === "rectangle") return (
        <div
        className="absolute flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setSelectedElement(el)}
        style={{
            top: el.position.y,
            left: el.position.x,
            transform: `rotate(${el.rotation}deg)`,
            width: el.size.x,
            height: el.size.y,
            outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
            backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
        }}>
            <div className="w-full h-full" style={{ backgroundColor: el.color }}></div>
        </div>
    )

    if (el.type === "circle") return (
        <div
        className="absolute flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={() => setSelectedElement(el)}
        style={{
            top: el.position.y,
            left: el.position.x,
            width: el.size,
            height: el.size,
            outline: el === selectedElement ? "2px solid #FF0000" : "2px dashed transparent",
            backgroundColor: el === selectedElement ? "rgba(255, 0, 0, 0.1)" : "transparent",
        }}>
            <div className="w-full h-full rounded-[50%]" style={{ backgroundColor: el.color }}></div>
        </div>
    )
}