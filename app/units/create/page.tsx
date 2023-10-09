"use client";

import Appshell from "@/components/appshell";
import UnitForm from "@/components/form/unitForm";
import React from "react";
import { z } from "zod";

function CreateUnitPage() {
    const formSchema = z.object({
        name: z.string().describe("Nom"),
        symbol: z.string().describe("Symbole"),
    });

    const handleSubmit = async (unit: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/createUnit`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ unit: unit }),
        });

        const result = await res.json();

        console.log(result);
    };

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Nouvelle unité</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <UnitForm formSchema={formSchema} handleSubmit={handleSubmit} btnLabel="Créer l'unité" />
            </div>
        </Appshell>
    );
}

export default CreateUnitPage;
