import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const { n: orderCount } = await db.command({ count: "orders" });
        const { n: clientsCount } = await db.command({ count: "clients" });

        return NextResponse.json({ orderCount, clientsCount });
    } catch (e) {
        console.error(e);
    }
}
