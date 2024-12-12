import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";
import posthog from "@/lib/posthog";
import moment from "moment-timezone"; // Importez moment-timezone

export async function POST(req: Request) {
    const { order } = await req.json();
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId as string);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const latestOrder = await db.collection("orders").find().limit(1).sort({ created_at: -1 }).toArray();

        const lastNum = latestOrder[0].num;
        const nextNum = getNextNum(lastNum);

        const result = await db.collection("orders").insertOne({
            ...order,
            num: nextNum,
            created_at: moment().tz("Europe/Paris").format("YYYY-MM-DDTHH:mm:ss.SSSSSS"), // Conversion en heure française
        });

        posthog.capture({
            distinctId: userId as string,
            event: "Commande - Création",
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
