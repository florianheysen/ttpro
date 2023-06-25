import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(){
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");
 
        const orders = await db
            .collection("orders")
            .find({})
            .sort( { created_at: -1 } )
            .toArray()
 
            return NextResponse.json(orders);
    } catch (e) {
        console.error(e);
    }
}