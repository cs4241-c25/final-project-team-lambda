import { update } from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.json();

    const result = await update(body.formName, body.email, body.username);
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