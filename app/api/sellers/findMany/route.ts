import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const revalidate = 0;

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const sellers = await db.collection("sellers").find({}).sort({ created_at: -1 }).toArray();

        return NextResponse.json(sellers);
    } catch (e) {
        console.error(e);
    }
}
