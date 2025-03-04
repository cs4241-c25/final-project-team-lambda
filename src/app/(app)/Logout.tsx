"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();

    async function handleClick() {
        await signOut();
        router.refresh();
    }

    return <button className="bg-[--darkgreen] no-underline px-4 py-2 rounded-md hover:text-white" onClick={handleClick}><p>Logout</p></button>
}