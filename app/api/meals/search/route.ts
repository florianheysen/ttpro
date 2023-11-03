import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    const { name } = await req.json();

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const clients = await db
            .collection("meals")
            .find({
                $and: [
                    {
                        $or: [
                            { mealName: { $regex: name, $options: "i" } },
                            { mealCode: { $regex: name, $options: "i" } },
                        ],
                    },
                    { $or: [{ indisponible: { $exists: false } }, { indisponible: false }] },
                ],
            })
            .limit(15)
            .sort({ created_at: 1 })
            .toArray();

        return NextResponse.json(clients);
    } catch (e) {
        console.error(e);
    }

    return NextResponse.json(name);
}
