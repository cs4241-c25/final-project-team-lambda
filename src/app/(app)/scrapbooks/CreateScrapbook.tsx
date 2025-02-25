"use client";

import { useRouter } from "next/navigation";
import { IScrapbook } from "@/lib/models";

export default function CreateScrapbook() {
    const router = useRouter();

    async function createScrapbook() {
        const result = await fetch("/api/scrapbooks/create", {
            method: "POST"
        });

        if (result.ok) {
            const scrapbook = await result.json() as IScrapbook;
            router.push(`/scrapbooks/${scrapbook._id}`);
        } else {
            console.error(await result.text());
        }
    }

    return (
        <button
            onClick={createScrapbook}
            className="flex items-center justify-center w-10 h-10 bg-[var(--darkestgreen)] text-white rounded-full shadow hover:bg-[var(--darkgreen)] transition"
        >
            +
        </button>    );
}