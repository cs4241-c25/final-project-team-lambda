import { deleteScrapbook } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(req: Request) {
    const session = await getSession();

    if (!session || !session.user || !session.user.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { scrapbookID } = await req.json();

        if (!scrapbookID) {
            return new Response("Error: ScrapbookID is required", { status: 400 });
        }

        // Attempt to delete the scrapbook
        const result = await deleteScrapbook(scrapbookID, session.user.id);

        if (result.ok) {
            return new Response(null, { status: 204 });
        } else {
            return new Response(result.error, { status: result.code });
        }
    } catch (error) {
        console.error("Error processing DELETE request:", error);
        return new Response("Server Error", { status: 500 });
    }
}