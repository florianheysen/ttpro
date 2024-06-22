"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { FileTextIcon, CardStackMinusIcon, PersonIcon, CopyIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

import moment from "moment";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

export type Estimates = {
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

const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/estimates/deleteOne`;

const handleDelete = async (id: string) => {
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        });

        if (res.ok && res.status === 200) {
            window.location.reload();
        } else {
            toast.error("La suppression du devis a échoué.");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression du devis", error);
        toast.error("Une erreur s'est produite lors de la suppression du devis.");
    }
};

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
    /* {
        accessorKey: "delivery_date",
        header: "Livraison",
        cell: ({ row }) => {
            const delivery_date = row.getValue("delivery_date") || "";
            const formatted = moment(delivery_date).format("DD/MM/YYYY");
            return <div>{formatted}</div>;
        },
    }, */
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
            const estimate = row.original;
            return (
                <div className="flex gap-2 flex-row justify-end pr-3">
                    <a href={`/estimates/${estimate._id}`}>
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
                            <a href={`/estimates/${estimate._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <CardStackMinusIcon className="mr-2" /> Voir le devis
                                </DropdownMenuItem>
                            </a>
                            <Link href={`/estimates/print/${estimate._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <FileTextIcon className="mr-2" /> Imprimer
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link href={`/clients/${estimate.clientId.$oid}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <PersonIcon className="mr-2" /> Voir le client
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(estimate._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <span className="hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
                                        <TrashIcon className="mr-2" /> Supprimer le devis
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action ne peut pas être annulée. Elle supprimera définitivement le
                                            devis{" "}
                                            <Badge className="rounded px-2 whitespace-nowrap" variant="outline">
                                                {estimate.num}
                                            </Badge>{" "}
                                            de {estimate.clientName}.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <Button onClick={() => handleDelete(estimate._id)} variant="destructive">
                                            Supprimer définitivement
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
