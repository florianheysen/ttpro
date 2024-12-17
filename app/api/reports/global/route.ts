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

        const processedIngredients = processOrders(orders);
        processedIngredients.sort((a, b) => a.name.localeCompare(b.name));
        return NextResponse.json(processedIngredients);
    } catch (e) {
        console.error(e);
    }
}

function processOrders(orders: any[]): any[] {
    const idMap = new Map<string, any>();

    orders.forEach((order: any) => {
        if (order.meals && Array.isArray(order.meals)) {
            order.meals.forEach((meal: any) => {
                if (meal.selectedIngredients && Array.isArray(meal.selectedIngredients)) {
                    processIngredients(idMap, meal.selectedIngredients, meal.qty || 1);
                }
            });
        }

        if (order.specialMeals && Array.isArray(order.specialMeals)) {
            order.specialMeals.forEach((specialMeal: any) => {
                if (specialMeal.selectedIngredients && Array.isArray(specialMeal.selectedIngredients)) {
                    processIngredients(idMap, specialMeal.selectedIngredients, specialMeal.quantity || 1);
                }
            });
        }

        if (order.vrac && Array.isArray(order.vrac)) {
            processIngredients(idMap, order.vrac, 1); // Assuming `vrac` doesn't have a `quantity` field.
        }
    });

    return Array.from(idMap.values());
}

function processIngredients(idMap: Map<string, any>, ingredients: any[], multiplier: number): any[] {
    ingredients.forEach((ingredient: any) => {
        const itemName = ingredient.name.toLowerCase();
        const rawQty = parseFloat(ingredient.qty) || 0;
        const formattedQty = Math.round(rawQty * multiplier * 100) / 100; // Multiply by the meal quantity
        const unitName = ingredient.unit?.symbol || ingredient.units?.symbol || "×";

        const formattedIngredient = {
            name: itemName.toUpperCase(),
            qty: formattedQty,
            unit: unitName,
        };

        const existingIngredient = idMap.get(itemName);
        if (existingIngredient) {
            existingIngredient.qty = parseFloat((parseFloat(existingIngredient.qty) + formattedQty).toFixed(2)); // Add and format the quantity
        } else {
            idMap.set(itemName, formattedIngredient);
        }
    });

    return Array.from(idMap.values());
}
