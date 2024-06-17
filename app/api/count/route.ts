import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";
import posthog from "@/lib/posthog";

export async function GET() {
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId as string);

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const { n: orderCount } = await db.command({ count: "orders" });
        const { n: clientsCount } = await db.command({ count: "clients" });

        /* posthog.capture({
            distinctId: userId as string,
            event: "Général - Count",
            properties: {
                $set: { email: user.emailAddresses[0].emailAddress },
                mongoRes: { orderCount, clientsCount },
            },
        }); */

        return NextResponse.json({ orderCount, clientsCount });
    } catch (e) {
        console.error(e);
    }
}
