"use client";

import { useState } from "react";

interface ImageUploadProps {
    onUpload: (url: string, width: number, height: number) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        const res = await fetch("/api/imagekit/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();


            const img = new Image();
            img.onload = () => {
                onUpload(data.url, img.width, img.height);
                setLoading(false);
            };
            img.src = data.url;
        } else {
            console.error("Image upload failed");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <input type="file" onChange={handleFileChange} accept="image/*" />
            {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />}
            <button onClick={handleUpload} disabled={loading} className="p-2 bg-blue-500 text-white rounded">
                {loading ? "Uploading..." : "Upload Image"}
            </button>
        </div>
    );
}
