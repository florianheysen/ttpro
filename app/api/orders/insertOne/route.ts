import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";
import posthog from "@/lib/posthog";

export async function POST(req: Request) {
    const { order } = await req.json();
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId as string);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const result = await db.collection("orders").insertOne(order);

        posthog.capture({
            distinctId: userId as string,
            event: "Commande - Création",
            properties: {
                $set: { email: user.emailAddresses[0].emailAddress },
                mongoRes: result,
            },
        });

        const resClient = {
            ...order,
            _id: result.insertedId,
        };

        return NextResponse.json(resClient);
    } catch (e) {
        console.error(e);
    }
}
