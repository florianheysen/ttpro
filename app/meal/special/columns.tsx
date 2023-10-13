"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { Pencil2Icon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { formatPrice } from "@/lib/utils";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "mealCode",
        header: "CODE",
        size: 80,
        cell: ({ row }) => {
            const meal = row.original;
            return (
                <Badge className="rounded px-2 whitespace-nowrap" variant="outline">
                    {meal.mealCode}
                </Badge>
            );
        },
    },
    {
        accessorKey: "mealName",
        header: "NOM",
        size: 350,
    },
    {
        accessorKey: "mealPrice",
        header: "PRIX",
        cell: ({ row }) => {
            const meal = row.original;
            return <>{formatPrice(meal.mealPrice)}</>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const meal = row.original;
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
                            <Link href={`/meal/special/${meal._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Pencil2Icon className="mr-2" /> Modifier le plat
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(meal._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
