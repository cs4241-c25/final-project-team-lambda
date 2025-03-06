import React, { useState, useEffect, useContext, useRef } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import ScrapbookContext from "./ScrapbookContext";
import { Element } from "@/lib/models";

interface TransformControlsProps {
    el: Element
    children: React.ReactNode;
}

export default function TransformControls({ el, children }: TransformControlsProps) {
    // local element state
    const [element, setElement] = useState<Element & { isLocked?: boolean }>({ ...el, isLocked: false });
    useEffect(() => setElement((prev) => ({ ...el, isLocked: prev.isLocked })), [el]);
    const ref = useRef<HTMLDivElement>(null);

    // element manipulation context
    const { selectedElement, setSelectedElement, updateSelectedElement } = useContext(ScrapbookContext);
    const isSelected = el === selectedElement;
    
    // state to track dragging, resizing, and rotating
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [rotating, setRotating] = useState(false);

    // state to track starting position and size
    const [startPos, setStartPos] = useState({ mouseX: 0, mouseY: 0, elementX: 0, elementY: 0 });
    const [startSize, setStartSize] = useState({ width: 0, height: 0 });

    // function to get the elements width and height
    const getElementDimensions = () => {
        if (element.size && typeof element.size === "object") {
            return { width: element.size.x, height: element.size.y };
        } else if (typeof element.size === "number") {
            return { width: element.size * 2, height: element.size * 2 };
        }
        return { width: 100, height: 100 };
    };

    const dimensions = getElementDimensions();

    // function to start dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if ((e.target as HTMLElement).classList.contains("lock-button")) return;
        if (element.isLocked && isSelected) return;
        if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
        e.stopPropagation();

        setSelectedElement(el);
        setDragging(true);
        setStartPos({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: element.position.x,
            elementY: element.position.y,
        });
    };

    useEffect(() => {
        // function to handle dragging and resizing
        // prevents dragging if element is locked and saves the starting position
        const handleMouseMove = (e: MouseEvent) => {
            if (element.isLocked) return;
            const deltaX = e.clientX - startPos.mouseX;
            const deltaY = e.clientY - startPos.mouseY;

            if (dragging) {
                setElement({
                    ...element,
                    position: { x: startPos.elementX + deltaX, y: startPos.elementY + deltaY },
                });
            } else if (resizing) {
                if (element.type !== "circle") {
                    setElement({
                        ...element,
                        size: {
                            x: Math.max(20, startSize.width + deltaX),
                            y: Math.max(20, startSize.height + deltaY),
                        },
                    });
                } else if (element.type == "circle") {
                    const newDiameter = Math.max(20, startSize.width + deltaX);
                    setElement({
                        ...element,
                        size: newDiameter / 2,
                    });
                }
            } else if (rotating) {
                if (!("rotation" in element)) return;

                const rect = ref.current?.getBoundingClientRect();
                if (!rect) return;

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const angle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90 + 360) % 360;
                setElement({
                    ...element,
                    rotation: Math.round(angle),
                });
            }
        };

        // stops dragging and resizing
        const handleMouseUp = () => {
            if (dragging) setDragging(false);
            if (resizing) setResizing(false);
            if (rotating) setRotating(false);

            // update the element, removing the isLocked property
            const { ...newElement } = element;
            delete newElement.isLocked;
            updateSelectedElement(newElement);
        };

        if (dragging || resizing || rotating) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, resizing, rotating, startPos, startSize, element, updateSelectedElement]);

    // function to start resizing
    const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (element.isLocked) return;
        e.stopPropagation();

        setSelectedElement(el);
        setResizing(true);
        setStartPos({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: element.position.x,
            elementY: element.position.y,
        });
        setStartSize(getElementDimensions());
    };

    const handleRotateMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (element.isLocked) return;
        e.stopPropagation();
        setSelectedElement(el);
        setRotating(true);
    }

    // function to lock/unlock element
    const toggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSelected) return;
        setElement({ ...element, isLocked: !element.isLocked });
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: element.position.y,
                left: element.position.x,
                transform: ("rotation" in element) ? `rotate(${element.rotation}deg)` : "none",
                width: dimensions.width,
                height: dimensions.height,
                border: isSelected ? "2px dashed #FF0000" : "2px dashed transparent",
                backgroundColor: isSelected ? "rgba(255, 0, 0, 0.1)" : "transparent",
                cursor: element.isLocked ? "default" : dragging ? "grabbing" : "grab",
                userSelect: "none",
                pointerEvents: "auto", // allow locked elements to be selected
            }}
            ref={ref}
        >
            {children}

            {/* lock/unlock button */}
            {isSelected && (
                <button
                    className="lock-button"
                    onClick={toggleLock}
                    style={{
                        position: "absolute",
                        top: -15,
                        right: -15,
                        background: "white",
                        border: "1px solid black",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                    }}
                >
                    {element.isLocked ? <FaLock size={16} /> : <FaLockOpen size={16} />}
                </button>
            )}

            {/* resize handles */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((position) => {
                const cursorStyle =
                    position === "top-right" || position === "bottom-left"
                        ? "nesw-resize"
                        : "nwse-resize";
                const style =
                    position === "top-left"
                        ? { top: -5, left: -5 }
                        : position === "top-right"
                            ? { top: -5, right: -5 }
                            : position === "bottom-left"
                                ? { bottom: -5, left: -5 }
                                : { bottom: -5, right: -5 };
                return (
                    <div
                        key={position}
                        className={`resize-handle ${position}`}
                        style={{
                            position: "absolute",
                            ...style,
                            width: 10,
                            height: 10,
                            backgroundColor: isSelected ? "black" : "transparent",
                            cursor: cursorStyle,
                            display: element.isLocked ? "none" : "block",
                        }}
                        onMouseDown={handleResizeMouseDown}
                    />
                );
            })}
            { "rotation" in element && isSelected && !element.isLocked &&
                <div className="absolute bottom-full left-[48%] flex flex-col items-center pointer-events-none">
                    <button
                        aria-label="Rotate Element"
                        className="w-2 h-2 rounded-full bg-gray-200 border-2 border-red-600 pointer-events-auto cursor-grab"
                        onMouseDown={handleRotateMouseDown}
                    ></button>
                    <div className="w-0.5 h-3 bg-red-600"></div>
                </div>
            }
        </div>
    );
};