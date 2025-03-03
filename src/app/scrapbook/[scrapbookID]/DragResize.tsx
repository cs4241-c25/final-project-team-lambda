import React, { useState, useEffect } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";

interface DragResizeProps {
    element: any;
    onUpdate: (updatedElement: any) => void;
    onSelect: (element: any) => void;
    isSelected: boolean;
    children: React.ReactNode;
}

const DragResize: React.FC<DragResizeProps> = ({
    element,
    onUpdate,
    onSelect,
    isSelected,
    children,
}) => {
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [startPos, setStartPos] = useState({ mouseX: 0, mouseY: 0, elementX: 0, elementY: 0 });
    const [startSize, setStartSize] = useState({ width: 0, height: 0 });

    // function to get the elements width and height
    const getElementDimensions = () => {
        if (element.size && typeof element.size === "object") {
            return { width: element.size.x, height: element.size.y };
        } else if (typeof element.size === "number") {
            return { width: element.size * 2, height: element.size * 2 };
        } else if (element.scale) {
            return { width: element.scale.x * 100, height: element.scale.y * 100 };
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
        onSelect(element);
        setDragging(true);
        setStartPos({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: element.position.x,
            elementY: element.position.y,
        });
    };

    // function to handle dragging and resizing
    // prevents dragging if element is locked and saves the starting position
    const handleMouseMove = (e: MouseEvent) => {
        if (element.isLocked) return;
        const deltaX = e.clientX - startPos.mouseX;
        const deltaY = e.clientY - startPos.mouseY;

        if (dragging) {
            onUpdate({
                ...element,
                position: { x: startPos.elementX + deltaX, y: startPos.elementY + deltaY },
            });
        } else if (resizing) {
            if (element.size && typeof element.size === "object") {
                onUpdate({
                    ...element,
                    size: {
                        x: Math.max(20, startSize.width + deltaX),
                        y: Math.max(20, startSize.height + deltaY),
                    },
                });
            } else if (typeof element.size === "number") {
                const newDiameter = Math.max(20, startSize.width + deltaX);
                onUpdate({
                    ...element,
                    size: newDiameter / 2,
                });
            } else if (element.scale) {
                onUpdate({
                    ...element,
                    scale: {
                        x: Math.max(0.1, startSize.width + deltaX) / 100,
                        y: Math.max(0.1, startSize.height + deltaY) / 100,
                    },
                });
            }
        }
    };

    // stops dragging and resizing
    const handleMouseUp = () => {
        if (dragging) setDragging(false);
        if (resizing) setResizing(false);
    };

    useEffect(() => {
        if (dragging || resizing) {
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
    }, [dragging, resizing, startPos, startSize, element]);

    // function to start resizing
    const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (element.isLocked) return;
        e.stopPropagation();
        onSelect(element);
        setResizing(true);
        setStartPos({
            mouseX: e.clientX,
            mouseY: e.clientY,
            elementX: element.position.x,
            elementY: element.position.y,
        });
        setStartSize(getElementDimensions());
    };

    // function to lock/unlock element
    const toggleLock = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect(element); // check element is selected before locking
        onUpdate({ ...element, isLocked: !element.isLocked });
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: element.position.y,
                left: element.position.x,
                transform: `rotate(${element.rotation}deg)`,
                width: dimensions.width,
                height: dimensions.height,
                border: isSelected ? "2px dashed #FF0000" : "2px dashed transparent",
                backgroundColor: isSelected ? "rgba(255, 0, 0, 0.1)" : "transparent",
                cursor: element.isLocked ? "default" : dragging ? "grabbing" : "grab",
                userSelect: "none",
                pointerEvents: "auto", // allow locked elements to be selected
            }}
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
        </div>
    );
};

export default DragResize;
