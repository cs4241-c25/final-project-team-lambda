"use client";
//import { useSession } from "@/lib/auth";
import React, { useState, ChangeEvent } from "react";
import {useSession} from "next-auth/react";

export default function Profile() {
    const {data: session} = useSession();

    const [isChecked, setIsChecked] = useState(false);

    if (!(session?.user)) return null;

    console.log(session.user.name);

    const handCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if (event.target.checked) {
            console.log("Checked");
        } else {
            console.log("Unchecked")
        }
    }

    return (
        <main>
            <h1>Profile</h1>
            <h2>Image: </h2>
            <form>

                <label htmlFor="name" >Name: </label>
                <input type="text" id="name" name={"name"} defaultValue={session.user.name}/>
                <input type={"checkbox"} checked={isChecked} onChange={handCheckboxChange}/>

                <h2>Name: { session.user.name }</h2>
                <h2>Username:{ session.user.name } </h2>

            </form>
        </main>
    );
}