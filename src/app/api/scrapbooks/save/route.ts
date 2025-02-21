import { saveScrapbook } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) return new Response(
        "Unauthorized", { status: 401 }
    );

    // parse request body
    const scrapbook = await req.json();
    if (!scrapbook) return new Response(
        "Invalid request body", { status: 400 }
    );

    // TODO: validate scrapbook

    // attempt to save scrapbook
    const result = await saveScrapbook(scrapbook, session.user.id);

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