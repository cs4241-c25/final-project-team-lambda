import { getSession } from "@/lib/auth";
import {mockProviders, mockSession} from "next-auth/client/__tests__/helpers/mocks";
//import user = mockSession.user;
//import credentials = mockProviders.credentials;

export default async function Profile() {
    const session = await getSession();
    const user = session
    console.log(session.user.name);

    return (
        <main>
            <h1>Profile</h1>
            <h2>Image: </h2>
            <h2>Name: </h2>
            <h2>Username: </h2>
            <h2>Password: </h2>
        </main>
    );
}