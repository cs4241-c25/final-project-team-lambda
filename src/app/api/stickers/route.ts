import { NextResponse } from "next/server";
import { getStickers } from "@/lib/db";

export async function GET(_req: Request) {
    const result = await getStickers();

    if (result.ok) {
        return NextResponse.json(result.data, { status: result.code });
    } else {
        return new Response(result.error, { status: result.code });
    }
}
