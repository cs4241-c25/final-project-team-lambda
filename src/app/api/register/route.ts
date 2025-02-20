import { register } from "@/lib/db";

export async function POST(req: Request) {
    // validate request
    const body = await req.json();

    if (typeof body !== "object") return new Response(
        "Malformed request body", { status: 400 }
    );

    if (!("username" in body) || typeof body.username !== "string") return new Response(
        "Missing username", { status: 400 }
    );

    if (body.username.length < 3) return new Response(
        "Username must be at least 3 characters", { status: 400 }
    );

    if (!("password" in body) || typeof body.password !== "string") return new Response(
        "Missing password", { status: 400 }
    );

    if (body.password.length < 8) return new Response(
        "Password must be at least 8 characters", { status: 400 }
    );

    // attempt to register user
    const result = await register(body.username, body.password);
    console.log(result);

    // send result
    if (result.ok) {
        return Response.json(
            result.data, { status: result.code }
        );
    } else {
        return new Response(
            result.error, { status: result.code }
        )
    }
}