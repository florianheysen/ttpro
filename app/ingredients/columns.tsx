"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { CopyIcon, Pencil2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "NOM",
    },
    {
        accessorKey: "price",
        header: "PRIX",
        cell: ({ row }) => {
            const ingredient = row.original;
            return <>{formatPrice(ingredient.price)}</>;
        },
    },
    {
        accessorKey: "is_vrac",
        header: "VRAC",
        cell: ({ row }) => {
            const ingredient = row.original;
            return <Checkbox className="!opacity-100 !cursor-default" disabled defaultChecked={ingredient.is_vrac} />;
        },
    },
    {
        accessorKey: "is_sp",
        header: "SP",
        cell: ({ row }) => {
            const ingredient = row.original;
            return <Checkbox className="!opacity-100 !cursor-default" disabled defaultChecked={ingredient.is_sp} />;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const ingredient = row.original;
            return (
                <div className="flex flex-col items-end pr-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open actions</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/ingredients/${ingredient._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Pencil2Icon className="mr-2" />
                                    Modifier l&apos;ingrédient
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(ingredient._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
