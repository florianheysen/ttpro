import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        
        const collection = db.collection('orders');

         // Filtres
        const cursor = collection.find({ "meals.code": 'X', "meals.name": "XX" });
    
        const result = [];
        while (await cursor.hasNext()) {
          const doc = await cursor.next();
          result.push(doc);
        }


        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
    }
}
