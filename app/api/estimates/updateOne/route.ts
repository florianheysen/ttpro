import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { estimate } = await req.json();

    const query = { _id: new ObjectId(estimate._id) };

    delete estimate._id;

    const update = { $set: { ...estimate } };

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("estimates").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
