import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { ingredient } = await req.json();

    const query = { _id: new ObjectId(ingredient._id) };

    delete ingredient._id;

    const update = { $set: { ...ingredient } };

    console.log("query: ", query);
    console.log("update: ", update);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("ingredients").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
