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
        <div>
            <h2>Create a New Scrapbook</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Scrapbook Name:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Width:
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        min="100"
                        required
                    />
                </label>
                <label>
                    Height:
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="100"
                        required
                    />
                </label>
                <fieldset>
                    <legend>Visibility:</legend>
                    <label>
                        <input
                            type="radio"
                            value="public"
                            checked={visibility === "public"}
                            onChange={() => setVisibility("public")}
                        />
                        Public
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="private"
                            checked={visibility === "private"}
                            onChange={() => setVisibility("private")}
                        />
                        Private
                    </label>
                </fieldset>
                <button type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create Scrapbook"}
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
}
