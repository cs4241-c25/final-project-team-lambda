"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

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
            <div
                className="bg-cover bg-center bg-fixed h-screen flex justify-center items-center"
                 style={{ backgroundImage: "url('https://picsum.photos/1920/1080')"}} // or scrapbook pages collage image
            >
            <div className="bg-white mx-4 p-8 rounded shadow-md w-full md:w-1/2 lg:w-1/3">
            <h1 className="text-3xl font-bold mb-8 text-center text-black">Log In</h1>
            <form action={login}>
                <div className="mb-4">
                <label className="block font-semibold text-[var(--darkestgreen)] mb-2" htmlFor="username">Username:</label>
                <input
                    className="border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    required
                />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold text-[var(--darkestgreen)] mb-2" htmlFor="password">Password:</label>
                    <input
                        className="border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="flex items-center mb-6">
                    <button
                        className="bg-[var(--darkgreen)] hover:bg-[var(--darkergreen)] text-white font-bold py-2 px-4 rounded focus:outline-non focus:shadow-outline"
                        type="submit"
                        >
                        Log In
                    </button>
                    <a href="/register" className="underline ml-auto">
                        <h2 className="text-[var(--darkergreen)] text-lg font-bold">No Account? Register Here</h2>
                    </a>
                </div>
                <p>{loginStatus}</p>
            </form>
            </div>
            </div>
        </main>
    );
}