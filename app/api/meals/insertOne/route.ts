import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { meal } = await req.json();

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("meals").insertOne(meal);

        const resMeal = {
            ...meal,
            _id: result.insertedId,
        };

        return NextResponse.json(resMeal);
    } catch (e) {
        console.error(e);
    }
}
