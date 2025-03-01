import { useState, useEffect, useRef } from "react";
import { Element } from "@/lib/models";

interface TransformControlsProps {
    element: Element;
    onChange: (updatedElement: Element) => void;
    onUpdate: (updatedElement: Element) => void;
    ref: React.RefObject<HTMLDivElement | null>;
}

export default function TransformControls({ element, onChange, onUpdate, ref }: TransformControlsProps) {
    const [isTransforming, setIsTransforming] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isTransforming) return;

            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            console.log("centerX", centerX);
            console.log("centerY", centerY);
            const angle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90 + 360) % 360;
            console.log(angle);

            const newElement = {
                ...element,
                rotation: angle
            };

            onChange(newElement); // Update the element live
        };

        const handleMouseUp = () => {
            if (!isTransforming) return;
            setIsTransforming(false);
            onUpdate(element); // Final update on mouse release
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isTransforming, onChange, onUpdate]);

    return (
        <div className="absolute bottom-full flex flex-col items-center">
            <button
                aria-label="Rotate Element"
                className="w-2 h-2 rounded-full bg-gray-200 border-2 border-red-600"
                onMouseDown={() => setIsTransforming(true)}
            ></button>
            <div className="w-0.5 h-3 bg-red-600"></div>
        </div>
    );
}