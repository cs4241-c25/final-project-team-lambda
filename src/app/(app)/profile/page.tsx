"use client";
import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
    const {data: session} = useSession();
    if (!(session?.user)) return null;

    const [nameIsReadOnly, setNameIsReadOnly] = useState(true);
    const [emailIsReadOnly, setEmailIsReadOnly] = useState(true);
    const [formData, setFormData] = useState({
        name: session.user.profName,
        email: session.user.email,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const formName = formData.name;
        const email = formData.email;
        const username = session.user.username;

        const update = await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify({
                formName, email , username
            })
        })

        event.preventDefault();
    }

    return (
        <main className="flex flex-col m-auto items-center gap-4">
            <h2>Hello, {session.user.username}!</h2>
            <form className="flex flex-col gap-4 w-[400px]">
                <div className="flex gap-2 items-center">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text" disabled={nameIsReadOnly} id="name" name="name"
                        onChange={handleInputChange} defaultValue={session.user.profName}
                        className="flex-grow px-2 py-1 disabled:border-gray-300"
                    />
                    <label htmlFor="edit-name" className="cursor-pointer w-12 py-1.5 text-center bg-[--mediumgreen] rounded"
                    >{nameIsReadOnly ? "Edit" : "Lock"}</label>
                    <input
                        id="edit-name" type="checkbox" checked={!nameIsReadOnly}
                        onChange={() => setNameIsReadOnly(!nameIsReadOnly)} hidden
                    />
                </div>
                <div className="flex gap-2 mb-4 items-center">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text" disabled={emailIsReadOnly} id={"email"} name={"email"}
                        onChange={handleInputChange} defaultValue={session.user.email}
                        className="flex-grow px-2 py-1 disabled:border-gray-300"
                    /> 
                    <label htmlFor="edit-email" className="cursor-pointer w-12 py-1.5 text-center bg-[--mediumgreen] rounded"
                    >{emailIsReadOnly ? "Edit" : "Lock"}</label>
                    <input
                        id="edit-email" type="checkbox" checked={!emailIsReadOnly}
                        onChange={() => setEmailIsReadOnly(!emailIsReadOnly)} hidden
                    />
                </div>
                <button
                    type={"button"} onClick={clickHandler}
                    className="bg-[--mediumgreen] text-white p-2 rounded"
                >Update</button>
            </form>
        </main>
    );
}