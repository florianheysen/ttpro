import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

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
        const db = client.db(process.env.MONGO_DB_NAME);

        const escapedSearchTerm = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regexPattern = new RegExp(`${escapedSearchTerm}`, "i"); // Acutel : string compris dans... // Si on veut 'commence par' : new RegExp(`^${escapedSearchTerm}`, "i");

        const clients = await db
            .collection("ingredients")
            .find({
                is_vrac: true,
                $or: [{ name: { $regex: regexPattern } }],
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
