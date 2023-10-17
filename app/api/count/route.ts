import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
/* import { auth } from "@clerk/nextjs"; */

export async function GET() {
    /* const { orgSlug } = auth();

    console.log(orgSlug); */
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const { n: orderCount } = await db.command({ count: "orders" });
        const { n: clientsCount } = await db.command({ count: "clients" });

        return NextResponse.json({ orderCount, clientsCount });
    } catch (e) {
        console.error(e);
    }
}
