import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);

        const url = new URL(req.url);
        const from: any = url.searchParams.get("from");
        const to: any = url.searchParams.get("to");

        let query = {};

        if (!to) {
            query = {
                delivery_date: {
                    $gte: from,
                },
            };
        } else {
            query = {
                delivery_date: {
                    $gte: from,
                    $lte: to,
                },
            };
        }

        const orders = await db.collection("orders").find(query).sort({ created_at: -1 }).toArray();

        const test = checkMealTypes(orders);

        return NextResponse.json(test);
    } catch (e) {
        console.error(e);
    }
}

function checkMealTypes(mealObjects: any[]): any[] {
    const mealTypes: Set<string> = new Set(["meal-hot", "meal-cold", "meal-special", "meal-huitres"]);
    const results: any[] = [];

    mealObjects.forEach((mealObject: any) => {
        const result: any = {
            orderNumber: mealObject.num,
            clientName: mealObject.clientName,
            deliveryDate: mealObject.delivery_date,
            sellerName: mealObject.seller,
        };

        mealTypes.forEach((type: string) => {
            const camelCaseType = type.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            result[camelCaseType] = mealObject.meals.some((meal: any) => meal.category === type);
        });

        result.vrac = mealObject.vrac && Object.keys(mealObject.vrac).length > 0;
        result.specialMeals = mealObject.specialMeals && Object.keys(mealObject.specialMeals).length > 0;

        results.push(result);
    });

    return results.reverse();
}
