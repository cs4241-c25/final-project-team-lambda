"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Register() {
    const router = useRouter();

    const [registerStatus, setRegisterStatus] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function register() {
        setRegisterStatus("Registering...");

        // register
        const registerResult = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username, password
            })
        });

        // stop if registration fails
        if (!registerResult.ok) {
            const body = await registerResult.text();
            setRegisterStatus(body);
            return
        } else {
            setRegisterStatus("Registration was successful. Logging in...");
        }

        // login
        const loginResult = await signIn('credentials', { redirect: false, username, password });
        if (!loginResult || !loginResult.ok) {
            setRegisterStatus("Login failed. Redirecting to login...");
            setTimeout(() => { router.push("/login") }, 2000)
        } else {
            router.push("/scrapbooks");
        }
    }

    return (
        <main>
            <h1>Register</h1>
            <form action={register}>
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" required minLength={3}
                    onChange={(e) => { setUsername(e.target.value)}}/>
                <label htmlFor="password">Password:</label>
                <input type="password" name="password" id="password" required minLength={8}
                    onChange={(e) => { setPassword(e.target.value)}}/>
                <label htmlFor="confirm">Confirm Password:</label>
                <input type="password" name="confirm" id="confirm"
                    onChange={(e) => {
                        e.target.setCustomValidity(
                            (password !== e.target.value) ? "Passwords must match." : ""
                        );
                    }}
                    required minLength={8} />
                <button type="submit">Register</button>
                <p>{registerStatus}</p>
            </form>
        </main>
    );
}