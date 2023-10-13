import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

interface AppTableHeadProps {
    title: string;
    currentPage: string;
    btnLabel: string;
    btnLink: string;
    count: number;
}

function AppTableHead({ title, currentPage, btnLabel, btnLink, count }: AppTableHeadProps) {
    return (
        <div className="flex justify-between items-end">
            <div className="flex flex-col gap-4">
                <p className="flex gap-2 text-sm">
                    <span className="opacity-40">{title}</span>
                    <span className="opacity-40">/</span>
                    <span className="font-medium">{currentPage}</span>
                    <span className="opacity-40">{count === 0 ? "—" : count}</span>
                </p>
                <h1 className="text-3xl font-semibold">{title}</h1>
            </div>
            <Button variant="outline" asChild>
                <Link href={btnLink}>
                    <CardStackPlusIcon className="mr-2 h-4 w-4" /> {btnLabel}
                </Link>
            </Button>
        </div>
    );
}

export default React.memo(AppTableHead);
