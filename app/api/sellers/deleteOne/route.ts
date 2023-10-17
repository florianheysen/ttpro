import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs";
import posthog from "@/lib/posthog";

export async function POST(req: Request) {
    const { id } = await req.json();
    const { userId } = auth();

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("sellers").deleteOne({ _id: new ObjectId(id) });

        posthog.capture({
            distinctId: userId as string,
            event: "Vendeur - Suppression",
            properties: {
                $set: {},
                mongoRes: result,
            },
        });

        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
