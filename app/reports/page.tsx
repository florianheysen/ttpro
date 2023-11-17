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
        label: "Global",
        disabled: false,
    },
    {
        name: "commandes",
        label: "Commandes",
        disabled: false,
    },
    {
        name: "meal-hot",
        label: "Plats chauds",
        disabled: false,
    },
    {
        name: "meal-cold",
        label: "Plats froids",
        disabled: false,
    },
    {
        name: "meal-special",
        label: "Plats PL1 à PL5",
        disabled: false,
    },
    {
        name: "meal-huitres",
        label: "Plats d'huîtres ouvertes",
        disabled: false,
    },
    {
        name: "meal-custom",
        label: "Plateaux spéciaux (🚧 en cours)",
        disabled: true,
    },
    {
        name: "mayo",
        label: "Mayonnaise",
        disabled: false,
    },
    {
        name: "vrac-produit",
        label: "Vrac par produit (🚧 en cours)",
        disabled: true,
    },
    {
        name: "vrac-commande",
        label: "Vrac par commande (🚧 en cours)",
        disabled: true,
    },
];

const REPORTS_API_PATH = "/reports/print";
const DEFAULT_TARGET = "global";

const ReportsPage = () => {
    /* const router = useRouter(); */
    const [parentDate, setParentDate] = useState<DateRange | undefined>({ from: new Date(), to: new Date() });
    const [target, setTarget] = useState<string>(DEFAULT_TARGET);

    const { from, to } = parentDate || {};

    const handleSubmit = () => {
        const queryString = `/${target}?target=${target}${from ? `&from=${format(from, "yyyy-MM-dd")}` : ""}${
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
                        onClick={() => setTarget(report.name)}
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
