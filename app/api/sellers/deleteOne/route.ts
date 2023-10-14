import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { id } = await req.json();

    console.log(id);

    try {
        const mongo = await clientPromise;
        const db = mongo.db("TTPRO_LAMAREEBARLIN");
        const result = await db.collection("sellers").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
