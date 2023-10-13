"use client";

import Appshell from "@/components/appshell";
import SellerForm from "@/components/form/sellerForm";
import React from "react";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { z } from "zod";

function CreateSellerPage({ params }: { params: { id: string } }) {
    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/sellers/findOne?id=${params.id}`, fetcher);

    const [seller, setSeller] = React.useState<any>(null);
    const [client, setClient] = React.useState<any>(false);

    React.useEffect(() => {
        setTimeout(() => {
            setClient(true);
        }, 200);
    }, [data, client]);

    React.useEffect(() => {
        if (data) {
            setSeller({ ...data });
        }
    }, [data, client]);

    const formSchema = z.object({
        name: z
            .string()
            .describe("Nom")
            .default(seller?.name),
    });

    const handleSubmit = async (e: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sellers/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                seller: {
                    ...seller,
                    name: e.name,
                },
            }),
        });

        console.log(e);

        console.log(res);
    };

    if (seller === null) return "Loading...";

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Modifier un vendeur</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <SellerForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Modifier le vendeur" />
            </div>
        </Appshell>
    );
}

export default CreateSellerPage;
