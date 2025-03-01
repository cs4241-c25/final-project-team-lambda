"use client";

import { useState } from "react";

interface StickerProps {
    onClick: (url: string, width: number, height: number) => void;
}

export default function Stickers({ onClick }: StickerProps) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);



    return (
        <div className="flex flex-col items-center gap-4">
        </div>
    );
}
