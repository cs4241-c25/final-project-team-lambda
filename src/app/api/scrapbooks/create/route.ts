import { createScrapbook } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(_req: Request) {
    const session = await getSession();
    if (!session) return new Response(
        "Unauthorized", { status: 401 }
    );

    // attempt to create scrapbook
    const result = await createScrapbook(session.user.id, "New Scrapbook");

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