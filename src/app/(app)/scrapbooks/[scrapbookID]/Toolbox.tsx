import React, { useContext } from "react";
import ScrapbookContext from "./ScrapbookContext";

import ValidatedNumberInput from "./ValidatedInput";

export default function Toolbox() {
    const { selectedElement, updateSelectedElement, deleteSelectedElement } = useContext(ScrapbookContext);

    if (!selectedElement) return (
        <div className="w-64 bg-[#E7E7E7] p-4 shadow-lg h-full flex-shrink-0"></div>
    )

    const handleUpdate = (key: string, value: any) => {
        updateSelectedElement({ ...selectedElement, [key]: value });
    };

    return (
        <div className="w-64 bg-[#E7E7E7] p-4 shadow-lg h-full flex flex-col flex-shrink-0">
            <h3 className="text-md font-semibold mb-2" style={{ fontFamily: 'Garogier' }}>
                {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
            </h3>

            {/* position */}
            <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Position:</label>
            <div className="flex gap-2">
                <ValidatedNumberInput 
                    name="position-x"
                    min={-10000}
                    max={10000}
                    step={1}
                    defaultValue={selectedElement.position.x}
                    update={(value) => handleUpdate("position",
                        { ...selectedElement.position, x: value }
                    )}
                />
                <ValidatedNumberInput 
                    name="position-y"
                    min={-10000}
                    max={10000}
                    step={1}
                    defaultValue={selectedElement.position.y}
                    update={(value) => handleUpdate("position",
                        { ...selectedElement.position, y: value }
                    )}
                />
            </div>

            {/* size */}
            {selectedElement.type != "circle" && (
                <div>
                    <label className="block text-sm" style={{ fontFamily: 'Garogier' }}>Size:</label>
                    <div className="flex gap-2">
                        <ValidatedNumberInput
                            name="size-x"
                            min={1}
                            max={10000}
                            step={1}
                            defaultValue={selectedElement.size.x}
                            update={(value) => handleUpdate("size",
                                { ...selectedElement.size, x: value }
                            )}
                        />
                        <ValidatedNumberInput
                            name="size-y"
                            min={1}
                            max={10000}
                            step={1}
                            defaultValue={selectedElement.size.y}
                            update={(value) => handleUpdate("size",
                                { ...selectedElement.size, y: value }
                            )}
                        />
                    </div>
                </div>
            )}
            {selectedElement.type === "circle" && (
                <div>
                    <label htmlFor="size" className="block text-sm" style={{ fontFamily: 'Garogier' }}>Size:</label>
                    <ValidatedNumberInput
                        name="size"
                        min={1}
                        max={10000}
                        step={1}
                        defaultValue={selectedElement.size}
                        update={(value) => handleUpdate("size", value)}
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
                    <label htmlFor="font-size" className="block text-sm" style={{ fontFamily: 'Garogier' }}>Font Size:</label>
                    <ValidatedNumberInput
                        name="font-size"
                        min={1}
                        max={1000}
                        step={1}
                        defaultValue={selectedElement.font_size}
                        update={(value) => handleUpdate("font_size", value)}
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
                    <label htmlFor="rotation" className="block text-sm" style={{ fontFamily: 'Garogier' }}>Rotation:</label>
                    <ValidatedNumberInput
                        name="rotation"
                        min={0}
                        max={360}
                        step={1}
                        defaultValue={selectedElement.rotation}
                        update={(value) => handleUpdate("rotation", value)}
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