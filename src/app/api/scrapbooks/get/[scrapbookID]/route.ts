import { getScrapbook } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ scrapbookID: string }> }
) {
    const session = await getSession();
    const scrapbookID = (await params).scrapbookID;

    // attempt to get scrapbook
    const result = await getScrapbook(scrapbookID, session?.user.id);

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