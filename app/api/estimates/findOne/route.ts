import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { convertOrder } from "@/lib/utils";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id: any = url.searchParams.get("id");

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const estimate = await db
            .collection("estimates")
            .find({ _id: new ObjectId(id) })
            .sort({ created_at: -1 })
            .toArray();

        const formattedEstimate = convertOrder(estimate[0]);

        return NextResponse.json(formattedEstimate);
    } catch (e) {
        console.error(e);
    }
}
