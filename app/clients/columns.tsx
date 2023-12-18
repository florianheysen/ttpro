"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { PersonIcon, CopyIcon, TrashIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function handleCopyID(id: string) {
    navigator.clipboard.writeText(id);
    toast("Identifiant copié dans le presse papier");
}

const apiUrl = `${process.env.NEXT_PUBLIC_URL}/api/clients/deleteOne`;

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
            toast.error("La suppression du client a échoué.");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression du client", error);
        toast.error("Une erreur s'est produite lors de la suppression du client.");
    }
};

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "NOM",
    },
    {
        accessorKey: "city",
        header: "VILLE",
    },
    {
        accessorKey: "phone_fixe",
        header: "TEL",
    },
    {
        accessorKey: "phone_port",
        header: "PORTABLE",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const client = row.original;
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
                            <Link href={`/clients/${client._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <PersonIcon className="mr-2" /> Modifier le client
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(client._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <span className="hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
                                        <TrashIcon className="mr-2" /> Supprimer le client
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action ne peut pas être annulée. Elle supprimera définitivement le
                                            client <b className="text-gray-800">{client.name}</b>. Les commandes liées ne seront pas supprimées.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <Button onClick={() => handleDelete(client._id)} variant="destructive">
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
