"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { MoreHorizontal } from "lucide-react";
import { Pencil2Icon, CopyIcon, TrashIcon } from "@radix-ui/react-icons";

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
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
        id: "actions",
        cell: ({ row }) => {
            const seller = row.original;
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
                            <Link href={`/sellers/${seller._id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Pencil2Icon className="mr-2" /> Modifier le vendeur
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopyID(seller._id)}>
                                <CopyIcon className="mr-2" /> Copier l&apos;identifiant
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <span className="hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent">
                                        <TrashIcon className="mr-2" /> Supprimer le vendeur
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action ne peut être annulée. Elle supprimera définitivement le vendeur{" "}
                                            "{seller.name}."
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <Button variant="destructive">Supprimer définitivement</Button>
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
