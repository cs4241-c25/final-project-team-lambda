import { getScrapbooks } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    const owner = session?.user.id;

    // attempt to get scrapbooks
    const result = await getScrapbooks(owner);

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