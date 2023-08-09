import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req : NextRequest){
    const url = new URL(req.url)
    const id: any = url.searchParams.get("id")

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const order = await db
            .collection("orders")
            .find({_id: id})
            .sort( { created_at: -1 } )
            .toArray()
 
            return NextResponse.json(order);
    } catch (e) {
        console.error(e);
    }
}