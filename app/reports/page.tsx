"use client";

import Appshell from "@/components/appshell";
import React, { useState } from "react";
import { DatePickerWithRange } from "./datepicker";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
/* import { useRouter } from "next/navigation"; */

const reports = [
    {
        name: "global",
        target: "global",
        label: "Global",
        disabled: false,
    },
    {
        name: "commandes",
        target: "commandes",
        label: "Commandes",
        disabled: false,
    },
    {
        name: "meal-hot",
        target: "meal-hot",
        label: "Plats chauds",
        disabled: false,
    },
    {
        name: "meal-cold",
        target: "meal-cold",
        label: "Plats froids",
        disabled: false,
    },
    {
        name: "meal-special",
        target: "meal-special",
        label: "Plats PL1 à PL5",
        disabled: false,
    },
    {
        name: "meal-huitres",
        target: "meal-huitres",
        label: "Plats d'huîtres ouvertes",
        disabled: false,
    },
    {
        name: "meal-custom",
        target: "meal-custom",
        label: "Plateaux spéciaux",
        disabled: false,
    },
    {
        name: "meal-custom-short",
        target: "meal-custom",
        label: "Plateaux spéciaux court",
        disabled: false,
    },
    {
        name: "mayo",
        target: "mayo",
        label: "Mayonnaise",
        disabled: false,
    },
    {
        name: "vrac-produit",
        target: "vrac-produit",
        label: "Vrac par produit",
        disabled: false,
    },
    {
        name: "vrac-commande",
        target: "vrac-commande",
        label: "Vrac par commande",
        disabled: false,
    },
];

const REPORTS_API_PATH = "/reports/print";
const DEFAULT_TARGET = "global";

const ReportsPage = () => {
    /* const router = useRouter(); */
    const [parentDate, setParentDate] = useState<DateRange | undefined>({ from: new Date(), to: new Date() });
    const [name, setName] = useState<string>(DEFAULT_TARGET);
    const [target, setTarget] = useState<string>(DEFAULT_TARGET);

    const { from, to } = parentDate || {};

    const handleSubmit = () => {
        const queryString = `/${name}?target=${target}${from ? `&from=${format(from, "yyyy-MM-dd")}` : ""}${
            to ? `&to=${format(to, "yyyy-MM-dd")}` : ""
        }`;
        window.open(`${REPORTS_API_PATH}${queryString}`, "_ blank");
    };

    const renderRadioGroup = () => (
        <RadioGroup className="space-y-3" defaultValue={DEFAULT_TARGET}>
            {reports.map((report: any) => (
                <div key={report.name} className="flex items-center space-x-2">
                    <RadioGroupItem
                        disabled={report.disabled}
                        value={report.name}
                        id={report.name}
                        onClick={() => {
                            setTarget(report.target);
                            setName(report.name);
                        }}
                    />
                    <Label className={report.disabled && "opacity-50 cursor-not-allowed"} htmlFor={report.name}>
                        {report.label}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    );

    return (
        <Appshell>
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-4">
                    <p className="flex gap-2 text-sm">
                        <span className="opacity-40">Comptes rendus</span>
                        <span className="opacity-40">/</span>
                        <span className="font-medium">Création</span>
                    </p>
                    <h1 className="text-3xl font-semibold">Comptes rendus</h1>
                    <div className="mb-2">
                        <p className="text-sm mb-1">Intervalle de dates</p>
                        <DatePickerWithRange date={parentDate} setDate={setParentDate} />
                    </div>
                    {renderRadioGroup()}
                    <Button className="mt-2" onClick={handleSubmit}>
                        Créer le PDF <ExternalLinkIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </Appshell>
    );
};

export default ReportsPage;
