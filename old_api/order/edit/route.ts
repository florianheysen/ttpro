import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { order } = await req.json();

    const query = { _id: new ObjectId(order._id) };

    delete order._id;

    const update = { $set: { ...order } };

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("orders").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
