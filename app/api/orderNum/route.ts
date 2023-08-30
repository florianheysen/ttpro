import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("TTPRO_LAMAREEBARLIN");

        const order = await db.collection("orders").find().limit(1).sort({ created_at: -1 }).toArray();

        const lastNum = order[0].num;

        const nextNum = getNextNum(lastNum);

        return NextResponse.json(nextNum);
    } catch (e) {
        console.error(e);
    }
}
