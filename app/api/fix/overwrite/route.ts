import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        
        const collection = db.collection('orders');

        // Filtres
        const cursor = collection.find({ "meals.code": 'X', "meals.name": "XX" });
    
        while (await cursor.hasNext()) {
            const doc: any = await cursor.next();
            doc.meals.forEach((meal: any) => {
                // Changer le contenu des propriétés
                meal.name = 'XX';
            });
            await collection.replaceOne({ _id: doc._id }, doc);
            console.log(`Document mis à jour : ${doc._id}`);
          }


        return NextResponse.json(true);
    } catch (e) {
        console.error(e);
    }
}
