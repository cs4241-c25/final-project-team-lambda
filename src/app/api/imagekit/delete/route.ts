import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { fileId } = await req.json();

        if (!fileId) {
            return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
        }

        console.log("Deleting ImageKit file:", fileId); // Debugging

        const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64")}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to delete image from ImageKit:", await response.text());
            return NextResponse.json({ error: "Failed to delete image from ImageKit" }, { status: response.status });
        }

        return NextResponse.json({ message: "Image deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting image from ImageKit:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
