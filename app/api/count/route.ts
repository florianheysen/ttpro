import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const { n: orderCount } = await db.command({ count: "orders" });
        const { n: clientsCount } = await db.command({ count: "clients" });
        const { n: estimatesCount } = await db.command({ count: "estimates" });

        return NextResponse.json({ orderCount, clientsCount, estimatesCount });
    } catch (e) {
        console.error(e);
    }
}
