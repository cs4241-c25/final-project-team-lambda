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
            router.push(`/scrapbooks/${data._id}/`);
        } else {
            setError("Failed to create scrapbook. " + (await result.text()));
        }

        setCreating(false);
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
            <h2 className="text-3xl font-bold text-[var(--darkestgreen)] mb-6 text-center">
                Create a New Scrapbook
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Scrapbook Name */}
                <label className="block text-lg font-semibold text-[var(--darkestgreen)]">
                    Scrapbook Name:
                    <input
                        className="w-full border rounded-lg py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--mediumgreen)]"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>

                {/* Width & Height Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <label className="block text-lg font-semibold text-[var(--darkestgreen)]">
                        Width:
                        <input
                            className="w-full border rounded-lg py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--mediumgreen)]"
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            min="100"
                            required
                        />
                    </label>

                    <label className="block text-lg font-semibold text-[var(--darkestgreen)]">
                        Height:
                        <input
                            className="w-full border rounded-lg py-2 px-3 mt-1 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--mediumgreen)]"
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            min="100"
                            required
                        />
                    </label>
                </div>

                {/* Visibility Selection */}
                <fieldset className="border border-gray-300 rounded-lg p-4">
                    <legend className="text-lg font-semibold text-[var(--darkestgreen)]">
                        Visibility:
                    </legend>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="public"
                                checked={visibility === "public"}
                                onChange={() => setVisibility("public")}
                                className="accent-[var(--mediumgreen)]"
                            />
                            <span>Public</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value="private"
                                checked={visibility === "private"}
                                onChange={() => setVisibility("private")}
                                className="accent-[var(--mediumgreen)]"
                            />
                            <span>Private</span>
                        </label>
                    </div>
                </fieldset>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-[var(--darkgreen)] text-white text-xl py-3 rounded-lg font-semibold shadow-md hover:bg-[var(--darkergreen)] transition"
                >
                    {creating ? "Creating..." : "Create Scrapbook"}
                </button>

                {/* Error Message */}
                {error && <p className="text-red-600 text-center mt-2">{error}</p>}
            </form>
        </div>
    );
}
