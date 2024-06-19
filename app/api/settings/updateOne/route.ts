import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { settings } = await req.json();
    console.log("route", settings);

    const query = { _id: new ObjectId(settings._id) };

    delete settings._id;

    const update = { $set: { ...settings } };

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("settings").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
