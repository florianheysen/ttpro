import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const meals = await db.collection("meals").find({}).sort({ created_at: -1 }).toArray();

        return NextResponse.json(meals);
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
            .collection("meals")
            .find({
                $or: [{ mealName: { $regex: name, $options: "i" } }, { mealCode: { $regex: name, $options: "i" } }],
            })
            .limit(7)
            .sort({ created_at: 1 })
            .toArray();

        return NextResponse.json(clients);
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json(name);
}
