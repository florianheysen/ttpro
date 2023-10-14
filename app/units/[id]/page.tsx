"use client";

import Appshell from "@/components/appshell";
import UnitForm from "@/components/form/unitForm";
import React from "react";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { z } from "zod";
import LoadingScreen from "@/components/loadingScreen";

function EditUnitPage({ params }: { params: { id: string } }) {
    const { data } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/units/findOne?id=${params.id}`, fetcher);

    const [unit, setUnit] = React.useState<any>(null);
    const [client, setClient] = React.useState<any>(false);

    React.useEffect(() => {
        setTimeout(() => {
            setClient(true);
        }, 200);
    }, [data, client]);

    React.useEffect(() => {
        if (data) {
            setUnit({ ...data });
        }
    }, [data, client]);

    const formSchema = z.object({
        name: z
            .string()
            .describe("Nom")
            .default(unit?.name),
        symbol: z
            .string()
            .describe("Symbole")
            .default(unit?.symbol),
    });

    const handleSubmit = async (e: any) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/units/updateOne`, {
            method: "POST",
            headers: {
                Accept: "application.json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                unit: {
                    ...unit,
                    ...e,
                },
            }),
        });
        console.log(res);
    };

    if (unit === null) return <LoadingScreen />;

    return (
        <Appshell>
            <div className="flex justify-between pb-8">
                <h1 className="text-3xl font-semibold">Modifier une unité</h1>
            </div>
            <div className="flex items-center space-x-2 py-4">
                <UnitForm handleSubmit={handleSubmit} formSchema={formSchema} btnLabel="Modifier l'unité" />
            </div>
        </Appshell>
    );
}

export default EditUnitPage;
