import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const ingredients = await db
            .collection("ingredients")
            .find({ is_vrac: true })
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json(ingredients);
    } catch (e) {
        console.error(e);
    }
}

export async function POST(req: Request) {
    const { name } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const clients = await db
            .collection("ingredients")
            .find({
                is_vrac: true,
                $or: [{ name: { $regex: name, $options: "i" } }],
            })
            .limit(10)
            .sort({ created_at: 1 })
            .toArray();

        return NextResponse.json(clients);
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json(name);
}
