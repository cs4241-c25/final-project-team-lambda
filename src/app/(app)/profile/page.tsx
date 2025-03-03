"use client";

import { useSession } from "next-auth/react";
export default function Profile() {
    const { data: session } = useSession();
    if (!session?.user) return;
    console.log(session);
    return (
        <main>
            <h1>Profile</h1>
        </main>
    );
}