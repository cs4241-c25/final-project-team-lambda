"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Sticker {
    url: string;
    width: number;
    height: number;
}

interface StickersProps {
    onSelect: (url: string, width: number, height: number) => void;
}

export default function Stickers({ onSelect }: StickersProps) {
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch stickers from the database
    useEffect(() => {
        async function fetchStickers() {
            try {
                const res = await fetch("/api/stickers");
                if (res.ok) {
                    const data = await res.json();
                    setStickers(data);
                } else {
                    console.error("Failed to fetch stickers");
                }
            } catch (error) {
                console.error("Error fetching stickers:", error);
            }
            setLoading(false);
        }
        fetchStickers();
    }, []);

    if (loading) {
        return <p>Loading stickers...</p>;
    }

    return (
        <div className="mt-4">
            <h4 className="text-sm font-semibold">Preset Stickers</h4>
            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                <div className="grid grid-cols-3 gap-2">
                    {stickers.map((sticker, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(sticker.url, sticker.width, sticker.height)}
                            className="border p-1 rounded hover:shadow-lg transition"
                        >
                            <Image
                                src={sticker.url}
                                alt={`Sticker ${index + 1}`}
                                width={sticker.width / 4}
                                height={sticker.height / 4}
                                className="object-contain"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
