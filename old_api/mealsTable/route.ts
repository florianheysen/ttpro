import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req : NextRequest){
    const url = new URL(req.url)
    const page: any = url.searchParams.get("page")
    const category: any = url.searchParams.get("category")

    const ITEMS_PER_PAGE = 10;

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const count = await db.collection("meals").countDocuments({ mealCategory: category});
        const pageCount = count / ITEMS_PER_PAGE
        const skip = (page - 1 ) * ITEMS_PER_PAGE 

        const meals = await db
            .collection("meals")
            .find({ mealCategory: category })
            .limit(ITEMS_PER_PAGE)
            .skip(skip)
            .sort( { mealCode: 1 } )
            .toArray()

            return NextResponse.json({
                pagination : {
                    count,
                    pageCount,
                },
                meals
            });
    } catch (e) {
        console.error(e);
    }
}