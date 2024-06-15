import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        
        const collection = db.collection('orders');

         // Filtres
        const cursor = collection.find({ "meals.code": 'PL2', "meals.name": "PL 2 (1 lang, 2 gambas, 1 pince, 5 CF, 100g bulots, 50g grises, 50g bigor, 5 huitres, 1 palourde, 1 praire, 1 clams)" });
    
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
