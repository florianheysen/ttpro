import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { unit } = await req.json();

    const query = { _id: new ObjectId(unit._id) };

    delete unit._id;

    const update = { $set: { ...unit } };

    console.log("query: ", query);
    console.log("update: ", update);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("units").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
