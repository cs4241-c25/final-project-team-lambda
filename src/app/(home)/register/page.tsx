"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";

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
        <main
            className="flex flex-col justify-center items-center h-full bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('https://picsum.photos/1920/1080')" }}
        >
            <div className="bg-white rounded flex flex-col items-center p-8">
                <h1 className="font-bold">Register</h1>
                <form action={register} className="flex flex-col gap-2 w-80">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text" name="username" id="username" required minLength={3}
                        onChange={(e) => { setUsername(e.target.value)}}
                        className="p-2 mb-2"
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password" name="password" id="password" required minLength={8}
                        onChange={(e) => { setPassword(e.target.value)}}
                        className="p-2 mb-2"
                    />
                    <label htmlFor="confirm">Confirm Password:</label>
                    <input
                        type="password" name="confirm" id="confirm"
                        onChange={(e) => {
                            e.target.setCustomValidity(
                                (password !== e.target.value) ? "Passwords must match." : ""
                            );
                        }}
                        required minLength={8}
                         className="p-2 mb-4"
                    />
                    <div className="flex gap-2 justify-between items-center">
                        <button type="submit" className="px-4 py-2 bg-[--mediumgreen] rounded text-white">Register</button>
                        <Link href="/register">Already have an account?</Link>
                    </div>
                    <p>{registerStatus}</p>
                </form>
            </div>
        </main>
    );
}