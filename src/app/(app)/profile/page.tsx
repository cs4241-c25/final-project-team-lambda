"use client";
//import { useSession } from "@/lib/auth";
import React, { useState, ChangeEvent } from "react";
import {useSession} from "next-auth/react";

export default function Profile() {
    const {data: session} = useSession();

    const [isCheckedName, setIsCheckedName] = useState(false);
    const [isCheckedEmail, setIsCheckedEmail] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [isReadOnlyEmail, setIsReadOnlyEmail] = useState(true);

    if (!(session?.user)) return null;

    //console.log(session.user.name);

    const handCheckboxChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setIsCheckedName(event.target.checked);
        if (event.target.checked) {
            setIsReadOnly(false)
        } else {
            setIsReadOnly(true)
        }
    }

    const handCheckboxChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setIsCheckedEmail(event.target.checked);
        if (event.target.checked) {
            setIsReadOnlyEmail(false)
        } else {
            setIsReadOnlyEmail(true)
        }
    }

    return (
        <main>
            <h2>Image: </h2>
            <form>

                <h1>Profile Information</h1>

                <h2>Username:{session.user.name} </h2>

                <label htmlFor="name">Name: </label>
                <input type="text" readOnly={isReadOnly} id="name" name={"name"} defaultValue={session.user.name}/>
                <input type={"checkbox"} checked={isCheckedName} onChange={handCheckboxChangeName}/>

                <br/>

                <label htmlFor={"email"}>Email: </label>
                <input type={"text"} readOnly={isReadOnlyEmail} id={"email"} name={"email"}/>
                <input type={"checkbox"} checked={isCheckedEmail} onChange={handCheckboxChangeEmail}/>


            </form>
        </main>
    );
}