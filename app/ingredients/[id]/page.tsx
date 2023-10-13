"use client";

import Appshell from "@/components/appshell";
import IngredientForm from "@/components/form/ingredientForm";
import React from "react";
import { z } from "zod";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

function CreateIngredientPage({ params }: { params: { id: string } }) {
    const { data: units } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/units/search`, fetcher);
    const { data: ingredient } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api/ingredients/findOne?id=${params.id}`,
        fetcher
    );

    if (!units || !ingredient) return <div>Chargement...</div>;

    const unitEnum = units.units.map((unit: any) => unit.name);

    const handleSubmit = async (formData: any) => {
        const unitObject = units.units.find((unit: any) => unit.name.toLowerCase() === formData.unit.toLowerCase());

        console.log(formData);

        if (unitObject) {
            formData.unit = {
                name: unitObject.name,
                symbol: unitObject.symbol,
            };
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/ingredients/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ingredient: {
                    ...ingredient,
                    ...formData,
                },
            }),
        });

        const result = await res.json();

        console.log(result);
    };

    const formSchema = z.object({
        name: z
            .string()
            .describe("Nom")
            .default(ingredient?.name),
        price: z.coerce
            .number()
            .describe("Prix (en €)")
            .default(ingredient?.price),
        unit: z
            .enum(unitEnum)
            .describe("Unité")
            .default(ingredient?.unit.name),
        is_sp: z
            .boolean()
            .optional()
            .describe("Disponible en plateau spécial")
            .default(ingredient?.is_sp),
        is_vrac: z
            .boolean()
            .optional()
            .describe("Disponible en vrac")
            .default(ingredient?.is_vrac),
    });

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Modifier un ingrédient</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <IngredientForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Modifier l'ingrédient" />
            </div>
        </Appshell>
    );
}

export default CreateIngredientPage;
