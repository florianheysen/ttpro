import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(){
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");
 
        const ingredients = await db
            .collection("ingredients")
            .find({})
            .sort( { created_at: -1 } )
            .toArray()
 
            return NextResponse.json(ingredients);
    } catch (e) {
        console.error(e);
    }
}