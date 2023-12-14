import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { customComparator } from "@/lib/utils";

const category = "meal-huitres";

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
    const platsChauds = data.filter((commande, index, array) => {
      const isDuplicate = array.findIndex((cmd) => cmd.num === commande.num) !== index;
      return !isDuplicate && commande.meals.some((plat: { category: string; }) => plat.category === category);
    });
  
    const listePlatsChauds = platsChauds.reduce((acc, commande) => {
      commande.meals.forEach((plat: { category: string; code: any; qty: any; name: any; comment: any; }) => {
        if (plat.category === category) {
          const existingPlat = acc.find((p: { meal_code: any; }) => p.meal_code === plat.code);
          if (existingPlat) {
            // Plat déjà existant, mise à jour de la quantité
            existingPlat.meal_qty += plat.qty;
            // Vérifier si la commande existe déjà pour éviter les doublons
            const existingOrder = existingPlat.orders.find((o: { order_code: any; }) => o.order_code === commande.num);
            if (existingOrder) {
              // Commande existe déjà, mise à jour de la quantité individuelle
              existingOrder.order_individual_qty += plat.qty;
            } else {
              // Commande n'existe pas encore, ajout de la commande
              existingPlat.orders.push({
                order_code: commande.num,
                order_client_name: commande.clientName,
                order_delivery_date: commande.delivery_date,
                order_individual_qty: plat.qty,
                meal_comment: plat.comment,
              });
            }
          } else {
            // Plat n'existe pas encore, ajout du plat avec la première commande
            acc.push({
              meal_name: plat.name,
              meal_category: plat.category,
              meal_code: plat.code,
              meal_qty: plat.qty,
              orders: [{
                order_code: commande.num,
                order_client_name: commande.clientName,
                order_delivery_date: commande.delivery_date,
                order_individual_qty: plat.qty,
                meal_comment: plat.comment,
              }],
            });
          }
        }
      });
      return acc;
    }, []);

    listePlatsChauds.sort((a: { meal_code: any; }, b: { meal_code: any; }) => customComparator(a.meal_code, b.meal_code));
  
    return listePlatsChauds;
  }
  