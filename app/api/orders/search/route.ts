import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { searchTerm } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const orders = await db
            .collection("orders")
            .find({
                $or: [
                    { clientName: { $regex: searchTerm, $options: "i" } },
                    { num: { $regex: searchTerm, $options: "i" } },
                ],
            })
            .limit(10)
            .sort({ created_at: 1 })
            .toArray();

        return NextResponse.json(orders);
    } catch (e) {
        console.error(e);
    }
}
