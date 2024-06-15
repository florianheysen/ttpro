import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const revalidate = 0;

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const ingredients = await db
            .collection("ingredients")
            .find({ is_sp: true })
            .sort({ name: 1 })
            .collation({ locale: "fr", caseLevel: true })
            .toArray();

        return NextResponse.json(ingredients);
    } catch (e) {
        console.error(e);
    }
}
