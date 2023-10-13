"use client";

import Appshell from "@/components/appshell";
import SellerForm from "@/components/form/sellerForm";
import React from "react";
import { z } from "zod";

function CreateSellerPage() {
    const formSchema = z.object({
        name: z.string().describe("Nom"),
    });

    const handleSubmit = async (seller: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sellers/insertOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ seller: seller }),
        });

        const result = await res.json();

        console.log(result);
    };

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Nouveau vendeur</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <SellerForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Créer le vendeur" />
            </div>
        </Appshell>
    );
}

export default CreateSellerPage;
