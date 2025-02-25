"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Toolbox from "./Toolbox";

const ScrapbookCanvas = () => {
    const { scrapbookID } = useParams<{ scrapbookID: string }>();
    const [scrapbook, setScrapbook] = useState<{ title: string; width: number; height: number } | null>(null);
    const [elements, setElements] = useState<any[]>([]);
    const [selectedElement, setSelectedElement] = useState<any | null>(null);

    // Fetch scrapbook data to get width & height
    useEffect(() => {
        async function fetchScrapbook() {
            const res = await fetch(`/api/scrapbooks/get/${scrapbookID}`);
            if (res.ok) {
                const data = await res.json();
                setScrapbook({ title: data.title || "Untitled Scrapbook", width: data.width || 816, height: data.height || 1056 });
            }
        }
        fetchScrapbook();
    }, [scrapbookID]);

    // function to delete the selected element
    const deleteElement = () => {
        if (selectedElement) {
            setElements((prevElements) => prevElements.filter((el) => el.id !== selectedElement.id));
            setSelectedElement(null);
        }
    };


    // function to add a new element
    const addElement = (type: string) => {
        const newElement = {
            id: elements.length + 1,
            position: { x: 100, y: 100 },
            rotation: 0,
            ...(type === "text" && {
                type: "text",
                size: { x: 200, y: 50 },
                content: "New Text",
                font_size: 16,
                color: "#000000",
                font: "Arial",
            }),
            ...(type === "image" && {
                type: "image",
                size: { x: 0, y: 0 },
                url: "",
            }),
            ...(type === "rectangle" && {
                type: "rectangle",
                size: { x: 100, y: 50 },
                color: "#BCA88E",
            }),
            ...(type === "circle" && {
                type: "circle",
                size: 50,
                color: "#E4B4B4",
            }),
        };

        setElements((prev) => [...prev, newElement]);
        setTimeout(() => setSelectedElement(newElement), 0);
    };

    // function to update an element
    const handleUpdateElement = (updatedElement: any) => {
        setElements((prev) => prev.map((el) => (el.id === updatedElement.id ? updatedElement : el)));
        setSelectedElement(updatedElement);
    };

    return (
        <div className="flex">
            {/* toolbox  */}
            <Toolbox selectedElement={selectedElement} onUpdateElement={handleUpdateElement} deleteElement={deleteElement} />

            {/* scrapbook canvas */}
            <div className="flex-1 flex flex-col items-center justify-center h-screen bg-[#F5EBE0]">
                <h2 className="text-xl font-bold text-center mb-4">{scrapbook?.title || "Untitled Scrapbook"}</h2>

                {/* Ensure scrapbook is loaded before rendering */}
                {scrapbook ? (
                    <div className="relative border-2 border-gray-400 bg-white"
                         style={{ width: scrapbook.width, height: scrapbook.height }}>
                        {elements.map((el) => (
                            <div
                                key={el.id}
                                onClick={() => setSelectedElement(el)}
                                style={{
                                    position: "absolute",
                                    top: el.position.y,
                                    left: el.position.x,
                                    transform: `rotate(${el.rotation}deg)`,
                                    cursor: "pointer",
                                    width: el.size?.x || el.size * 2,
                                    height: el.size?.y || el.size * 2,
                                    border: el.id === selectedElement?.id ? "2px solid #FF0000" : "2px dashed transparent",
                                    backgroundColor: el.id === selectedElement?.id ? "rgba(255, 0, 0, 0.1)" : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {el.type === "text" && (
                                    <p style={{ fontSize: el.font_size, color: el.color, fontFamily: el.font }}>
                                        {el.content}
                                    </p>
                                )}
                                {el.type === "image" && el.url && (
                                    <>
                                        {console.log("Rendering Image with URL:", el.url)} {/* Debugging */}
                                        <img
                                            src={el.url}
                                            alt="Scrapbook Image"
                                            style={{ width: el.size.x, height: el.size.y }}
                                            onError={(e) => {
                                                console.error("Image failed to load:", el.url);
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </>
                                )}


                                {el.type === "rectangle" && (
                                    <div style={{ width: el.size.x, height: el.size.y, backgroundColor: el.color }} />
                                )}
                                {el.type === "circle" && (
                                    <div style={{ width: el.size * 2, height: el.size * 2, backgroundColor: el.color, borderRadius: "50%" }} />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

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
            </div>
        </div>
    );
};

export default ScrapbookCanvas;
