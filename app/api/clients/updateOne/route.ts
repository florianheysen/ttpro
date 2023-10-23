import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { client } = await req.json();

    const query = { _id: new ObjectId(client._id) };

    delete client._id;

    const update = { $set: { ...client } };

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("clients").updateOne(query, update);

        console.log(result);

        const resClient = {
            ...query,
            ...update.$set,
        };

        return NextResponse.json(resClient);
    } catch (e) {
        console.error(e);
    }
}
