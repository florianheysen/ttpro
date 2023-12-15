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

        return NextResponse.json(extractVracItemsWithOrders(orders));
    } catch (e) {
        console.error(e);
    }
}

function extractVracItemsWithOrders(orders: any[]) {
    const sortedOrders = [...orders].sort((a, b) => {
        const orderNumA = parseInt(a.num.split('/')[0]);
        const orderNumB = parseInt(b.num.split('/')[0]);
        return orderNumA - orderNumB;
      });

    const vracMap = new Map();
  
    sortedOrders.forEach(order => {
      const vracItems = order.vrac;
  
      if (vracItems && vracItems.length > 0) {
        vracItems.forEach((item: any) => {
          const itemName = item.name;
          const itemQty = item.qty;
          const accompte = order.accompte || 0;
          const total = order.price || 0;
          const reste = total.toFixed(2) - accompte.toFixed(2);
  
          // Check if the vrac item is already in the map
          if (vracMap.has(itemName)) {
            const existingItem = vracMap.get(itemName);
            existingItem.totalQty += itemQty;
            existingItem.orders.push({
              orderNum: order.num,
              deliveryDate: order.delivery_date,
              clientName: order.clientName,
              vracQty: itemQty,
              vracComment: item.comment || "",
              reste: reste,
            });
          } else {
            // Create a new entry in the map
            const newItem = {
              totalQty: itemQty,
              itemName: itemName,
              orders: [
                {
                  orderNum: order.num,
                  deliveryDate: order.delivery_date,
                  clientName: order.clientName,
                  vracQty: itemQty,
                  vracComment: item.comment || "",
                  reste: reste,
                },
              ],
            };
            vracMap.set(itemName, newItem);
          }
        });
      }
    });
  
    // Convert the Map values to an array
    const resultArray = Array.from(vracMap.values()).sort((a, b) =>
        a.itemName.localeCompare(b.itemName)
    );
  
    return resultArray;
  }