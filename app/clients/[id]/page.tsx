"use client";

import Appshell from "@/components/appshell";
import React from "react";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { z } from "zod";
import ClientForm from "@/components/form/clientForm";
import LoadingScreen from "@/components/loadingScreen";

function CreateSellerPage({ params }: { params: { id: string } }) {
    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/clients/findOne?id=${params.id}`, fetcher);

    const [client, setClient] = React.useState<any>(null);
    const [isClient, setisClient] = React.useState<any>(false);

    React.useEffect(() => {
        setTimeout(() => {
            setisClient(true);
        }, 200);
    }, [data, isClient]);

    React.useEffect(() => {
        if (data) {
            setClient({ ...data });
        }
    }, [data, isClient]);

    const formSchema = z.object({
        name: z
            .string()
            .nonempty("Le nom est requis")
            .describe("Nom complet")
            .default(client?.name),
        email_address: z
            .string()
            .optional()
            .nullable()
            .describe("Adresse email")
            .default(client?.email_address),
        postal_address: z
            .string()
            .optional()
            .describe("Adresse postale")
            .default(client?.postal_address),
        city: z
            .string()
            .optional()
            .describe("Ville")
            .default(client?.city),
        postal_code: z
            .string()
            .optional()
            .describe("Code postal")
            .default(client?.postal_code),
        phone_fixe: z
            .string()
            .optional()
            .describe("Téléphone fixe")
            .default(client?.phone_fixe),
        phone_port: z
            .string()
            .optional()
            .describe("Téléphone portable")
            .default(client?.phone_port),
    });

    const handleSubmit = async (e: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/clients/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client: {
                    ...client,
                    ...e,
                },
            }),
        });

        console.log(res);
    };

    if (client === null) return <LoadingScreen />;

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Modifier le client</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <ClientForm formSchema={formSchema} handleSubmit={handleSubmit} btnLabel="Modifier le client" />
            </div>
        </Appshell>
    );
}

export default CreateSellerPage;
