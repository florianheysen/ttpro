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

        return NextResponse.json(trierPlatsChauds(orders));
    } catch (e) {
        console.error(e);
    }
}

function trierPlatsChauds(data: any[]) {
    const category = "meal-special";
  
    const listePlatsChauds: any[] = [];
  
    data.forEach((commande) => {
      commande.meals.forEach((plat: any) => {
        if (plat.category === category) {
          const normalizedCode = plat.code.replace(/\s/g, "").toUpperCase();
  
          const existingPlatIndex = listePlatsChauds.findIndex((p) => p.meal_code === normalizedCode);
  
          if (existingPlatIndex !== -1) {
            const existingPlat = listePlatsChauds[existingPlatIndex];
            existingPlat.meal_qty += plat.qty;
  
            const existingOrderIndex = existingPlat.orders.findIndex((o: any) => o.order_code === commande.num);
  
            if (existingOrderIndex !== -1) {
              existingPlat.orders[existingOrderIndex].order_individual_qty += plat.qty;
            } else {
              existingPlat.orders.push({
                order_code: commande.num,
                order_client_name: commande.clientName,
                order_delivery_date: commande.delivery_date,
                order_individual_qty: plat.qty,
                meal_comment: plat.comment,
              });
            }
          } else {
            listePlatsChauds.push({
              meal_name: plat.name,
              meal_category: plat.category,
              meal_code: normalizedCode,
              meal_qty: plat.qty,
              orders: [
                {
                  order_code: commande.num,
                  order_client_name: commande.clientName,
                  order_delivery_date: commande.delivery_date,
                  order_individual_qty: plat.qty,
                  meal_comment: plat.comment,
                },
              ],
            });
          }
        }
      });
    });
  
    const sortedListePlatsChauds = listePlatsChauds.sort((a, b) => {
      const codeA = a.meal_code;
      const codeB = b.meal_code;
  
      // En utilisant la fonction de comparaison de chaînes pour trier les codes dans l'ordre souhaité
      return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
    });
  
    return sortedListePlatsChauds;
}