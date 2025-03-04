"use client";
import React, { useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
    const {data: session} = useSession();
    if (!(session?.user)) return null;

    const [isCheckedName, setIsCheckedName] = useState(false);
    const [isCheckedEmail, setIsCheckedEmail] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);
    const [isReadOnlyEmail, setIsReadOnlyEmail] = useState(true);
    const [formData, setFormData] = useState({
        name: session.user.profName,
        email: session.user.email,
    });

    

    console.log(session);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        //console.log(session.user);
    }

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

    const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(formData)

        const formName = formData.name;
        const email = formData.email;
        const username = session.user.username;

        const update = await fetch("/api/update", {
            method: "POST",
            body: JSON.stringify({
                formName, email , username
            })
        })

        
        if (!update.ok) {
            console.log("Cool")
        } else {
            console.log("Cooler")
        }
        

        event.preventDefault();
    }

    return (
        <main>
            <h2>Image: </h2>
            <form>
                <h1>Profile Information</h1>

                <h2>Username:{session.user.username} </h2>

                <label htmlFor="name">Name: </label>
                <input type="text" readOnly={isReadOnly} id="name" name={"name"} onChange={handleInputChange} defaultValue={session.user.profName}/>
                <input type={"checkbox"} checked={isCheckedName} onChange={handCheckboxChangeName}/>

                <br/>

                <label htmlFor={"email"}>Email: </label>
                <input type={"text"} readOnly={isReadOnlyEmail} id={"email"} name={"email"} onChange={handleInputChange} defaultValue={session.user.email}/>
                <input type={"checkbox"} checked={isCheckedEmail} onChange={handCheckboxChangeEmail}/>

                <br/>

                <button type={"button"} onClick={clickHandler}>Update</button>
            </form>
        </main>
    );
}