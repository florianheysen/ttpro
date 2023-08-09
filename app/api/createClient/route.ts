import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { client } = await req.json();

    try {
        const mongo = await clientPromise;
        const db = mongo.db("TTPRO_LAMAREEBARLIN");
        const result = await db.collection("clients").insertOne(client);

        const resClient = {
            ...client,
            _id: result.insertedId,
        };

        return NextResponse.json(resClient);
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json(name);
}
