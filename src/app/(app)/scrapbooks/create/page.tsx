"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateScrapbookPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [width, setWidth] = useState(816);
    const [height, setHeight] = useState(1056);
    const [visibility, setVisibility] = useState<"public" | "private">("public");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setCreating(true);
        setError("");

        const result = await fetch("/api/scrapbooks/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, width, height, visibility }),
        });

        if (result.ok) {
            const data = await result.json();
            // redirects to first page
            router.push(`/scrapbooks/${data._id}/`);
        } else {
            setError("Failed to create scrapbook. " + (await result.text()));
        }

        setCreating(false);
    }

    return (
        <main className="flex flex-col justify-center items-center h-full gap-4">
            <h2 className="font-bold">Create a New Scrapbook</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-[500px]">
                <label>Scrapbook Name:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="p-2 mb-2"
                />
                <div className="flex gap-4 mb-2">
                    <div className="flex flex-col flex-grow">
                        <label>Width:</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            min="100"
                            required
                            className="p-2"
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                        <label>Height:</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            min="100"
                            required
                            className="p-2"
                        />
                    </div>
                </div>
                <fieldset className="border-2 border-gray-300 rounded p-2 mb-4">
                    <legend>Visibility:</legend>
                    <input
                        type="radio"
                        value="public"
                        checked={visibility === "public"}
                        onChange={() => setVisibility("public")}
                    />
                    <label className="ml-1 mr-2">Public</label>
                    <input
                        type="radio"
                        value="private"
                        checked={visibility === "private"}
                        onChange={() => setVisibility("private")}
                    />
                    <label className="ml-1 mr-2">Private</label>
                </fieldset>
                <button type="submit" disabled={creating} className="bg-[--mediumgreen] text-white p-2 rounded">
                    {creating ? "Creating..." : "Create Scrapbook"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </main>
    );
}
