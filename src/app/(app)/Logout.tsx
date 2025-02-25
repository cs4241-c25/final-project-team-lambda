"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    async function handleClick() {
        await signOut();
        router.refresh();
    }

    return <button className="no-underline hover:underline" onClick={handleClick}>Logout</button>
}