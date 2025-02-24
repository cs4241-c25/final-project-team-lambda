import React, { useEffect, useContext } from "react";
import ScrapbookContext from "./ScrapbookContext";

export default function Toolbox() {
    const { selectedElement, updateSelectedElement, deleteSelectedElement } = useContext(ScrapbookContext);

    if (!selectedElement) return (
        <div className="w-64 bg-[#E7E7E7] p-4 shadow-lg h-full"></div>
    )

    const handleUpdate = (key: string, value: any) => {
        updateSelectedElement({ ...selectedElement, [key]: value });
    };

    return (
        <div className="w-64 bg-[#E7E7E7] p-4 shadow-lg h-full flex flex-col">
            <h3 className="text-md font-semibold mb-2" style={{ fontFamily: 'Garogier' }}>
                {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
            </h3>

            {/* position */}
            <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Position:</label>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => handleUpdate("position", { ...selectedElement.position, x: parseInt(e.target.value) })}
                    className="w-full border p-2 rounded" placeholder="X"
                />
                <input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => handleUpdate("position", { ...selectedElement.position, y: parseInt(e.target.value) })}
                    className="w-full border p-2 rounded" placeholder="Y"
                />
            </div>

            {/* size */}
            {selectedElement.type != "circle" && (
                <div>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Size:</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={selectedElement.size.x}
                            onChange={(e) => handleUpdate("size", { ...selectedElement.size, x: parseInt(e.target.value) })}
                            className="w-full border p-2 rounded" placeholder="Width"
                        />
                        <input
                            type="number"
                            value={selectedElement.size.y}
                            onChange={(e) => handleUpdate("size", { ...selectedElement.size, y: parseInt(e.target.value) })}
                            className="w-full border p-2 rounded" placeholder="Height"
                        />
                    </div>
                </div>
            )}
            {selectedElement.type === "circle" && (
                <div>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Size:</label>
                    <input
                        type="number"
                        value={selectedElement.size}
                        onChange={(e) => handleUpdate("size", parseInt(e.target.value))}
                        className="w-full border p-2 rounded" placeholder="Diameter"
                    />
                </div>
            )}

            {/* text properties */}
            {selectedElement.type === "text" && (
                <div>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Content:</label>
                    <input
                        type="text"
                        value={selectedElement.content}
                        onChange={(e) => handleUpdate("content", e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Enter text..."
                    />
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Font Size:</label>
                    <input
                        type="number"
                        value={selectedElement.font_size}
                        onChange={(e) => handleUpdate("font_size", parseInt(e.target.value) || 1)}
                        className="w-full border p-2 rounded"
                        min="1"
                    />
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Font:</label>
                    <select
                        value={selectedElement.font}
                        onChange={(e) => handleUpdate("font", e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option>Arial</option>
                        <option>Times New Roman</option>
                        <option>Courier New</option>
                        <option>Verdana</option>
                    </select>
                </div>
            )}

            {/* image properties */}
            {selectedElement.type === "image" && (
                <>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>URL:</label>
                    <input
                        type="text"
                        value={selectedElement.url}
                        onChange={(e) => handleUpdate("url", e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </>
            )}

            {/* color */}
            {selectedElement.type !== "image" &&
                <div>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Color:</label>
                    <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) => handleUpdate("color", e.target.value)}
                        className="w-full"
                    />
                </div>
            }

            {/* rotation */}
            { selectedElement.type !== "circle" && (
            <div>
                <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Rotation:</label>
                <input
                    type="number"
                    value={selectedElement.rotation}
                    onChange={(e) => handleUpdate("rotation", parseInt(e.target.value) || 0)}
                    className="w-full border p-2 rounded"
                    min="0"
                    max="360"
                    step="1"
                />
            </div>
            )}

            <button
                onClick={deleteSelectedElement}
                className="mt-4 p-2 bg-red-500 text-white rounded"
                style={{ fontFamily: 'Garogier'
            }}>
                Delete
            </button>
        </div>
    );
};