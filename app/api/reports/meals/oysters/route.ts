import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";

const category = "meal-huitres";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

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

        const resObj = groupAndFilter(orders);

        resObj.sort((a, b) => a.meal_name.localeCompare(b.meal_name));

        resObj.forEach((meal) => {
            meal.orders.sort(
                (a: { order_code: string }, b: { order_code: string }) =>
                    parseInt(a.order_code) - parseInt(b.order_code)
            );
        });

        return NextResponse.json(resObj);
    } catch (e) {
        console.error(e);
    }
}

function groupAndFilter(orders: any[]): any[] {
    const groupedOrders: Record<any, any> = {};

    orders.forEach((order: any) => {
        order.meals.forEach((meal: any) => {
            const mealCode: any = meal.code;
            const mealName: any = meal.name;
            const mealId: any = meal.id;
            const mealQty: any = meal.qty;
            const mealCategory: any = meal.category;
            const mealComment: any = meal.comment;

            if (mealCategory === category) {
                if (!groupedOrders[mealId]) {
                    groupedOrders[mealId] = {
                        meal_code: mealCode,
                        meal_name: mealName,
                        meal_qty: mealQty,
                        orders: [],
                    };
                } else {
                    groupedOrders[mealId].meal_qty += mealQty;
                }

                groupedOrders[mealId].orders.push({
                    order_code: order.num,
                    order_delivery_date: order.delivery_date,
                    order_client_name: order.clientName,
                    order_individual_qty: meal.qty,
                    meal_comment: mealComment,
                    meal: meal,
                });
            }
        });
    });

    const result: any = Object.values(groupedOrders).filter((groupedOrder: any) =>
        groupedOrder.orders.some((order: any) => order.meal.category === category)
    );

    removeMeal(result);

    return result;
}

function removeMeal(data: any) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].orders) {
            for (let j = 0; j < data[i].orders.length; j++) {
                if (data[i].orders[j].meal) {
                    delete data[i].orders[j].meal;
                }
            }
        }
    }
}
