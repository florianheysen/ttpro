import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    const { seller } = await req.json();

    const query = { _id: new ObjectId(seller._id) };

    delete seller._id;

    const update = { $set: { ...seller } };

    console.log("query: ", query);
    console.log("update: ", update);

    try {
        const mongo = await clientPromise;
        const db = mongo.db("TTPRO_LAMAREEBARLIN");
        const result = await db.collection("sellers").updateOne(query, update);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
