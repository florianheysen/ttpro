import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";
import posthog from "@/lib/posthog";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { seller } = await req.json();
    const { userId } = auth();

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const user = await clerkClient.users.getUser(userId as string);

        const result = await db.collection("sellers").insertOne(seller);

        const resClient = {
            ...seller,
            _id: result.insertedId,
        };

        posthog.capture({
            distinctId: userId as string,
            event: "Vendeur - Création",
            properties: {
                $set: { email: user.emailAddresses[0].emailAddress },
                toFront: resClient,
                mongoRes: result,
            },
        });

        return NextResponse.json(resClient);
    } catch (e) {
        console.error(e);
    }
}
