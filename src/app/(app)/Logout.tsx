"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
    return (
        <button className="no-underline hover:underline" onClick={() => signOut()}>Logout</button>
    )
}