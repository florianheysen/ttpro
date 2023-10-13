import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const units = await db.collection("units").find().sort({ name: 1 }).toArray();

        return NextResponse.json({ units });
    } catch (e) {
        console.error(e);
    }
}
