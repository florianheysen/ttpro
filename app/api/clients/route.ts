import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req : NextRequest){
    const url = new URL(req.url)
    const page: any = url.searchParams.get("page")

    const ITEMS_PER_PAGE = 10;

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const { n: count } = await db.command({count: "clients"})
        const pageCount = count / ITEMS_PER_PAGE
        const skip = (page - 1 ) * ITEMS_PER_PAGE 

        const clients = await db
            .collection("clients")
            .find()
            .limit(ITEMS_PER_PAGE)
            .skip(skip)
            .sort( { name: 1 } )
            .toArray()

            return NextResponse.json({
                pagination : {
                    count,
                    pageCount,
                },
                clients
            });
    } catch (e) {
        console.error(e);
    }
}

export async function POST(req: Request) {
    const { name } = await req.json()

    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const clients = await db
            .collection("clients")
            .find({name:{'$regex' : name, '$options' : 'i'}})
            .limit(10)
            .sort( { created_at: 1 } )
            .toArray()

            return NextResponse.json(clients);
    } catch (e) {
        console.error(e);
    }
    return NextResponse.json(name);
}