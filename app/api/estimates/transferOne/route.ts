import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { convertOrder } from "@/lib/utils";
import posthog from "@/lib/posthog";
import { auth, clerkClient } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const id: any = url.searchParams.get("id");

    // Récupération du devis
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME);
        const { userId } = auth();
        const user = await clerkClient.users.getUser(userId as string);

        const estimate = await db
            .collection("estimates")
            .find({ _id: new ObjectId(id) })
            .sort({ created_at: -1 })
            .toArray();

        const formattedEstimate = convertOrder(estimate[0]);

        const updateData =(data: any) => {
            const updatedData = {
              ...data,
              num: undefined,
              created_at: new Date().toISOString(),
              delivery_date: new Date().toISOString(),
            };

            delete updatedData._id;
          
            return updatedData;
          }

          const order = updateData(formattedEstimate);

        // Création de la commande à partir du devis
          try {
            const latestOrder = await db.collection("orders").find().limit(1).sort({ created_at: -1 }).toArray();
    
            const lastNum = latestOrder[0].num;
            const nextNum = getNextNum(lastNum);
    
            const result = await db.collection("orders").insertOne({ ...order, num: nextNum });

            // Suppression du devis
            try {
                const res = await db.collection("estimates").deleteOne({ _id: new ObjectId(id) });
                console.log('deleting estimate:', res)
                
            } catch (e) {
                console.error(e);
            }
    
            posthog.capture({
                distinctId: userId as string,
                event: "Commande - Tranfer Devis",
                properties: {
                    $set: { email: user.emailAddresses[0].emailAddress },
                    mongoRes: result,
                },
            });
    
            const resClient = {
                ...order,
                _id: result.insertedId,
            };
    
            return NextResponse.json(resClient);
        } catch (e) {
            console.error(e);
        }

    } catch (e) {
        console.error(e);
    }
}

function getNextNum(input: string): string {
    const parts = input.split("/");
    if (parts.length !== 2) {
        throw new Error("Format de chaine invalide. Utilisez le format 'numéro/année'.");
    }

    const numero = parseInt(parts[0]);
    const annee = parseInt(parts[1]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    let nouveauNumero: number;
    if (annee === currentYear) {
        nouveauNumero = numero + 1;
    } else {
        nouveauNumero = 1;
    }

    return `${nouveauNumero}/${currentYear}`;
}
