import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth, clerkClient } from "@clerk/nextjs";
import posthog from "@/lib/posthog";

export async function POST(req: Request) {
    const { estimate } = await req.json();
    const { userId } = auth();
    const user = await clerkClient.users.getUser(userId as string);

    try {
        const mongo = await clientPromise;
        const db = mongo.db(process.env.MONGO_DB_NAME);
        const latestEstimate = await db.collection("estimates").find().limit(1).sort({ created_at: -1 }).toArray();

        const lastNum = latestEstimate[0]?.num;
        const nextNum = getNextNum(lastNum);

        const currentDate = new Date();

        const result = await db.collection("estimates").insertOne({ ...estimate, num: nextNum });

        posthog.capture({
            distinctId: userId as string,
            event: "Devis - Création",
            properties: {
                $set: { email: user.emailAddresses[0].emailAddress },
                mongoRes: result,
            },
        });

        const resClient = {
            ...estimate,
            _id: result.insertedId,
        };

        return NextResponse.json(resClient);
    } catch (e) {
        console.error(e);
    }
}

function getNextNum(input: string): string {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    if (input === undefined) {
        return `1/${currentYear}`;
    }
    const parts = input.split("/");
    if (parts.length !== 2) {
        throw new Error("Format de chaine invalide. Utilisez le format 'numéro/année'.");
    }

    const numero = parseInt(parts[0]);
    const annee = parseInt(parts[1]);

    let nouveauNumero: number;
    if (annee === currentYear) {
        nouveauNumero = numero + 1;
    } else {
        nouveauNumero = 1;
    }

    return `${nouveauNumero}/${currentYear}`;
}
