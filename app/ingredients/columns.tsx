"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { CopyIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";

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
import { formatPrice } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/ingredients/deleteOne`;

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
            toast.error("La suppression de l'ingrédient a échoué.");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression de l'ingrédient", error);
        toast.error("Une erreur s'est produite lors de la suppression de l'ingrédient.");
    }
};

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
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <span className="hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
                                        <TrashIcon className="mr-2" /> Supprimer l&apos;ingrédient
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action ne peut pas être annulée. Elle supprimera définitivement
                                            l&apos;ingrédient <b className="text-gray-800">{ingredient.name}</b>. Les
                                            plats liées ne seront pas supprimées.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <Button onClick={() => handleDelete(ingredient._id)} variant="destructive">
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
