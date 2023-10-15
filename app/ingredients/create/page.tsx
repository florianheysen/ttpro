"use client";

import Appshell from "@/components/appshell";
import IngredientForm from "@/components/form/ingredientForm";
import React from "react";
import { z } from "zod";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import LoadingScreen from "@/components/loadingScreen";
import { useRouter } from "next/navigation";

function CreateIngredientPage() {
    const router = useRouter();

    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/units/search`, fetcher);

    if (!data) return <LoadingScreen />;

    const unitEnum = data.units.map((unit: any) => unit.name);

    const handleSubmit = async (ingredient: any) => {
        const unitObject = data.units.find((unit: any) => unit.name.toLowerCase() === ingredient.unit.toLowerCase());

        if (unitObject) {
            ingredient.unit = {
                name: unitObject.name,
                symbol: unitObject.symbol,
            };
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ingredients/insertOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ingredient: ingredient }),
        });

        const result = await res.json();

        console.log(result);

        router.push(`/ingredients/`);
    };

    const formSchema = z.object({
        name: z.string().describe("Nom"),
        price: z.coerce.number().describe("Prix"),
        unit: z.enum(unitEnum).describe("Unité"),
        is_sp: z.boolean().optional().describe("Disponible en plateau spécial"),
        is_vrac: z.boolean().optional().describe("Disponible en vrac"),
    });

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Nouvel ingrédient</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <IngredientForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Créer l'ingrédient" />
            </div>
        </Appshell>
    );
}

export default CreateIngredientPage;
