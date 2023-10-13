import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { client } = await req.json();

    const query = { _id: new ObjectId(client._id) };

    delete client._id;

    const update = { $set: { ...client } };

    console.log("query: ", query);
    console.log("update: ", update);

    try {
        const mongo = await clientPromise;
        const db = mongo.db("TTPRO_LAMAREEBARLIN");
        const result = await db.collection("clients").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
