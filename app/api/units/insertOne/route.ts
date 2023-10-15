import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { unit } = await req.json();

    try {
        const mongo = await clientPromise;
        const db = mongo.db("TTPRO_LAMAREEBARLIN");
        const result = await db.collection("units").insertOne(unit);

        const resUnit = {
            ...unit,
            _id: result.insertedId,
        };

        return NextResponse.json(resUnit);
    } catch (e) {
        console.error(e);
    }
}
