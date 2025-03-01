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
        <main>
            <div
                className="bg-cover bg-center bg-fixed h-screen flex justify-center items-center"
                style={{ backgroundImage: "url('https://picsum.photos/1920/1080')"}} // or scrapbook pages collage image
            >
            <div className="bg-white mx-4 p-8 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-5xl font-bold mb-2 text-center text-black">LifeLog</h1>

                <h1 className="text-3xl font-bold mb-4 text-center text-[var(--darkergreen)]">Register</h1>
            <form action={register}>
                <div className="mb-4">
                    <label className="block font-semibold text-[var(--darkestgreen)] mb-2" htmlFor="username">Username:</label>
                    <input
                        className="border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        required minLength={3}
                        onChange={(e) => { setUsername(e.target.value)}}
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-[var(--darkestgreen)] mb-2" htmlFor="password">Password:</label>
                    <input
                        className="border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name="password"
                    placeholder= "Password"
                        required minLength={8}
                        onChange={(e) => { setPassword(e.target.value)}}/>
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-[var(--darkestgreen)] mb-2" htmlFor="confirm">Confirm Password:</label>
                    <input
                        className="border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="confirm"
                        type="password"
                        name="confirm"
                        placeholder="Confirm Password"
                            onChange={(e) => {
                            e.target.setCustomValidity((password !== e.target.value) ? "Passwords must match." : "");
                            }}
                            required minLength={8}
                    />
                </div>
                <div className="flex items-center mb-4">
                    <button
                        className="bg-[var(--darkgreen)] hover:bg-[var(--darkergreen)] text-white font-bold py-2 px-4 rounded focus:outline-non focus:shadow-outline"
                        type="submit">
                        Register
                    </button>
                    <Link href="login" className="underline ml-auto">
                        <h2 className="text-[var(--darkergreen)] font-semibold" style={{ fontSize: 'var(--mediumtext)'}}>Already have an account? Log in here</h2>
                    </Link>
                </div>
                <p>{registerStatus}</p>
            </form>
            </div>
            </div>
        </main>
    );
}