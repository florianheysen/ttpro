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

        return NextResponse.json(organizeSpecialMeals(orders));
    } catch (e) {
        console.error(e);
    }
}

function organizeSpecialMeals(orders: any[]) {
    const result: any = [];
  
    orders.forEach((order) => {
      if (order.specialMeals && Array.isArray(order.specialMeals) && order.specialMeals.length > 0) {
        order.specialMeals.forEach((specialMeal: { personnes: any; selectedIngredients: any[]; }) => {
          const specialMealObj = {
            personnes: specialMeal.personnes || 0,
            clientName: order.clientName || "Unknown",
            num: order.num || "Unknown",
            deliveryDate: order.delivery_date || "Unknown",
            selectedIngredients: specialMeal.selectedIngredients.map((ingredient) => {
              return [ingredient.qty || 0, ingredient.unit?.name === "pièce" ? "×" : ingredient.unit?.name  || "Unknown", ingredient.name || "Unknown"];
            }),
          };
  
          result.push(specialMealObj);
        });
      }
    });

    result.sort((a: { num: string; }, b: { num: string; }) => {
        const numA = parseInt(a.num.replace("/2023", ""), 10) || 0;
        const numB = parseInt(b.num.replace("/2023", ""), 10) || 0;
        return numA - numB;
      });
  
    return result;
  }