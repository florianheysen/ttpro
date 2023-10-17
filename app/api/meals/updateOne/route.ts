import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// TODO : mise à jour d'un `meal`

export async function POST(req: Request) {
    const { meal } = await req.json();

    const query = { _id: new ObjectId(meal._id) };

    delete meal._id;

    const update = { $set: { ...meal } };

    console.log("query: ", query);
    console.log("update: ", update);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("meals").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
