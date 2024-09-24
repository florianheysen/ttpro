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

    /* Algo v2 (apparently not working)

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
    } */

    // TODO: Algo v1 (ask if it works)
    function distributeMayoByPot(totalMayo: any) {
        const potSizes = [800, 550, 300, 100];
        let sumMayo = totalMayo;
        let res: any = {};

        // Traditional for loop to iterate through potSizes
        for (let index = 0; index < potSizes.length; index++) {
            const value = potSizes[index];
            let temp = Math.floor(sumMayo / value);
            sumMayo = sumMayo % value;
            res[index] = temp;

            // If there's still remaining mayo, increment the smallest pot count
            if (sumMayo > 0 && index === potSizes.length - 1) {
                res[3] += 1;
            }
        }

        // Return results in the original format
        return {
            veryLargePotCount: res[0] || 0,
            largePotCount: res[1] || 0,
            mediumPotCount: res[2] || 0,
            smallPotCount: res[3] || 0,
            remainingMayo: sumMayo,
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
