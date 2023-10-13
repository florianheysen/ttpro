"use client";

import Appshell from "@/components/appshell";
import ClientForm from "@/components/form/clientForm";
import React from "react";
import { z } from "zod";

function CreateClientPage() {
    const formSchema = z.object({
        name: z.string().describe("Nom complet"),
        email_address: z.string().email().optional().nullable().describe("Adresse email"),
        postal_address: z.string().optional().describe("Adresse postale"),
        city: z.string().optional().describe("Ville"),
        postal_code: z.string().optional().describe("Code postal"),
        phone_fixe: z.string().optional().describe("Téléphone fixe"),
        phone_port: z.string().optional().describe("Téléphone portable"),
    });

    const handleSubmit = async (client: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients/insertOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ client: client }),
        });

        const result = await res.json();

        console.log(result);
    };

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Nouveau client</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <ClientForm formSchema={formSchema} handleSubmit={handleSubmit} btnLabel="Créer le client" />
            </div>
        </Appshell>
    );
}

export default CreateClientPage;
