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

        const test = processMayoOrders(orders);

        return NextResponse.json(test);
    } catch (e) {
        console.error(e);
    }
}

function processMayoOrders(data: any[]): any {
    const results: any = {
        totalMayo: 0,
        totalPots: {
            veryLarge: 0,
            large: 0,
            medium: 0,
            small: 0,
        },
    };

    function distributeMayoByPot(totalMayo: any) {
        const potSizes = [800, 550, 300, 100];
        const potCount = [0, 0, 0, 0];

        for (let i = 0; i < potSizes.length; i++) {
            potCount[i] = Math.floor(totalMayo / potSizes[i]);
            totalMayo %= potSizes[i];
        }

        for (let i = potCount.length - 1; i > 0; i--) {
            while (potCount[i] >= 2) {
                const combinedSize = potSizes[i] + potSizes[i - 1];
                const combinedCount = Math.floor(potCount[i] / 2);
                potCount[i - 1] += combinedCount;
                potCount[i] -= combinedCount * 2;
                totalMayo -= combinedCount * combinedSize;
            }
        }

        return {
            veryLargePotCount: potCount[0],
            largePotCount: potCount[1],
            mediumPotCount: potCount[2],
            smallPotCount: potCount[3],
            remainingMayo: totalMayo,
        };
    }

    for (const order of data) {
        const { totalMayo } = order;
        if (totalMayo !== undefined && totalMayo !== 0) {
            const { veryLargePotCount, largePotCount, mediumPotCount, smallPotCount } = distributeMayoByPot(totalMayo);
            results.totalMayo += totalMayo;
            results.totalPots.veryLarge += veryLargePotCount;
            results.totalPots.large += largePotCount;
            results.totalPots.medium += mediumPotCount;
            results.totalPots.small += smallPotCount;
        }
    }

    return results.totalMayo > 0 ? results : null;
}
