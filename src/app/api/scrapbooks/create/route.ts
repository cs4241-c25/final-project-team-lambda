import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createScrapbook } from "@/lib/db";

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, width, height, visibility } = await req.json();

        if (!title || !width || !height || !visibility) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await createScrapbook(session.user.id, { title, width, height, visibility });

        if (!result.ok) {
            throw new Error(result.error);
        }

        return NextResponse.json({ _id: result.data._id }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error creating scrapbook" }, { status: 500 });
    }
}
