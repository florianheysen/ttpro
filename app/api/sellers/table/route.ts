import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const page: any = url.searchParams.get("page");

    const ITEMS_PER_PAGE = 10;

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const { n: count } = await db.command({ count: "sellers" });
        const pageCount = count / ITEMS_PER_PAGE;
        const skip = (page - 1) * ITEMS_PER_PAGE;

        const sellers = await db
            .collection("sellers")
            .find()
            .limit(ITEMS_PER_PAGE)
            .skip(skip)
            .sort({ name: 1 })
            .toArray();

        return NextResponse.json({
            pagination: {
                count,
                pageCount,
            },
            sellers,
        });
    } catch (e) {
        console.error(e);
    }
}
