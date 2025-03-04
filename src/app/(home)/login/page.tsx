"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const params = useSearchParams();
    const [loginStatus, setLoginStatus] = useState("");

    const imageURL = "https://picsum.photos/1920/1080";

    // redirect to get rid of that ugly callbackUrl search param
    // it should probably be re-implemented at some point
    useEffect(() => {
        if (params.get("callbackUrl")) router.replace("/login");
    })

    async function login(data: FormData) {
        setLoginStatus("Logging in...");

        const username = data.get("username");
        const password = data.get("password");

        // do some validation

        const result = await signIn('credentials', { redirect: false, username, password });
        if (!result || !result.ok) {
            setLoginStatus("Login failed.");
        } else {
            router.push("/scrapbooks");
        }
    }

    return (
        <main
            className="flex flex-col justify-center items-center h-full bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
        >
            <div className="bg-white rounded flex flex-col items-center p-8">
                <h1 className="font-bold">Log In</h1>
                <form action={login} className="flex flex-col gap-2 w-80">
                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" required className="p-2 mb-2" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" required className="p-2 mb-4" />
                    <div className="flex gap-2 justify-between items-center">
                        <button type="submit" className="px-4 py-2 bg-[--mediumgreen] rounded text-white">Log In</button>
                        <Link href="/register">Don't have an account?</Link>
                    </div>
                    <p>{loginStatus}</p>
                </form>
            </div>
        </main>
    );
}