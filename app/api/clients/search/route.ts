import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { name } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const clients = await db
            .collection("clients")
            .find({ name: { $regex: name, $options: "i" } })
            .limit(10)
            .sort({ created_at: 1 })
            .toArray();

        return NextResponse.json(clients);
    } catch (e) {
        console.error(e);
    }
    return NextResponse.json(name);
}
