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

        return NextResponse.json(formatOrders(orders));
    } catch (e) {
        console.log(e);
    }
}

function formatOrders(orders: any[]) {
    const formattedOrders = orders
      .filter(order => order.vrac.length > 0)
      .map(order => {
        const calculateReste = () => {
          if (order && order.price !== undefined && order.accompte !== undefined) {
            return (order.price - order.accompte).toFixed(2);
          }
          return undefined;
        };
  
        return {
          _id: order?._id,
          num: order?.num,
          delivery_date: order?.delivery_date,
          clientName: order?.clientName,
          reste: calculateReste(),
          vrac: order?.vrac.map((item: any) => ({
            name: item?.name,
            qty: item?.qty,
            comment: item?.comment,
          })),
        };
      })
      .sort((a, b) => {
        const numA = parseInt(a.num.split('/')[0]);
        const numB = parseInt(b.num.split('/')[0]);
        return numA - numB;
      });
  
    return formattedOrders;
  }