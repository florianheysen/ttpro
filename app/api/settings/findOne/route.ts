import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const revalidate = 0;

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id: any = url.searchParams.get("id");

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const settings = await db
            .collection("settings")
            .find({ _id: new ObjectId(id) })
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json(settings[0]);
    } catch (e) {
        console.error(e);
    }
}
