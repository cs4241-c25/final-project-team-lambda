"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Login() {
    const router = useRouter();
    const params = useSearchParams();
    const [loginStatus, setLoginStatus] = useState("");

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
        <main>
            <h1>Login</h1>
            <form action={login}>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" required />
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Log In</button>
                <p>{loginStatus}</p>
            </form>
        </main>
    );
}