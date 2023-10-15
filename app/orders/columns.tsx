"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { FileTextIcon, CardStackMinusIcon, PersonIcon, CopyIcon, Pencil1Icon } from "@radix-ui/react-icons";

import moment from "moment";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export type Order = {
    _id: string;
    num: string;
    created_at: string;
    updated_at: string;
    seller: string;
    client: {
        name: string;
        phone_port: string;
        phone_fixe: string | null;
        city: string;
        postal_code: string;
    };
    consigne: boolean;
    price: string;
    deposit: string;
    totalMayo: string;
    meals: any[];
    specialMeals: {
        finalPrice: number;
        personnes: string;
        qty: number;
        selectedIngredients: {
            id: string;
            name: string;
            price: string;
            qty: string | number;
        }[];
    }[];
    vrac: any[];
};

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "num",
        header: "Numéro",
        size: 100,
        cell: ({ row }) => {
            return (
                <Badge className="rounded px-2 whitespace-nowrap" variant="outline">
                    {row.getValue("num")}
                </Badge>
            );
        },
    },
    {
        accessorKey: "clientName",
        header: "Client",
        size: 250,
    },
    {
        accessorKey: "created_at",
        header: "Créé le",
        cell: ({ row }) => {
            const created_at = row.getValue("created_at") || "";
            const formatted = moment(created_at).format("DD/MM/YYYY");
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "seller",
        header: "Vendeur",
    },
    {
        accessorKey: "price",
        header: "Total",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
            }).format(price);
            return <div>{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="flex gap-2 flex-row justify-end pr-3">
                    <a href={`/orders/${order._id}`}>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Open actions</span>
                            <Pencil1Icon />
                        </Button>
                    </a>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 w-8 p-0">
                                <span className="sr-only">Open actions</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <a href={`/orders/${order._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <CardStackMinusIcon className="mr-2" /> Voir la commande
                                </DropdownMenuItem>
                            </a>
                            <Link href={`/orders/print/${order._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <FileTextIcon className="mr-2" /> Impression
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link href={`/clients/${order.clientId.$oid}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <PersonIcon className="mr-2" /> Voir le client
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(order._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
