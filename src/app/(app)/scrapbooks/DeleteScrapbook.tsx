"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteScrapbook({ scrapbookID }: { scrapbookID: string }) {
    const router = useRouter();

    const [buttonText, setButtonText] = useState("Delete");

    /**
     * Deletes the current scrapbook
     * @param scrapbookID takes scrapbook and deletes it from database
     */
     async function deleteScrapbook(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        // Confirm deletion
        if (!confirm("Are you sure you want to delete this scrapbook?")) return;

        setButtonText("Deleting...");

        // Send DELETE request to the server
        const res = await fetch("/api/scrapbooks/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ scrapbookID }),
        });

        // Handle the response
        if (res.ok) {
            router.push("/scrapbooks");
        } else {
            setButtonText("Error!");
            const errorText = await res.text();
            console.error("Error deleting scrapbook:", errorText);
        }
    }

    return (
        <button onClick={deleteScrapbook} className="hover:underline">{buttonText}</button>
    )
}